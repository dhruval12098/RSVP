'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from '@/hooks/use-toast'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  guests: z.coerce.number().min(1, 'At least 1 guest required').max(50, 'Maximum 50 guests'),
  message: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

const WHATSAPP_NUMBER = '14407894188'

export function RSVPForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      guests: 1,
      message: '',
    },
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit RSVP')
      }

      await response.json()

      const whatsappMessage = `New RSVP\nName: ${data.name}\nTotal Guests: ${data.guests}${data.message ? `\nMessage: ${data.message}` : ''}`
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`

      setIsSuccess(true)
      toast({
        title: 'RSVP submitted',
        description: 'Opening WhatsApp with the guest details.',
      })

      setTimeout(() => {
        window.location.href = whatsappUrl
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast({
        title: 'Submission failed',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-serif text-foreground mb-2">Thank You!</h3>
        <p className="text-muted-foreground mb-6">Your RSVP has been received. Opening WhatsApp with the guest details...</p>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
      {error && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-semibold text-foreground">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Your full name"
          className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="guests" className="block text-sm font-semibold text-foreground">
          Number of Guests
        </label>
        <input
          id="guests"
          type="number"
          min="1"
          max="50"
          placeholder="Number of guests"
          className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          {...form.register('guests')}
        />
        {form.formState.errors.guests && (
          <p className="text-sm text-red-600">{form.formState.errors.guests.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-semibold text-foreground">
          Additional Message (Optional)
        </label>
        <textarea
          id="message"
          placeholder="Any dietary restrictions or special requests..."
          rows={4}
          className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          {...form.register('message')}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 rounded-md bg-accent text-white font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Submitting...' : 'RSVP Now'}
      </button>

      <p className="text-xs text-center text-muted-foreground">
        Your response will be confirmed via WhatsApp
      </p>
    </form>
  )
}
