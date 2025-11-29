# 🧠 Persenaut

> Plataforma interactiva de aprendizaje personalizado con IA

Persenaut es una aplicación web que utiliza inteligencia artificial para crear experiencias de aprendizaje personalizadas, permitiendo a los usuarios generar desafíos, realizar revisiones intensivas y llevar un seguimiento de su progreso académico.

## ✨ Características principales

- 🎯 **Desafíos personalizados**: Genera preguntas y ejercicios adaptados a tus temas de estudio
- 📚 **Gestión de notas**: Organiza y almacena tus apuntes por temas
- 🔄 **Revisión intensiva**: Sesiones de repaso gamificadas con múltiples preguntas
- 📊 **Métricas y estadísticas**: Visualiza tu progreso y rendimiento
- 🎨 **Temas personalizables**: Administra tus áreas de estudio
- 👨‍🏫 **Tutor IA**: Obtén consejos y retroalimentación personalizada
- 🔐 **Sistema de autenticación**: Registro e inicio de sesión seguro
- ⚙️ **Perfil de usuario**: Gestiona tu información y preferencias

## ⚡ Inicio Rápido

### Prerequisitos

- Node.js (v16 o superior)
- npm o yarn
- Backend de Persenaut corriendo (puerto 3000 por defecto)

### Instalación

1. **Clona el repositorio**

```bash
git clone https://github.com/pedrosldev/persenaut-front.git
cd persenaut-front
```

2. **Instala las dependencias**

```bash
npm install
```

3. **Configura las variables de entorno**

```bash
cp .env.example .env.local
```

Edita `.env.local` con la URL de tu backend:

```env
VITE_API_ENDPOINT=http://localhost:3000/api/reto
# ... (ver .env.example para la lista completa)
```

4. **Inicia el servidor de desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🛠️ Scripts disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la build de producción
npm run lint         # Ejecuta el linter
```

## 📁 Estructura del proyecto

```
persenaut-front/
├── public/
│   └── persenaut.svg        # Logo de la aplicación
├── src/
│   ├── components/
│   │   ├── Auth/            # Componentes de autenticación
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Pages/           # Páginas principales
│   │   │   ├── Landing.jsx
│   │   │   └── Demo.jsx
│   │   ├── Common/          # Componentes reutilizables
│   │   │   ├── QuestionDisplay.jsx
│   │   │   └── QuestionForm.jsx
│   │   ├── Dashboard/       # Componentes del dashboard
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DashboardContent.jsx
│   │   │   ├── ChallengesContent.jsx
│   │   │   ├── ChallengeResolver.jsx
│   │   │   ├── NotesContent.jsx
│   │   │   ├── NotificationsPanel.jsx
│   │   │   ├── SettingsContent.jsx
│   │   │   ├── MetricsDashboard.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── MainContent.jsx
│   │   │   └── Footer.jsx
│   │   ├── IntensiveReview/ # Sistema de revisión intensiva
│   │   │   ├── IntensiveReview.jsx
│   │   │   ├── SessionConfig.jsx
│   │   │   ├── SessionGame.jsx
│   │   │   └── SessionResults.jsx
│   │   ├── Themes/          # Gestión de temas
│   │   │   └── ThemeManager.jsx
│   │   └── TutorPanel.jsx   # Panel del tutor IA
│   ├── hooks/
│   │   └── useQuestionHistory.js
│   ├── services/
│   │   ├── apiService.js
│   │   ├── authService.js
│   │   ├── notificationService.js
│   │   ├── profileService.js
│   │   ├── promptService.js
│   │   └── themeService.js
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── package.json
└── vite.config.js
```

## 🎨 Tecnologías utilizadas

- **React 18** - Librería de UI
- **React Router** - Navegación
- **Vite** - Build tool y dev server
- **CSS Modules** - Estilos con scope local
- **Groq API** - Inteligencia artificial

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cierre de sesión
- `GET /api/auth/check-auth` - Verificación de sesión

### Desafíos
- `POST /api/reto` - Generar nuevo desafío
- `POST /api/save-response` - Guardar respuesta
- `GET /api/pending-challenges` - Obtener desafíos pendientes

### Revisión Intensiva
- `POST /api/intensive-review/start` - Iniciar sesión
- `GET /api/intensive-review/user-themes` - Obtener temas
- `POST /api/intensive-review/save-results` - Guardar resultados

### Otros
- `GET /api/metrics` - Métricas y estadísticas
- `GET /api/themes` - Gestión de temas
- `POST /api/tutor-advice` - Consejos del tutor IA
- `GET /api/user` - Perfil de usuario

## 🚧 Estado del Proyecto

Este proyecto representa mi enfoque de aprendizaje activo en desarrollo full-stack, combinando conocimientos fundamentales con herramientas modernas de desarrollo asistido por IA.

### 💡 Filosofía de Desarrollo

He utilizado herramientas de IA (como GitHub Copilot y asistentes de código) como **acelerador del aprendizaje**, no como sustituto. Cada decisión de arquitectura, patrón de diseño y solución implementada ha sido:
- 📖 **Analizada y comprendida** antes de su implementación
- 🎯 **Alineada con mejores prácticas** de la industria
- 🔍 **Revisada críticamente** para entender el por qué, no solo el cómo
- 🛠️ **Base para refactorización manual** continua aplicando mis propios criterios

El objetivo es acelerar el desarrollo del MVP mientras consolido conocimientos, permitiéndome enfocarme en la arquitectura, lógica de negocio y mejores prácticas, en lugar de solo en la sintaxis.

### ✅ Implementado
- Sistema de autenticación completo con gestión de sesiones
- Generación de desafíos personalizados con IA (Groq)
- Dashboard interactivo con múltiples secciones
- Gestión completa de perfil de usuario
- Sistema de revisión intensiva gamificada
- Métricas y seguimiento de progreso
- Gestión de temas y notas
- Arquitectura modular y escalable

### 🔨 En Desarrollo Activo
- Refactorización manual de componentes
- Suite de testing automatizado (Jest, React Testing Library)
- Implementación de CI/CD pipelines
- Optimización de rendimiento
- Mejoras de accesibilidad (a11y)
- Aplicación de patrones de diseño avanzados

### 📅 Roadmap
- Migración a TypeScript (con comprensión profunda de tipos)
- Dockerización y orquestación
- Progressive Web App (PWA)
- Internacionalización (i18n)
- Sistema de notificaciones en tiempo real
- Implementación de arquitectura hexagonal

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: add amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan el código)
- `refactor:` Refactorización de código
- `test:` Añadir o modificar tests
- `chore:` Tareas de mantenimiento

## 👤 Autor

**Pedro** - [@pedrosldev](https://github.com/pedrosldev)

## 🙏 Agradecimientos

- A todos los contribuidores del proyecto
- Comunidad de React
- [Groq](https://groq.com) por la API de IA

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!