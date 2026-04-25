'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { RSVPModal } from './rsvp-modal'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export function BannerSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bannerImage, setBannerImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const ctaRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    // Try to fetch the banner image from storage
    const fetchBannerImage = async () => {
      try {
        const { data } = await supabase.storage
          .from('rsvp')
          .getPublicUrl('banner.jpg')
        
        if (data?.publicUrl) {
          setBannerImage(data.publicUrl)
        } else {
          // Use default banner from public folder
          setBannerImage('/default-banner.jpg')
        }
      } catch (error) {
        console.log('No banner image found, using default')
        setBannerImage('/default-banner.jpg')
      } finally {
        setLoading(false)
      }
    }

    fetchBannerImage()
  }, [])

  useEffect(() => {
    if (loading) return
    if (typeof window === 'undefined') return
    if (window.scrollY > 24) return

    const hasGuidedScrollPlayed = sessionStorage.getItem('rsvp-guided-scroll')
    if (hasGuidedScrollPlayed) return

    const timeoutId = window.setTimeout(() => {
      ctaRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      sessionStorage.setItem('rsvp-guided-scroll', 'true')
    }, 900)

    return () => window.clearTimeout(timeoutId)
  }, [loading])

  return (
    <>
      <section className="w-full bg-background">
        <div className="px-0 py-0 md:px-6 md:py-8 xl:px-10 xl:py-10">
          <div className="relative w-full h-screen min-h-[500px] overflow-hidden bg-white md:min-h-[620px] md:rounded-lg xl:mx-auto xl:h-[calc(100vh-5rem)] xl:max-w-6xl xl:border xl:border-neutral-200">
            {(!bannerImage || !imageLoaded) && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white px-6 text-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900" />
                <p className="mt-5 text-lg font-semibold text-black">Preparing your baby shower invitation</p>
                <p className="mt-2 max-w-md text-sm text-neutral-600">
                  Just a moment while we load the invitation beautifully.
                </p>
              </div>
            )}
            <Image
              src={bannerImage || '/default-banner.jpg'}
              alt="Baby shower invitation banner"
              fill
              className="object-cover xl:object-contain"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) calc(100vw - 3rem), 1152px"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>

        <button
          ref={ctaRef}
          onClick={() => setIsModalOpen(true)}
          className="block w-full bg-white px-6 py-5 text-center text-base font-semibold text-black transition-colors hover:bg-neutral-100"
        >
          Click Here to RSVP
        </button>
      </section>

      {/* RSVP Modal */}
      <RSVPModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
