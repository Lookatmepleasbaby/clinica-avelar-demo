import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import './clinic-gallery.css'

type GalleryEntry = {
  src: string
  title: string
  position: string
  href: string
  alt?: string
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const photoNumber = (index: number) => String(index + 1).padStart(2, '0')

export function ClinicGallery({ entries }: { entries: readonly GalleryEntry[] }) {
  const railRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const stopsRef = useRef<number[]>([])
  const selectedRef = useRef(0)
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    const items = Array.from(rail.querySelectorAll<HTMLElement>('.clinic-gallery-item'))
    const photos = items.map(item => item.querySelector<HTMLImageElement>('.clinic-gallery-photo'))
    let frame: number | null = null
    let viewportWidth = 0
    let maxScroll = 0
    let midpoints: number[] = []

    const paint = () => {
      frame = null
      const offset = clamp(rail.scrollLeft, 0, maxScroll)
      const stops = stopsRef.current
      const active = stops.reduce((closest, stop, index) => (
        Math.abs(stop - offset) < Math.abs(stops[closest] - offset) ? index : closest
      ), 0)

      if (selectedRef.current !== active) {
        selectedRef.current = active
        setSelected(active)
      }

      const firstPhoto = 1 / Math.max(1, items.length)
      const fraction = maxScroll > 0 ? offset / maxScroll : 1
      const fill = firstPhoto + (1 - firstPhoto) * fraction
      progressRef.current?.style.setProperty('--clinic-gallery-progress', String(fill))

      if (document.documentElement.dataset.motion !== 'full' || !viewportWidth) return
      for (const [index, photo] of photos.entries()) {
        const relativeCenter = (midpoints[index] - offset - viewportWidth / 2) / viewportWidth
        const shift = clamp(-relativeCenter * 4.5, -3.3, 3.3)
        photo?.style.setProperty('--clinic-gallery-shift', `${shift.toFixed(2)}%`)
      }
    }

    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(paint)
    }

    const measure = () => {
      viewportWidth = rail.clientWidth
      maxScroll = Math.max(0, rail.scrollWidth - viewportWidth)
      midpoints = items.map(item => item.offsetLeft + item.offsetWidth / 2)
      stopsRef.current = items.map((item, index) => {
        const alignEnd = index === items.length - 1
        const stop = alignEnd ? item.offsetLeft + item.offsetWidth - viewportWidth : item.offsetLeft
        return clamp(stop, 0, maxScroll)
      })
      schedule()
    }

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    resizeObserver?.observe(rail)
    items.forEach(item => resizeObserver?.observe(item))

    const revealObserver = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(observations => {
      for (const { target, isIntersecting } of observations) {
        if (!isIntersecting) continue
        target.setAttribute('data-photo-visible', 'true')
        revealObserver?.unobserve(target)
      }
    }, { threshold: 0.08 }) : null

    if (revealObserver) {
      rail.dataset.revealReady = 'true'
      items.forEach(item => revealObserver.observe(item))
    }

    rail.addEventListener('scroll', schedule, { passive: true })
    if (!resizeObserver) window.addEventListener('resize', measure)
    measure()

    return () => {
      rail.removeEventListener('scroll', schedule)
      if (!resizeObserver) window.removeEventListener('resize', measure)
      resizeObserver?.disconnect()
      revealObserver?.disconnect()
      delete rail.dataset.revealReady
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [entries])

  const goTo = (index: number) => {
    const rail = railRef.current
    const stop = stopsRef.current[index]
    if (!rail || stop === undefined) return
    const behavior = document.documentElement.dataset.motion === 'full' ? 'smooth' : 'auto'
    rail.scrollTo({ left: stop, behavior })
  }

  const handleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return
    const targets: Record<string, number> = {
      ArrowLeft: selectedRef.current - 1,
      ArrowRight: selectedRef.current + 1,
      Home: 0,
      End: entries.length - 1,
    }
    if (!Object.hasOwn(targets, event.key)) return
    event.preventDefault()
    goTo(clamp(targets[event.key], 0, entries.length - 1))
  }

  if (entries.length === 0) return null

  return (
    <section className="clinic-gallery section-space" id="clinica" aria-labelledby="clinic-title">
      <div className="wrap section-head" data-reveal="rise">
        <div>
          <p className="kicker">A clínica</p>
          <h2 id="clinic-title">Conheça <em>o espaço.</em></h2>
        </div>
      </div>

      <div className="wrap clinic-gallery-shell">
        <div
          className="clinic-gallery-rail"
          id="clinic-gallery-rail"
          ref={railRef}
          role="region"
          aria-label="Fotos da clínica"
          tabIndex={0}
          onKeyDown={handleKey}
        >
          {entries.map((entry, index) => (
            <figure
              className="clinic-gallery-item"
              key={entry.src}
              style={{ '--clinic-gallery-delay': `${Math.min(index, 2) * 80}ms` } as CSSProperties}
            >
              <div className="clinic-gallery-frame">
                <img
                  className="clinic-gallery-photo"
                  src={entry.src}
                  alt={entry.alt ?? entry.title}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: entry.position }}
                />
              </div>
              <figcaption>
                <a href={entry.href} target="_blank" rel="noreferrer" aria-label={`${entry.title}, abrir imagem em nova aba`}>
                  {entry.title} <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </figcaption>
            </figure>
          ))}
        </div>

        {entries.length > 1 && (
          <div className="clinic-gallery-toolbar">
            <div className="clinic-gallery-position">
              <span className="clinic-gallery-count" aria-hidden="true">
                <strong>{photoNumber(selected)}</strong><span> / {photoNumber(entries.length - 1)}</span>
              </span>
              <span className="clinic-gallery-progress" aria-hidden="true">
                <span ref={progressRef} style={{ '--clinic-gallery-progress': 1 / entries.length } as CSSProperties} />
              </span>
              <span className="clinic-gallery-announcement" role="status" aria-atomic="true">
                Foto {selected + 1} de {entries.length}
              </span>
            </div>

            <div className="clinic-gallery-controls" role="group" aria-label="Navegação da galeria">
              <button
                type="button"
                aria-label="Foto anterior"
                aria-controls="clinic-gallery-rail"
                aria-disabled={selected === 0}
                onClick={() => goTo(selectedRef.current - 1)}
              >
                <ArrowLeft size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Próxima foto"
                aria-controls="clinic-gallery-rail"
                aria-disabled={selected === entries.length - 1}
                onClick={() => goTo(selectedRef.current + 1)}
              >
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

