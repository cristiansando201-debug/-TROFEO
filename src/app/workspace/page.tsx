'use client'

import { useState, useRef, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  Home, MessageSquare, Gamepad2, Film, Smartphone, ShoppingBag,
  Search, TrendingUp, FolderOpen, BookOpen, Brain, Settings,
  Plus, ChevronLeft, ChevronRight, MoreHorizontal, Trash2,
  Copy, RotateCcw, Send, Sparkles, Zap, LogOut, User, Menu, X
} from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ───────────────────────────────────────────────────
type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

type ChatMode = 'GENERAL' | 'GAMES' | 'STUDIO' | 'SOCIAL' | 'ECOMMERCE' | 'SEARCH' | 'BUSINESS'

// ─── Constants ───────────────────────────────────────────────
const MODE_CONFIG: Record<ChatMode, {
  label: string; icon: string; color: string;
  placeholder: string; thinkingMsg: string; creatingMsg: string;
}> = {
  GENERAL:   { label: 'TROFEO',    icon: '✋', color: '#f59e0b', placeholder: 'Tengo una idea…', thinkingMsg: 'TROFEO está pensando…', creatingMsg: 'Construyendo tu proyecto…' },
  GAMES:     { label: 'GAMES',     icon: '🎮', color: '#7c3aed', placeholder: 'Describe tu juego…', thinkingMsg: 'Diseñando el juego…', creatingMsg: 'Construyendo tu mundo…' },
  STUDIO:    { label: 'STUDIO',    icon: '🎬', color: '#db2777', placeholder: 'Cuéntame tu historia…', thinkingMsg: 'Escribiendo el guion…', creatingMsg: 'Produciendo la serie…' },
  SOCIAL:    { label: 'SOCIAL',    icon: '📱', color: '#0ea5e9', placeholder: 'Tu idea de contenido…', thinkingMsg: 'Creando el contenido…', creatingMsg: 'Preparando tus posts…' },
  ECOMMERCE: { label: 'E-COMMERCE',icon: '🛒', color: '#16a34a', placeholder: '¿Qué quieres vender?', thinkingMsg: 'Diseñando tu tienda…', creatingMsg: 'Preparando tu negocio…' },
  SEARCH:    { label: 'SEARCH',    icon: '🔎', color: '#ea580c', placeholder: 'Investiga, compara, explica…', thinkingMsg: 'Investigando…', creatingMsg: 'Organizando la información…' },
  BUSINESS:  { label: 'BUSINESS',  icon: '💰', color: '#d97706', placeholder: '¿Cuál es tu idea de negocio?', thinkingMsg: 'Analizando la oportunidad…', creatingMsg: 'Construyendo tu negocio…' },
}

const SIDEBAR_NAV = [
  { icon: Home,         label: 'Inicio',       href: '/',                 mode: null },
  { icon: MessageSquare,label: 'Chat',          href: '/workspace',        mode: 'GENERAL' },
  { icon: Gamepad2,     label: 'Juegos',        href: '/workspace?mode=GAMES',    mode: 'GAMES' },
  { icon: Film,         label: 'Miniseries',    href: '/workspace?mode=STUDIO',   mode: 'STUDIO' },
  { icon: Smartphone,   label: 'Social',        href: '/workspace?mode=SOCIAL',   mode: 'SOCIAL' },
  { icon: ShoppingBag,  label: 'E-Commerce',    href: '/workspace?mode=ECOMMERCE',mode: 'ECOMMERCE' },
  { icon: Search,       label: 'Buscar',        href: '/workspace?mode=SEARCH',   mode: 'SEARCH' },
  { icon: TrendingUp,   label: 'Business',      href: '/workspace?mode=BUSINESS', mode: 'BUSINESS' },
  { icon: FolderOpen,   label: 'Proyectos',     href: '/projects',         mode: null },
  { icon: Brain,        label: 'Memoria',       href: '/memory',           mode: null },
  { icon: Settings,     label: 'Configuración', href: '/settings',         mode: null },
]

// ─── Components ──────────────────────────────────────────────

function TypingIndicator({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 text-white/40 text-sm">
      <span className="text-base">✋</span>
      <span>{msg}</span>
      <div className="typing-dots flex gap-1.5 ml-1">
        <span /><span /><span />
      </div>
    </div>
  )
}

function ChatMessage({ msg, onCopy, onRegenerate }: {
  msg: Message
  onCopy?: () => void
  onRegenerate?: () => void
}) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group relative px-5 py-4 ${isUser ? 'flex justify-end' : ''}`}
    >
      {isUser ? (
        <div className="max-w-2xl bg-white/6 border border-white/8 rounded-2xl rounded-br-sm px-4 py-3 text-sm text-white/90 leading-relaxed">
          {msg.content}
        </div>
      ) : (
        <div className="max-w-none">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-lg">✋</span>
            <span className="text-xs font-bold text-amber-400 tracking-widest uppercase">TROFEO</span>
            {msg.streaming && (
              <span className="text-xs text-white/30 animate-pulse">Generando…</span>
            )}
          </div>
          <div className="trofeo-prose text-sm pl-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.content}
            </ReactMarkdown>
          </div>

          {/* Actions */}
          {!msg.streaming && (
            <div className="pl-8 mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-white/30 hover:text-white/70 hover:bg-white/5 transition-all"
              >
                <Copy className="w-3 h-3" /> Copiar
              </button>
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-white/30 hover:text-white/70 hover:bg-white/5 transition-all"
                >
                  <RotateCcw className="w-3 h-3" /> Regenerar
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

function ModeSelector({ current, onChange }: { current: ChatMode; onChange: (m: ChatMode) => void }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/3 border border-white/6 rounded-xl overflow-x-auto scrollbar-hide">
      {(Object.keys(MODE_CONFIG) as ChatMode[]).map(mode => {
        const cfg = MODE_CONFIG[mode]
        const isActive = mode === current
        return (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-white/30 hover:text-white/60 hover:bg-white/5'
            }`}
          >
            <span>{cfg.icon}</span>
            <span>{cfg.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function Sidebar({
  isOpen,
  onClose,
  currentMode,
  conversations,
  onNewChat,
}: {
  isOpen: boolean
  onClose: () => void
  currentMode: ChatMode
  conversations: any[]
  onNewChat: () => void
}) {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed left-0 top-0 bottom-0 z-40 w-64 bg-[#0a0a0f] border-r border-white/5 flex flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 opacity-90" />
            <span className="text-base font-black tracking-widest">
              TR<span className="text-amber-400">◯</span>FEO
            </span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-white/30 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat button */}
        <div className="px-3 py-3">
          <button
            onClick={onNewChat}
            id="newChatBtn"
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-amber-500/8 border border-amber-500/20 text-amber-400 text-sm font-semibold hover:bg-amber-500/12 transition-all"
          >
            <Plus className="w-4 h-4" />
            Nueva conversación
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-2 overflow-y-auto">
          <div className="mb-4">
            {SIDEBAR_NAV.map(item => {
              const isActive = item.mode === currentMode
              const Icon = item.icon
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition-all ${
                    isActive
                      ? 'sidebar-item-active'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/4'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Recent conversations */}
          {conversations.length > 0 && (
            <div>
              <p className="px-3 text-[10px] text-white/20 uppercase tracking-wider font-bold mb-2">Recientes</p>
              {conversations.slice(0, 8).map(conv => (
                <button
                  key={conv.id}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/35 hover:text-white/60 hover:bg-white/4 transition-all truncate"
                >
                  {conv.title}
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* User */}
        {session?.user && (
          <div className="p-3 border-t border-white/5">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/4 transition-all cursor-pointer">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400/30 to-violet-500/30 flex items-center justify-center text-xs font-bold text-amber-400">
                {session.user.name?.[0]?.toUpperCase() ?? 'T'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white/70 truncate">{session.user.name ?? session.user.email}</p>
                <p className="text-[10px] text-white/25 uppercase tracking-wider">Plan {session.user.plan ?? 'FREE'}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-white/20 hover:text-white/50 transition-colors"
                title="Salir"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

// ─── Main Workspace ───────────────────────────────────────────
function WorkspaceContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()

  const initMode = (searchParams.get('mode') as ChatMode) ?? 'GENERAL'
  const initPrompt = searchParams.get('prompt') ?? ''
  const initConvId = searchParams.get('conversationId') ?? ''

  const [mode, setMode] = useState<ChatMode>(initMode)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState(initPrompt)
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(initConvId || null)
  const [conversations, setConversations] = useState<any[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDemo] = useState(process.env.NEXT_PUBLIC_DEMO_MODE === 'true')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const cfg = MODE_CONFIG[mode]

  // Redirect to login if not authenticated and not demo
  useEffect(() => {
    if (status === 'unauthenticated' && !isDemo) {
      router.push('/login?next=/workspace')
    }
  }, [status, isDemo, router])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load conversations
  useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/conversations')
        .then(r => r.json())
        .then(data => setConversations(data.conversations ?? []))
        .catch(() => {})
    }
  }, [session])

  // Send initial prompt from URL
  useEffect(() => {
    if (initPrompt && messages.length === 0) {
      setTimeout(() => handleSend(initPrompt), 500)
    }
  }, [])

  const handleSend = useCallback(async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || loading) return

    setInput('')
    setLoading(true)

    // Add user message
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content }
    setMessages(prev => [...prev, userMsg])

    // Add placeholder assistant message
    const assistantId = (Date.now() + 1).toString()
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '', streaming: true }
    setMessages(prev => [...prev, assistantMsg])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          conversationId,
          mode,
          stream: true,
        })
      })

      if (!response.ok) throw new Error('Chat error')

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break

          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'meta') {
              if (parsed.conversationId) setConversationId(parsed.conversationId)
            } else if (parsed.type === 'chunk' && parsed.content) {
              fullContent += parsed.content
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantId ? { ...m, content: fullContent } : m
                )
              )
            } else if (parsed.type === 'error') {
              throw new Error(parsed.message)
            }
          } catch { /* skip malformed */ }
        }
      }

      // Mark streaming done
      setMessages(prev =>
        prev.map(m => m.id === assistantId ? { ...m, streaming: false } : m)
      )

    } catch (err) {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: '**TROFEO no pudo completar la respuesta.** Inténtalo nuevamente.', streaming: false }
            : m
        )
      )
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [input, loading, conversationId, mode])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleNewChat = () => {
    setMessages([])
    setConversationId(null)
    setInput('')
    inputRef.current?.focus()
  }

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#020205]">
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl animate-float">✋</div>
          <div className="typing-dots flex gap-1.5">
            <span /><span /><span />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#020205] overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentMode={mode}
        conversations={conversations}
        onNewChat={handleNewChat}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#020205]/80 backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all"
              id="sidebarToggle"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
              style={{ borderColor: `${cfg.color}30`, background: `${cfg.color}08` }}
            >
              <span>{cfg.icon}</span>
              <span className="text-xs font-bold tracking-wider" style={{ color: cfg.color }}>
                {cfg.label}
              </span>
            </div>
          </div>

          {isDemo && (
            <div className="demo-banner text-[10px]">
              <Sparkles className="w-3 h-3" />
              MODO DEMO — Respuestas simuladas
            </div>
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            /* Empty state */
            <div className="h-full flex flex-col items-center justify-center px-6 py-16">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl mb-6"
              >
                {cfg.icon}
              </motion.div>
              <h2 className="text-2xl font-bold mb-3 text-center">
                {mode === 'GENERAL' ? '¿Qué quieres crear hoy?' : `TROFEO ${cfg.label}`}
              </h2>
              <p className="text-white/35 text-center text-sm max-w-md leading-relaxed mb-8">
                {mode === 'GENERAL'
                  ? 'Dime tu idea y la convierte en un proyecto completo. Juego, historia, contenido, negocio — lo que imagines.'
                  : `Especialista en ${cfg.label.toLowerCase()}. Cuéntame tu idea y empezamos a crear.`
                }
              </p>

              {/* Suggestion chips */}
              <div className="flex flex-wrap gap-2 justify-center max-w-xl">
                {mode === 'GAMES' && [
                  'Juego de aventuras para niños con un perro y un gato',
                  'RPG de fantasía oscura para adultos',
                  'Puzzle educativo de matemáticas para 8 años',
                ].map(s => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); handleSend(s) }}
                    className="px-3 py-2 text-xs rounded-xl border border-white/8 bg-white/3 text-white/40 hover:text-white/70 hover:border-white/15 transition-all"
                  >
                    {s}
                  </button>
                ))}
                {mode === 'STUDIO' && [
                  'Miniserie de 10 episodios: un niño, un perro y un gato',
                  'Serie de animación de ciencia ficción para jóvenes',
                  'Comedia familiar sobre un inventor loco',
                ].map(s => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); handleSend(s) }}
                    className="px-3 py-2 text-xs rounded-xl border border-white/8 bg-white/3 text-white/40 hover:text-white/70 hover:border-white/15 transition-all"
                  >
                    {s}
                  </button>
                ))}
                {mode === 'GENERAL' && [
                  'Créame un juego de aventuras para niños',
                  'Quiero crear una miniserie de animación',
                  'Tengo una idea para un negocio de ropa',
                  'Necesito contenido viral para TikTok',
                ].map(s => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); handleSend(s) }}
                    className="px-3 py-2 text-xs rounded-xl border border-white/8 bg-white/3 text-white/40 hover:text-white/70 hover:border-white/15 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-6 space-y-1 max-w-4xl mx-auto w-full">
              {messages.map((msg, i) => (
                <ChatMessage
                  key={msg.id}
                  msg={msg}
                  onCopy={() => handleCopy(msg.content)}
                  onRegenerate={
                    msg.role === 'assistant' && i === messages.length - 1
                      ? () => {
                          const lastUser = [...messages].reverse().find(m => m.role === 'user')
                          if (lastUser) {
                            setMessages(prev => prev.slice(0, -1))
                            handleSend(lastUser.content)
                          }
                        }
                      : undefined
                  }
                />
              ))}
              {loading && !messages[messages.length - 1]?.streaming && (
                <TypingIndicator msg={cfg.thinkingMsg} />
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-white/5 bg-[#020205]/80 backdrop-blur-xl px-4 py-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            {/* Mode selector */}
            <div className="mb-3">
              <ModeSelector current={mode} onChange={setMode} />
            </div>

            {/* Input */}
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={cfg.placeholder}
                  rows={1}
                  disabled={loading}
                  id="chatInput"
                  className="w-full bg-white/4 border border-white/8 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-white/25 resize-none focus:outline-none focus:border-amber-500/30 focus:bg-amber-500/3 transition-all disabled:opacity-50"
                  style={{ minHeight: '52px', maxHeight: '200px' }}
                  onInput={e => {
                    const el = e.target as HTMLTextAreaElement
                    el.style.height = 'auto'
                    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
                  }}
                />
              </div>

              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                id="sendBtn"
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: input.trim() && !loading
                    ? `linear-gradient(135deg, #fcd34d, #f59e0b)`
                    : 'rgba(255,255,255,0.06)',
                  boxShadow: input.trim() && !loading ? '0 0 20px rgba(245,158,11,0.3)' : 'none',
                }}
              >
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Send className="w-4 h-4 text-black" />
                }
              </button>
            </div>

            <p className="text-center text-[10px] text-white/15 mt-2">
              TROFEO puede crear proyectos increíbles, pero siempre verifica la información importante.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#020205]">
        <div className="text-4xl animate-float">✋</div>
      </div>
    }>
      <WorkspaceContent />
    </Suspense>
  )
}
