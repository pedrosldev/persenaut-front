// src/hooks/useProfileForm.js
import { useState, useCallback } from 'react';
import { getProfile, updateProfile } from '../services/profileService';

/**
 * Hook para manejar el formulario de perfil
 * @param {object} user - Usuario actual
 * @param {Function} onProfileUpdate - Callback cuando el perfil se actualiza
 * @returns {object} - Estado y funciones del formulario
 */
export const useProfileForm = (user, onProfileUpdate) => {
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    email: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    username: '',
    email: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validaciones
  const validateEmail = (email) => {
    if (!email || typeof email !== 'string') return 'El email es requerido';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return 'El email es requerido';
    if (!emailRegex.test(email)) return 'El formato del email no es válido';
    return '';
  };

  const validateName = (name) => {
    if (!name || typeof name !== 'string') return 'El nombre es requerido';
    if (!name.trim()) return 'El nombre es requerido';
    if (name.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
    return '';
  };

  const validateUsername = (username) => {
    if (!username || typeof username !== 'string') return 'El nombre de usuario es requerido';
    if (!username.trim()) return 'El nombre de usuario es requerido';
    if (username.trim().length < 3) return 'El nombre de usuario debe tener al menos 3 caracteres';
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) return 'Solo letras, números, guiones y guiones bajos';
    return '';
  };

  const validateProfile = () => {
    const newErrors = {
      name: validateName(profile.name),
      username: validateUsername(profile.username),
      email: validateEmail(profile.email),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  // Cargar perfil
  const loadProfile = useCallback(async () => {
    try {
      const profileData = await getProfile();
      setProfile(profileData);
      return { success: true };
    } catch (error) { // eslint-disable-line no-unused-vars
      setProfile({
        name: user.name,
        username: user.username,
        email: user.email,
      });
      return { success: false, error: 'Error al cargar el perfil' };
    }
  }, [user.name, user.username, user.email]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validar al perder el foco
  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';

    switch (name) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'name':
        error = validateName(value);
        break;
      case 'username':
        error = validateUsername(value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Guardar perfil
  const saveProfile = async () => {
    // Validar que el perfil tenga datos antes de validar
    if (!profile || !profile.name || !profile.username || !profile.email) {
      return { success: false, error: 'Datos del perfil incompletos' };
    }

    if (!validateProfile()) {
      // Scroll al primer error
      const firstErrorField = Object.keys(errors).find((key) => errors[key]);
      if (firstErrorField) {
        document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      return { success: false, error: 'Por favor corrige los errores en el formulario' };
    }

    setIsLoading(true);
    try {
      const updatedProfile = await updateProfile(profile);
      setProfile(updatedProfile);
      setIsEditing(false);
      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }
      return { success: true, message: 'Perfil actualizado correctamente' };
    } catch (error) {
      // Mantener el formulario en modo edición cuando hay error del servidor
      return { success: false, error: error.message || 'Error al actualizar el perfil' };
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelar edición
  const cancelEdit = () => {
    loadProfile();
    setIsEditing(false);
    setErrors({ name: '', username: '', email: '' });
  };

  return {
    profile,
    errors,
    isEditing,
    isLoading,
    setIsEditing,
    loadProfile,
    handleChange,
    handleBlur,
    saveProfile,
    cancelEdit,
  };
};
