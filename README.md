# 🏆 TROFEO — IA Creadora

> **"Tu mundo, sin límites."**

TROFEO es una plataforma de inteligencia artificial creadora. Convierte ideas en juegos, historias, contenido, productos y proyectos completos.

---

## 🚀 Inicio rápido

### Prerrequisitos

- Node.js 20+
- PostgreSQL 16 (o Docker)
- Redis 7 (opcional, para caché y rate limiting)

### 1. Clonar e instalar

```bash
git clone https://github.com/tu-usuario/trofeo.git
cd trofeo/trofeo-app
npm install --legacy-peer-deps
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores. **Mínimo requerido:**

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/trofeo_db"
AUTH_SECRET="tu-secret-de-32-caracteres-minimo"
```

### 3. Base de datos

```bash
npx prisma generate
npx prisma db push
```

### 4. Ejecutar

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 🐳 Docker (recomendado)

```bash
# Levantar toda la infraestructura
docker compose up

# La primera vez, ejecutar migraciones
docker compose exec app npx prisma db push
```

---

## 🤖 Configuración de IA

TROFEO soporta múltiples proveedores. Configura `AI_PROVIDER` en `.env.local`:

| Provider | Variable | Descripción |
|----------|----------|-------------|
| `demo` | — | Respuestas simuladas (sin API key) |
| `openai` | `OPENAI_API_KEY` | GPT-4o, GPT-4 |
| `anthropic` | `ANTHROPIC_API_KEY` | Claude 3.5 Sonnet |
| `google` | `GOOGLE_API_KEY` | Gemini 1.5 Pro |
| `ollama` | `OLLAMA_BASE_URL` | Modelos locales |

### Modo Demo

Sin API key, TROFEO funciona con respuestas realistas simuladas. 
Se muestra claramente el banner **"MODO DEMO"**.

---

## 🏗️ Estructura del proyecto

```
trofeo-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Login, Register
│   │   ├── api/                # API Routes
│   │   │   ├── auth/           # NextAuth handlers + registro
│   │   │   ├── chat/           # Chat con streaming SSE
│   │   │   ├── conversations/  # CRUD conversaciones
│   │   │   └── projects/       # CRUD proyectos
│   │   ├── workspace/          # Workspace principal (chat)
│   │   ├── projects/           # Gestión de proyectos
│   │   └── page.tsx            # Homepage
│   ├── components/
│   │   └── providers.tsx       # React Query + Session
│   ├── lib/
│   │   ├── ai/                 # AI Provider abstraction
│   │   │   ├── index.ts        # Factory
│   │   │   ├── types.ts        # Interfaces
│   │   │   └── providers/      # OpenAI, Anthropic, Google, Ollama, Demo
│   │   ├── auth.ts             # NextAuth v5 config
│   │   ├── db.ts               # Prisma singleton
│   │   └── redis.ts            # Redis + rate limiting
│   └── middleware.ts           # Route protection
├── prisma/
│   └── schema.prisma           # Database schema
├── .env.example                # Variables de entorno template
├── docker-compose.yml          # PostgreSQL + Redis + App
├── Dockerfile                  # Multi-stage production build
└── ARCHITECTURE.md             # Documentación de arquitectura
```

---

## 🎮 Módulos de TROFEO

| Módulo | Descripción |
|--------|-------------|
| **TROFEO GAMES** | Diseño de videojuegos completos |
| **TROFEO STUDIO** | Creación de miniseries y contenido audiovisual |
| **TROFEO SOCIAL** | Contenido para redes sociales |
| **TROFEO E-COMMERCE** | Tiendas, productos y campañas |
| **TROFEO SEARCH** | Búsqueda inteligente y análisis |
| **TROFEO BUSINESS** | Transformar ideas en proyectos comerciales |

---

## 📡 API Reference

### POST `/api/chat`

Enviar mensaje al chat con streaming.

```json
{
  "message": "Créame un juego de aventuras",
  "conversationId": "opcional",
  "mode": "GAMES",
  "stream": true
}
```

Respuesta: `text/event-stream` SSE

```
data: {"type":"meta","conversationId":"xxx","isDemo":true}
data: {"type":"chunk","content":"## 🎮 ","done":false}
data: [DONE]
```

### GET `/api/conversations`

Lista conversaciones del usuario autenticado.

### POST `/api/conversations`

Crea nueva conversación.

### GET `/api/projects`

Lista proyectos del usuario.

### POST `/api/projects`

Crea nuevo proyecto.

---

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt (12 rounds)
- JWT sessions con NextAuth v5
- Rate limiting por usuario (Redis)
- Validación con Zod en todos los endpoints
- Variables de entorno separadas del código
- Logs sin secretos
- Headers de seguridad (X-Frame-Options, etc.)

---

## 📋 Planes

| Plan | Mensajes/día | Proyectos |
|------|-------------|-----------|
| Free | 50 | 5 |
| Creator | 500 | 50 |
| Pro | 5000 | Ilimitados |

---

## 🛠️ Comandos

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run start        # Producción
npm run lint         # ESLint
npx prisma studio    # UI de base de datos
npx prisma db push   # Sincronizar schema
npx prisma generate  # Generar client
```

---

## 🚀 Deploy

### Vercel (recomendado para frontend)

1. Push a GitHub
2. Conectar en vercel.com
3. Agregar variables de entorno
4. Deploy automático

### Railway / Render (full stack)

Ver `docker-compose.yml` para configuración completa.

---

## 📄 Licencia

MIT — © 2026 TROFEO
