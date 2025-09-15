'use client'
import { useRouter } from "next/navigation"

import { useState } from 'react'
import Label from '../atoms/label'
import Input from '../atoms/input'
import Button from '../atoms/button'

export default function PublicFormPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, description })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error ?? 'Ocurrió un error al enviar')
      }

      setMessage('Thank you! Your complaint was submitted successfully.')
      setEmail('')
      setDescription('')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else if (typeof err === 'string') {
        setError(err)
      } else {
        setError('Error al enviar')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
      <div className="relative w-full max-w-md">
        <Button
          type="button"
          onClick={() => router.push("/adminPage")}
          className="absolute left-0 top-0 rounded-xl bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
        >
          To admin panel
        </Button>
  
        <section className="mt-14 rounded-2xl bg-white/5 p-8 shadow-lg ring-1 ring-white/10 backdrop-blur-lg">
          <h2 className="mb-6 text-center text-2xl font-bold text-white">
            Submit a complaint
          </h2>
  
          <form onSubmit={submit} className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email" required className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl border border-gray-600 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:ring focus:ring-blue-500/30"
                placeholder="example@email.com"
              />
            </div>
  
            <div className="grid gap-2">
              <Label htmlFor="description" required className="text-gray-200">
                Description
              </Label>
              <textarea
                id="description"
                className="min-h-32 rounded-xl border border-gray-600 bg-white/10 px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-blue-400 focus:ring focus:ring-blue-500/30"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                minLength={5}
                maxLength={2000}
                aria-describedby="description-help"
                placeholder="Enter your complaint here..."
              />
              <p id="description-help" className="text-xs text-gray-400">
                Please be specific. Up to 2000 characters.
              </p>
            </div>
  
            <Button
              className="w-full rounded-xl bg-blue-600 px-5 py-3 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
              type="submit"
              disabled={loading}
              loading={loading}
            >
              Send
            </Button>
  
            {message && (
              <p className="text-center text-sm font-medium text-green-400">
                {message}
              </p>
            )}
            {error && (
              <p className="text-center text-sm font-medium text-red-400">
                {error}
              </p>
            )}
          </form>
        </section>
      </div>
    </main>
  )
  
  
}
