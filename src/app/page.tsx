'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import { Sparkles, ArrowRight, Gamepad2, Film, Smartphone, ShoppingBag, Search, TrendingUp, ChevronRight, Zap } from 'lucide-react'
import Link from 'next/link'

// ─── Particle animation hook ────────────────────────────────
function useParticles(count = 30) {
  const [particles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 6,
      duration: Math.random() * 4 + 6,
    }))
  )
  return particles
}

// ─── Animated Hand Component ─────────────────────────────────
function TrofeoHand() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer rings */}
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="absolute rounded-full border border-amber-500/10"
          style={{
            width: `${220 + i * 80}px`,
            height: `${220 + i * 80}px`,
            animation: `orbit ${12 + i * 4}s linear infinite ${i % 2 ? 'reverse' : ''}`,
          }}
        />
      ))}

      {/* Core glow */}
      <div className="absolute w-48 h-48 rounded-full bg-amber-500/5 blur-3xl" />
      <div className="absolute w-32 h-32 rounded-full bg-amber-400/10 blur-2xl" />

      {/* Hand */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 text-8xl select-none"
        style={{ filter: 'drop-shadow(0 0 30px rgba(245,158,11,0.7)) drop-shadow(0 0 60px rgba(245,158,11,0.3))' }}
      >
        ✋
      </motion.div>

      {/* Orb */}
      <motion.div
        animate={{ y: [-8, -20, -8], scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute z-20 w-12 h-12 rounded-full"
        style={{
          top: '15%',
          left: '55%',
          background: 'radial-gradient(circle, #fff 0%, #fcd34d 30%, rgba(245,158,11,0.5) 70%, transparent 100%)',
          boxShadow: '0 0 30px rgba(245,158,11,0.9), 0 0 60px rgba(245,158,11,0.4)',
        }}
      />

      {/* Light rays */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
          className="absolute w-px bg-gradient-to-t from-transparent to-amber-400/50"
          style={{
            height: '60px',
            transformOrigin: '50% 100%',
            transform: `rotate(${deg}deg) translateY(-80px)`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Module Card ─────────────────────────────────────────────
const MODULES = [
  {
    id: 'games',
    icon: Gamepad2,
    emoji: '🎮',
    title: 'TROFEO GAMES',
    desc: 'Juegos completos: personajes, mundos, niveles y mecánicas desde una idea.',
    color: '#7c3aed',
    tags: ['RPG', 'Aventura', 'Móvil', 'PC'],
    href: '/workspace?mode=GAMES',
  },
  {
    id: 'studio',
    icon: Film,
    emoji: '🎬',
    title: 'TROFEO STUDIO',
    desc: 'Miniseries completas: guion, personajes, episodios, voces y animación.',
    color: '#db2777',
    tags: ['YouTube', 'TikTok', 'Netflix'],
    href: '/workspace?mode=STUDIO',
  },
  {
    id: 'social',
    icon: Smartphone,
    emoji: '📱',
    title: 'TROFEO SOCIAL',
    desc: 'Una idea → múltiples contenidos para cada plataforma y audiencia.',
    color: '#0ea5e9',
    tags: ['Reels', 'Shorts', 'Stories'],
    href: '/workspace?mode=SOCIAL',
  },
  {
    id: 'ecommerce',
    icon: ShoppingBag,
    emoji: '🛒',
    title: 'E-COMMERCE',
    desc: 'Lanza tu tienda: productos, logo, catálogo, publicidad y ventas.',
    color: '#16a34a',
    tags: ['Tienda', 'Logo', 'Campañas'],
    href: '/workspace?mode=ECOMMERCE',
  },
  {
    id: 'search',
    icon: Search,
    emoji: '🔎',
    title: 'TROFEO SEARCH',
    desc: 'Investiga, compara, explica y organiza la información profundamente.',
    color: '#ea580c',
    tags: ['Análisis', 'Comparación'],
    href: '/workspace?mode=SEARCH',
  },
  {
    id: 'business',
    icon: TrendingUp,
    emoji: '💰',
    title: 'TROFEO BUSINESS',
    desc: 'Idea → Creación → Publicación → Audiencia → Producto → Negocio.',
    color: '#d97706',
    tags: ['Estrategia', 'Monetización'],
    href: '/workspace?mode=BUSINESS',
    featured: true,
  },
]

const PIPELINE = [
  { icon: '💡', label: 'Idea' },
  { icon: '🤖', label: 'TROFEO' },
  { icon: '✨', label: 'Creación' },
  { icon: '🚀', label: 'Publicación' },
  { icon: '👥', label: 'Audiencia' },
  { icon: '🏆', label: 'Negocio' },
]

export default function HomePage() {
  const router = useRouter()
  const particles = useParticles(25)
  const [prompt, setPrompt] = useState('')
  const heroRef = useRef(null)
  const modulesRef = useRef(null)
  const modulesInView = useInView(modulesRef, { once: true, margin: '-100px' })

  const handleCreate = () => {
    if (!prompt.trim()) {
      router.push('/workspace')
      return
    }
    router.push(`/workspace?prompt=${encodeURIComponent(prompt)}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCreate()
    }
  }

  return (
    <div className="min-h-screen bg-[#020205] text-white overflow-x-hidden">
      
      {/* ─── NAVBAR ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-full animate-pulse-glow"
            style={{ background: 'radial-gradient(circle, #fcd34d, #f59e0b, transparent)' }}
          />
          <span className="text-xl font-black tracking-widest" style={{ fontFamily: 'Outfit, sans-serif' }}>
            TR<span className="text-amber-400" style={{ textShadow: '0 0 10px rgba(245,158,11,0.7)' }}>◯</span>FEO
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 text-sm">
          {['Games', 'Studio', 'Social', 'Business'].map(item => (
            <Link
              key={item}
              href={`/workspace?mode=${item.toUpperCase()}`}
              className="px-3 py-1.5 rounded-lg text-white/50 hover:text-amber-400 hover:bg-amber-400/8 transition-all"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors px-3 py-1.5">
            Entrar
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold px-4 py-2 rounded-lg bg-amber-500 text-black hover:bg-amber-400 transition-all"
          >
            Crear cuenta
          </Link>
        </div>
      </nav>

      {/* ─── HERO ───────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        
        {/* Grid background */}
        <div className="absolute inset-0 hero-grid opacity-100" />
        
        {/* Radial gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(245,158,11,0.04) 0%, transparent 70%)'
          }}
        />

        {/* Particles */}
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-amber-400"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{ y: [0, -80, 0], opacity: [0, 0.6, 0] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col lg:flex-row items-center gap-16 py-20">
          
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex-1 max-w-2xl"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/8 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              IA Creadora · Versión 1.0
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-black leading-none mb-6 tracking-tight">
              <span className="block text-white">Tu mundo,</span>
              <span className="block text-gold-gradient">sin límites.</span>
            </h1>

            <p className="text-lg text-white/50 leading-relaxed mb-10 font-light max-w-xl">
              Una inteligencia artificial creadora para convertir tus ideas en{' '}
              <span className="text-amber-400 font-medium">juegos, historias, contenido, productos</span> y proyectos completos.
            </p>

            {/* ─── Main Prompt Box ─────────────────────────── */}
            <div className="relative mb-8">
              {/* Glow border */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 blur-sm" />
              
              <div className="relative bg-[#0a0a0f] rounded-2xl border border-white/8 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✋</span>
                    <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">TROFEO</span>
                  </div>
                  <div className="ml-auto text-xs text-white/30">Presiona Enter para crear</div>
                </div>
                
                <p className="text-xl font-semibold mb-4">¿Qué quieres crear hoy?</p>
                
                <div className="flex gap-3">
                  <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tengo una idea…"
                    rows={2}
                    className="flex-1 bg-white/3 border border-white/6 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 resize-none focus:outline-none focus:border-amber-500/40 focus:bg-amber-500/3 transition-all"
                    id="heroPromptInput"
                  />
                  <button
                    onClick={handleCreate}
                    id="heroCreateBtn"
                    className="w-12 h-12 self-end rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-black font-bold text-lg flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                    style={{ boxShadow: '0 0 20px rgba(245,158,11,0.4)' }}
                  >
                    ✦
                  </button>
                </div>
              </div>
            </div>

            {/* Quick action chips */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: '🎮 Crear juego', mode: 'GAMES' },
                { label: '🎬 Crear historia', mode: 'STUDIO' },
                { label: '📱 Contenido social', mode: 'SOCIAL' },
                { label: '🛒 Mi tienda', mode: 'ECOMMERCE' },
                { label: '💡 Tengo una idea', mode: 'GENERAL' },
              ].map(({ label, mode }) => (
                <Link
                  key={mode}
                  href={`/workspace?mode=${mode}`}
                  className="px-3 py-2 text-xs font-medium rounded-lg border border-white/8 bg-white/3 text-white/50 hover:border-amber-500/30 hover:text-amber-400 hover:bg-amber-500/5 transition-all"
                  id={`quickChip${mode}`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Right: Hand Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="flex-shrink-0 w-80 h-80 flex items-center justify-center"
          >
            <TrofeoHand />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 text-xs tracking-widest uppercase"
        >
          ↓ Explorar
        </motion.div>
      </section>

      {/* ─── PIPELINE ───────────────────────────────────────── */}
      <section className="py-20 border-y border-white/5 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-widest text-amber-400/60 mb-12 font-semibold">El camino de TROFEO</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {PIPELINE.map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border border-white/8 bg-white/3"
                    style={i === PIPELINE.length - 1 ? {
                      borderColor: 'rgba(245,158,11,0.4)',
                      boxShadow: '0 0 20px rgba(245,158,11,0.2)',
                      background: 'rgba(245,158,11,0.06)'
                    } : {}}
                  >
                    {step.icon}
                  </div>
                  <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">{step.label}</span>
                </motion.div>
                {i < PIPELINE.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-amber-500/30 mb-5 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MODULES ────────────────────────────────────────── */}
      <section ref={modulesRef} className="py-28 max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/8 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4">
            Ecosistema
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Todo lo que TROFEO puede crear
          </h2>
          <p className="text-white/40 text-lg font-light">Una idea de 10 segundos → un proyecto completo.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 24 }}
              animate={modulesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={mod.href}
                id={`moduleCard${mod.id}`}
                className={`group relative block p-7 rounded-2xl border transition-all duration-300 hover:-translate-y-2 ${
                  mod.featured
                    ? 'bg-gradient-to-br from-amber-500/6 to-transparent border-amber-500/25'
                    : 'bg-[#0a0a0f] border-white/6 hover:border-white/12'
                }`}
              >
                {/* Glow on hover */}
                <div
                  className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur-2xl"
                  style={{ background: mod.color }}
                />

                <div className="relative z-10">
                  <span className="text-4xl mb-5 block">{mod.emoji}</span>
                  <h3 className="text-base font-bold mb-3 tracking-wide">{mod.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-5">{mod.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {mod.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-full text-[10px] bg-white/4 border border-white/6 text-white/30 font-medium uppercase tracking-wide">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:gap-2 transition-all">
                    Crear <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────── */}
      <section className="py-28 text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full bg-amber-500/5 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="text-6xl mb-6 animate-float">✋</div>
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            TROFEO no responde.<br/>
            <span className="text-gold-gradient">TROFEO crea.</span>
          </h2>
          <p className="text-white/40 text-lg mb-10 font-light">
            Empieza gratis. Sin límites. Con una sola idea.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              id="ctaRegisterBtn"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-500 text-black font-bold text-base hover:bg-amber-400 transition-all hover:scale-105"
              style={{ boxShadow: '0 0 30px rgba(245,158,11,0.3)' }}
            >
              <Zap className="w-4 h-4" />
              Empezar a crear — Gratis
            </Link>
            <Link
              href="/workspace"
              id="ctaExploreBtn"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all font-medium text-base"
            >
              <Sparkles className="w-4 h-4" />
              Explorar TROFEO
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10 px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-lg font-black tracking-widest">
            TR<span className="text-amber-400">◯</span>FEO
          </span>
          <span className="text-white/20 text-sm">·</span>
          <span className="text-white/30 text-sm">IA Creadora · Tu mundo, sin límites.</span>
        </div>
        <p className="text-white/20 text-xs">© 2026 TROFEO. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
