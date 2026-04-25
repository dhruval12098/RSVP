'use client'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-muted to-background">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent font-sans font-semibold text-sm tracking-wide">
            EXCLUSIVE INVITATION
          </span>
        </div>

        <h1 className="mb-6 text-foreground">
          An Evening of Elegance
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          You are cordially invited to join us for an exclusive event. Celebrate with us in an atmosphere of refined sophistication and timeless beauty.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <div className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground font-sans mb-1">Date</p>
            <p className="text-2xl font-serif text-foreground">May 18, 2024</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-muted"></div>
          <div className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground font-sans mb-1">Time</p>
            <p className="text-2xl font-serif text-foreground">7:00 PM</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-muted"></div>
          <div className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground font-sans mb-1">Location</p>
            <p className="text-2xl font-serif text-foreground">Grand Venue</p>
          </div>
        </div>

        <div className="mt-16 pt-12 border-t border-muted">
          <p className="text-sm text-muted-foreground font-sans tracking-wide">
            KINDLY RESPOND BY MAY 1, 2024
          </p>
        </div>
      </div>
    </section>
  )
}
