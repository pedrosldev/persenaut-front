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
│   │   │   ├── Login.module.css
│   │   │   ├── Register.jsx
│   │   │   └── Register.module.css
│   │   ├── Pages/           # Páginas principales
│   │   │   ├── Landing.jsx
│   │   │   ├── Landing.module.css
│   │   │   ├── Demo.jsx
│   │   │   └── Demo.module.css
│   │   ├── Common/          # Componentes reutilizables
│   │   │   ├── QuestionDisplay.jsx
│   │   │   ├── QuestionDisplay.module.css
│   │   │   ├── QuestionForm.jsx
│   │   │   └── QuestionForm.module.css
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
│   │   │   ├── Footer.jsx
│   │   │   └── *.module.css  # Estilos modulares
│   │   ├── IntensiveReview/ # Sistema de revisión intensiva
│   │   │   ├── IntensiveReview.jsx
│   │   │   ├── SessionConfig.jsx
│   │   │   ├── SessionGame.jsx
│   │   │   ├── SessionResults.jsx
│   │   │   └── *.module.css
│   │   ├── Themes/          # Gestión de temas
│   │   │   ├── ThemeManager.jsx
│   │   │   └── ThemeManager.module.css
│   │   └── TutorPanel.jsx   # Panel del tutor IA
│   ├── config/              # 🆕 Configuración centralizada
│   │   └── api.js           # Endpoints de API
│   ├── hooks/               # 🆕 Custom React Hooks
│   │   ├── useQuestionHistory.js
│   │   ├── useProfileForm.js      # Hook de gestión de perfil
│   │   ├── usePasswordChange.js   # Hook de cambio de contraseña
│   │   ├── useAccountDeletion.js  # Hook de eliminación de cuenta
│   │   └── useMessage.js          # Hook de mensajes de feedback
│   ├── lib/                 # 🆕 Utilidades y helpers
│   │   └── httpClient.js    # Cliente HTTP centralizado
│   ├── services/            # Servicios de backend (refactorizados)
│   │   ├── apiService.js    # Generación de preguntas y IA
│   │   ├── authService.js   # Autenticación y sesiones
│   │   ├── notificationService.js # Notificaciones
│   │   ├── profileService.js      # Gestión de perfil
│   │   ├── promptService.js       # Formateo de prompts
│   │   └── themeService.js        # Gestión de temas
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── package.json
└── vite.config.js
```

### 🏗️ Arquitectura de Código

#### **Separación de Responsabilidades**

- **`components/`**: Componentes React organizados por dominio (Auth, Pages, Dashboard, etc.)
- **`config/`**: Configuración centralizada (API endpoints, constantes)
- **`hooks/`**: Lógica reutilizable extraída en custom hooks
- **`lib/`**: Utilidades de bajo nivel (httpClient, helpers)
- **`services/`**: Capa de servicios que abstraen las llamadas a la API

#### **Patrón de Diseño**

- ✅ **DRY (Don't Repeat Yourself)**: httpClient elimina duplicación de lógica HTTP
- ✅ **Single Responsibility**: Cada hook maneja una responsabilidad específica
- ✅ **Separation of Concerns**: Componentes UI separados de lógica de negocio
- ✅ **Centralized Configuration**: Todos los endpoints en un solo lugar

## 🎨 Tecnologías utilizadas

### **Frontend Core**
- **React 18** - Librería de UI con Hooks
- **React Router** - Navegación SPA
- **Vite** - Build tool y dev server ultrarrápido
- **CSS Modules** - Estilos con scope local

### **Arquitectura y Patrones**
- **Custom Hooks** - Lógica reutilizable y separación de responsabilidades
- **HTTP Client centralizado** - Abstracción de peticiones HTTP
- **Configuración centralizada** - Gestión de endpoints y variables de entorno
- **Service Layer** - Capa de servicios para abstraer la API

### **Integraciones**
- **Groq API** - Inteligencia artificial para generación de contenido
- **Node.js Backend** - API REST propia

## 🔧 Mejoras de Mantenibilidad (Nov 2025)

### **Problema Identificado**
El código original tenía duplicación significativa de lógica HTTP, variables de entorno dispersas, y componentes monolíticos difíciles de mantener.

### **Solución Implementada**

#### 1. **HTTP Client Centralizado** (`src/lib/httpClient.js`)
```javascript
// Antes: Código duplicado en cada servicio
const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify(data)
});

// Después: Un solo punto de gestión HTTP
import { httpClient } from '../lib/httpClient';
const data = await httpClient.post(url, payload);
```

**Beneficios:**
- ✅ Eliminación de ~200 líneas de código duplicado
- ✅ Manejo consistente de errores
- ✅ Headers y credentials centralizados
- ✅ Fácil de extender (interceptors, retry logic, etc.)

#### 2. **Configuración Centralizada** (`src/config/api.js`)
```javascript
// Antes: Variables dispersas en múltiples archivos
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const GROQ_API = import.meta.env.VITE_GROQ_API;
// ...en cada servicio

// Después: Configuración única
export const API_CONFIG = {
  auth: { login: '...', register: '...' },
  questions: { generate: '...', groq: '...' },
  // ...
};
```

**Beneficios:**
- ✅ Single source of truth para endpoints
- ✅ Fácil cambio entre entornos (dev/staging/prod)
- ✅ Validación centralizada de configuración
- ✅ Mejor organización por dominio

#### 3. **Custom Hooks para Lógica Reutilizable**
```javascript
// Antes: SettingsContent.jsx (500 líneas)
// - Toda la lógica mezclada con UI
// - Difícil de testear
// - Imposible de reutilizar

// Después: 4 custom hooks (275 líneas totales)
import { useProfileForm } from '../../hooks/useProfileForm';
import { usePasswordChange } from '../../hooks/usePasswordChange';
import { useAccountDeletion } from '../../hooks/useAccountDeletion';
import { useMessage } from '../../hooks/useMessage';
```

**Beneficios:**
- ✅ **Separación de responsabilidades** (UI vs Lógica)
- ✅ **Testeable**: Hooks pueden testearse independientemente
- ✅ **Reutilizable**: Hooks disponibles para otros componentes
- ✅ **Legible**: SettingsContent.jsx ahora es 45% más pequeño

### **Resultados Medibles**

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Líneas en SettingsContent | 500 | 275 | -45% |
| Código duplicado HTTP | ~200 líneas | 0 | -100% |
| Servicios refactorizados | 0/6 | 6/6 | 100% |
| Custom hooks creados | 1 | 5 | +400% |
| Build exitoso | ✅ | ✅ | Estable |

## 🔌 API Endpoints

> Todos los endpoints están centralizados en `src/config/api.js`

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
- **🆕 Arquitectura refactorizada para mantenibilidad:**
  - HTTP Client centralizado (DRY principle)
  - Configuración de API centralizada
  - Custom Hooks para separación de responsabilidades
  - Reducción de 45% en líneas de código de componentes
  - Servicios con documentación JSDoc

### 🔨 En Desarrollo Activo
- Suite de testing automatizado (Jest, React Testing Library)
- Implementación de CI/CD pipelines
- Optimización de rendimiento (code splitting, lazy loading)
- Mejoras de accesibilidad (a11y)
- Refactorización continua aplicando SOLID principles

### 📅 Roadmap

**Fase 1 - Calidad y Testing** *(Q1 2026)*
- [ ] Migración a TypeScript (con comprensión profunda de tipos)
- [ ] Suite completa de tests unitarios y de integración
- [ ] Configuración de CI/CD con GitHub Actions
- [ ] Code coverage > 80%

**Fase 2 - Optimización** *(Q2 2026)*
- [ ] Implementación de React Query para cache y estado del servidor
- [ ] Lazy loading y code splitting estratégico
- [ ] Optimización de bundle size
- [ ] Lighthouse score > 90

**Fase 3 - Escalabilidad** *(Q3 2026)*
- [ ] Dockerización y orquestación (Docker Compose)
- [ ] Progressive Web App (PWA)
- [ ] Internacionalización (i18n)
- [ ] Sistema de notificaciones en tiempo real (WebSockets)

**Fase 4 - Arquitectura Avanzada** *(Q4 2026)*
- [ ] Implementación de arquitectura hexagonal
- [ ] Micro-frontends (exploratorio)
- [ ] Monorepo con pnpm workspaces
- [ ] Server-Side Rendering (SSR) con Next.js (evaluación)

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