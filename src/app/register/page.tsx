'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Check } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'No se pudo crear la cuenta.')
        setLoading(false)
        return
      }

      // Auto login
      await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })
      router.push('/workspace')
    } catch {
      setError('Algo salió mal. Inténtalo nuevamente.')
      setLoading(false)
    }
  }

  const pwStrength = form.password.length >= 12 ? 3 : form.password.length >= 8 ? 2 : form.password.length > 0 ? 1 : 0

  return (
    <div className="min-h-screen bg-[#020205] flex items-center justify-center px-4 py-10">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/4 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#0a0a0f] border border-white/8 rounded-2xl p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-base">
                ✋
              </div>
              <span className="text-2xl font-black tracking-widest">
                TR<span className="text-amber-400">◯</span>FEO
              </span>
            </Link>
            <h1 className="text-xl font-bold mb-1">Crea tu cuenta</h1>
            <p className="text-white/40 text-sm">Empieza a crear. Es gratis.</p>
          </div>

          {/* Benefits */}
          <div className="mb-6 space-y-2">
            {[
              '✦ Acceso completo al workspace creativo',
              '✦ Conversaciones ilimitadas en modo Demo',
              '✦ Guarda proyectos y conversaciones',
            ].map(b => (
              <div key={b} className="flex items-center gap-2 text-xs text-white/35">
                <span className="text-amber-400/60">{b.slice(0,1)}</span>
                <span>{b.slice(2)}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">
                Nombre
              </label>
              <input
                type="text"
                id="registerName"
                value={form.name}
                onChange={update('name')}
                required
                minLength={2}
                className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/40 transition-all"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                id="registerEmail"
                value={form.email}
                onChange={update('email')}
                required
                className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/40 transition-all"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  id="registerPassword"
                  value={form.password}
                  onChange={update('password')}
                  required
                  minLength={8}
                  className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/40 transition-all"
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {[1,2,3].map(i => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all"
                      style={{
                        background: i <= pwStrength
                          ? pwStrength === 3 ? '#16a34a' : pwStrength === 2 ? '#f59e0b' : '#ef4444'
                          : 'rgba(255,255,255,0.06)'
                      }}
                    />
                  ))}
                  <span className="text-[10px] text-white/30 ml-1">
                    {pwStrength === 3 ? 'Fuerte' : pwStrength === 2 ? 'Buena' : 'Débil'}
                  </span>
                </div>
              )}
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !form.name || !form.email || form.password.length < 8}
              id="registerSubmitBtn"
              className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
            >
              {loading
                ? <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Creando cuenta…
                  </span>
                : 'Crear cuenta gratis'
              }
            </button>
          </form>

          <p className="text-center text-sm text-white/30 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-amber-400 hover:text-amber-300 font-semibold">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
