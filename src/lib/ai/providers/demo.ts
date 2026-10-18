/**
 * TROFEO — Demo AI Provider
 * Provides realistic mock responses for all creative modes.
 * No API key required. Clearly marked as DEMO.
 */

import type { AIProvider, AIMessage, AIResponse, StreamChunk, GenerationConfig } from './types'

const TROFEO_SYSTEM = `Eres TROFEO, una IA creadora avanzada. Tu personalidad es futurista, inteligente, creativa, ambiciosa y humana. Tu filosofía es "Tu mundo, sin límites." Siempre respondes en el idioma del usuario. Cuando alguien te da una idea, la conviertes en un proyecto estructurado, detallado y emocionante.`

const DEMO_RESPONSES: Record<string, string> = {
  games: `# 🎮 TROFEO GAMES — Concepto de Juego

## "Las Aventuras de Max y Luna"

**Género:** Aventura / Plataformas  
**Público:** Niños 6-12 años  
**Plataforma:** Móvil + PC

---

### 👥 Personajes Principales

**MAX** — El perro valiente
- Habilidad especial: Súper olfato (detecta secretos ocultos)
- Personalidad: Leal, curioso, siempre listo para la aventura

**LUNA** — La gata misteriosa  
- Habilidad especial: Teletransportación corta (salta entre sombras)
- Personalidad: Inteligente, independiente, protege a su equipo

**SAM** — El niño inventor
- Habilidad especial: Crea gadgets con objetos encontrados
- Personalidad: Creativo, optimista, nunca se rinde

---

### 🌍 El Mundo

**Ciudad de Lumina** — Una metrópolis mágica donde la tecnología y la naturaleza conviven. Dividida en 5 zonas:

1. **El Barrio Dorado** — Zona inicial, colorida y amigable
2. **El Bosque Digital** — Árboles que generan datos y misterios
3. **Las Cavernas de Cristal** — Puzzles y tesoros escondidos
4. **La Torre del Tiempo** — Nivel intermedio, mecánicas de tiempo
5. **El Núcleo de Lumina** — Boss final, salvar la ciudad

---

### 🎯 Mecánicas Principales

- **Cooperación:** Los 3 personajes tienen habilidades únicas que se combinan
- **Puzzles:** Requieren usar las habilidades juntas
- **Coleccionables:** Piezas de tecnología para mejorar gadgets
- **Misiones secundarias:** Ayudar a ciudadanos de Lumina
- **Sistema de amistad:** Interacciones entre personajes fortalecen habilidades

---

### 📋 Estructura de Niveles

**Mundo 1:** El Barrio Dorado (5 niveles + 1 jefe)
**Mundo 2:** El Bosque Digital (6 niveles + 1 jefe)  
**Mundo 3:** Las Cavernas de Cristal (7 niveles + 1 jefe)
**Mundo 4:** La Torre del Tiempo (8 niveles + 1 jefe)
**Mundo 5:** El Núcleo de Lumina (5 niveles + Jefe Final)

---

### 🚀 Próximos Pasos

¿Quieres que desarrolle:
- [ ] Los diálogos del Capítulo 1?
- [ ] El Game Design Document completo?
- [ ] El sistema de progresión?
- [ ] Los diseños de personajes?`,

  studio: `# 🎬 TROFEO STUDIO — Miniserie

## "El Niño, el Perro y el Gato"
### Una aventura de amistad sin límites

**Géneros:** Animación / Aventura / Familia  
**Episodios:** 10 episodios × 8-12 minutos  
**Plataformas:** YouTube · TikTok · Instagram · Facebook

---

### 🌟 Sinopsis General

Sam, un niño de 10 años con imaginación desbordante, vive en la ciudad de Lumina junto a MAX, su perro leal con superpoderes de olfato, y LUNA, una gata misteriosa que puede viajar entre las sombras.

Juntos descubrirán que Lumina esconde secretos increíbles. Cada episodio los llevará a una aventura diferente donde la amistad, la creatividad y el trabajo en equipo serán su mayor superpoder.

---

### 👥 Personajes

**SAM RIVERA** — El Niño Inventor
> *"Cada problema tiene una solución. Solo hay que encontrarla."*

**MAX** — El Perro Valiente
> *"¡A donde vayas, yo voy contigo!"*

**LUNA** — La Gata de las Sombras
> *"El conocimiento es el verdadero poder."*

**ARIA** — La IA de la Ciudad (personaje secundario recurrente)
> La conciencia digital de Lumina que guía y advierte a nuestros héroes.

---

### 📺 Guía de Episodios

| # | Título | Sinopsis |
|---|--------|----------|
| 1 | **"El Comienzo"** | Sam descubre que Max y Luna tienen poderes especiales |
| 2 | **"El Bosque Digital"** | Los tres se aventuran en el misterioso bosque |
| 3 | **"La Trampa de Cristal"** | Quedan atrapados en las cavernas. Luna debe enfrentar su miedo |
| 4 | **"El Inventor"** | Sam crea su primer gadget para salvar a sus amigos |
| 5 | **"Voces del Tiempo"** | Descubren mensajes del pasado de Lumina |
| 6 | **"La Tormenta Digital"** | Un virus amenaza la ciudad entera |
| 7 | **"El Secreto de Luna"** | Revelación: Luna tiene un pasado misterioso |
| 8 | **"Unidos"** | El equipo debe resolver sus diferencias para avanzar |
| 9 | **"El Núcleo"** | Llegan al corazón de Lumina. Todo se revela |
| 10 | **"Lumina Libre"** | Batalla final. El equipo salva la ciudad |

---

### 🎵 Música y Estilo

- **Apertura:** Tema principal animado, 30 segundos, energético
- **Episodios:** Banda sonora orquestal + electrónica
- **Estilo visual:** Animación 2D con efectos de luz 3D
- **Paleta:** Azul profundo, dorado, cian, blancos

---

### 📱 Versiones por Plataforma

| Plataforma | Formato | Duración |
|------------|---------|----------|
| YouTube | Horizontal 16:9 | Episodio completo |
| TikTok | Vertical 9:16 | Clip de 60s por escena |
| Instagram Reels | Vertical 9:16 | Trailer 30s |
| Facebook | Cuadrado 1:1 | Resumen 45s |`,

  social: `# 📱 TROFEO SOCIAL — Plan de Contenido

## Estrategia Multi-Plataforma

---

### 📅 Calendario de Contenido (Semana 1)

**Lunes** — YouTube
🎬 Episodio completo "El Comienzo" (12 min)
*Título SEO: "El Niño, el Perro y el Gato | Episodio 1 | Animación 2024"*

**Martes** — TikTok  
📱 Clip: La primera vez que Sam descubre los poderes de Max (60s)
*Caption: "Cuando tu perro resulta ser un superhéroe 🐕✨ #animacion #aventura"*

**Miércoles** — Instagram
📸 Presentación de personajes (carrusel 5 imágenes)
*Caption: "Conoce al equipo que va a cambiar Lumina para siempre 🌟"*

**Jueves** — Facebook
👥 Versión larga del trailer (2 min)
*Descripción: "Una historia sobre amistad, aventura y magia..."*

**Viernes** — TikTok + Instagram Reels
🎵 Reel viral: las mejores escenas del episodio 1 con música trending

**Sábado** — YouTube Community
💬 Post: "¿Quién es tu personaje favorito? Max, Luna o Sam?"

**Domingo** — Todas las plataformas
📊 Resumen semanal + preview episodio 2

---

### #️⃣ Hashtags Optimizados

**TikTok:** #animacion #aventura #niños #familia #lumina #trofeo #cartoon

**Instagram:** #animacion #contenidoinfantil #familia #arte #ilustracion

**YouTube:** Etiquetas SEO: animación española, aventuras infantiles, cartoon 2024`,

  default: `¡Hola! Soy **TROFEO**, tu IA Creadora 🏆

Estoy aquí para convertir cualquier idea en un proyecto real. Puedo ayudarte a crear:

🎮 **TROFEO GAMES** — Videojuegos completos con personajes, mundos y mecánicas
🎬 **TROFEO STUDIO** — Miniseries, películas y contenido audiovisual  
📱 **TROFEO SOCIAL** — Contenido para YouTube, TikTok, Instagram y más
🛒 **TROFEO E-COMMERCE** — Tu tienda, marca y estrategia de ventas
🔎 **TROFEO SEARCH** — Investigación profunda y análisis inteligente
💰 **TROFEO BUSINESS** — Convierte tu creatividad en un negocio real

---

**¿Por dónde empezamos?**

Puedes decirme algo tan simple como:

> *"Quiero crear un juego de aventuras para niños"*
> *"Hazme una miniserie de 10 episodios"*  
> *"Tengo una idea de negocio..."*

Y yo me encargo del resto. 🚀

*Tu mundo, sin límites.*`
}

async function* demoStream(text: string): AsyncGenerator<StreamChunk> {
  const words = text.split(' ')
  for (let i = 0; i < words.length; i++) {
    const chunk = words[i] + (i < words.length - 1 ? ' ' : '')
    yield { content: chunk, done: false }
    // Simulate realistic streaming delay
    await new Promise(r => setTimeout(r, 15 + Math.random() * 25))
  }
  yield { content: '', done: true }
}

function getDemoResponse(messages: AIMessage[], mode?: string): string {
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() ?? ''
  
  if (mode === 'GAMES' || lastMessage.includes('juego') || lastMessage.includes('game')) {
    return DEMO_RESPONSES.games
  }
  if (mode === 'STUDIO' || lastMessage.includes('serie') || lastMessage.includes('historia') || lastMessage.includes('episodio')) {
    return DEMO_RESPONSES.studio
  }
  if (mode === 'SOCIAL' || lastMessage.includes('social') || lastMessage.includes('tiktok') || lastMessage.includes('youtube')) {
    return DEMO_RESPONSES.social
  }
  return DEMO_RESPONSES.default
}

export class DemoProvider implements AIProvider {
  name = 'TROFEO Demo'
  model = 'trofeo-demo-v1'
  isDemo = true

  async chat(messages: AIMessage[], config?: GenerationConfig): Promise<AIResponse> {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 400))
    
    const content = getDemoResponse(messages, config?.mode)
    return {
      content,
      model: this.model,
      provider: this.name,
      tokens: {
        prompt: messages.reduce((a, m) => a + m.content.length / 4, 0) | 0,
        completion: content.length / 4 | 0,
        total: (messages.reduce((a, m) => a + m.content.length / 4, 0) + content.length / 4) | 0
      }
    }
  }

  async *stream(messages: AIMessage[], config?: GenerationConfig): AsyncGenerator<StreamChunk> {
    await new Promise(r => setTimeout(r, 300))
    const content = getDemoResponse(messages, config?.mode)
    yield* demoStream(content)
  }

  async isAvailable(): Promise<boolean> {
    return true
  }
}
