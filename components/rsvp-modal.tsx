'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@supabase/supabase-js'
import { X } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const WHATSAPP_NUMBER = '14407894188'

const rsvpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  guests: z.number().min(1, 'At least 1 guest required').max(10, 'Maximum 10 guests'),
  message: z.string().optional(),
})

type RSVPFormData = z.infer<typeof rsvpSchema>

interface RSVPModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RSVPModal({ isOpen, onClose }: RSVPModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      guests: 1,
    },
  })

  const onSubmit = async (data: RSVPFormData) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('rsvps')
        .insert([
          {
            name: data.name,
            guests: data.guests,
            message: data.message || null,
          },
        ])

      if (error) throw error

      setSubmitSuccess(true)
      reset()

      const message = `New RSVP\nName: ${data.name}\nTotal Guests: ${data.guests}${data.message ? `\nMessage: ${data.message}` : ''}`
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

      toast({
        title: 'RSVP submitted',
        description: 'Opening WhatsApp with the guest details.',
      })

      window.open(whatsappUrl, '_blank')

      setTimeout(() => {
        onClose()
        setSubmitSuccess(false)
      }, 2000)
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      toast({
        title: 'Submission failed',
        description: 'Failed to submit RSVP. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between p-4 md:p-6 border-b border-muted bg-white rounded-t-lg">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              Baby Shower RSVP
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded-md transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6">
            {submitSuccess ? (
              <div className="space-y-4 py-8 text-center">
                <div className="text-5xl">✓</div>
                <p className="text-lg font-serif text-foreground">
                  Thank you for celebrating with us!
                </p>
                <p className="text-muted-foreground">
                  Your RSVP was saved and WhatsApp is opening with the guest details.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-white text-foreground"
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Guests Field */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Number of Guests *
                  </label>
                  <select
                    {...register('guests', { valueAsNumber: true })}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-white text-foreground"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                  {errors.guests && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.guests.message}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    {...register('message')}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-white text-foreground"
                    placeholder="A sweet note for the parents-to-be"
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-semibold rounded-md transition-colors mt-6"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
