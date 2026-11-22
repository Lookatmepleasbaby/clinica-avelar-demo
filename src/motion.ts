import { useEffect, useLayoutEffect, useState } from 'react'

const preferenceKey = 'clinica-avelar-motion'
const mediaQuery = '(prefers-reduced-motion: reduce)'
type Motion = 'full' | 'reduced'

function readPreference(): Motion | null {
  try {
    const value = localStorage.getItem(preferenceKey)
    return value === 'full' || value === 'reduced' ? value : null
  } catch {
    return null
  }
}

export function useMotionPreference() {
  const [prefersReduced, setPrefersReduced] = useState(() => matchMedia(mediaQuery).matches)
  const [preference, setPreference] = useState(readPreference)
  const motion = preference ?? (prefersReduced ? 'reduced' : 'full')

  useLayoutEffect(() => {
    document.documentElement.dataset.motion = motion
  }, [motion])

  useEffect(() => {
    const query = matchMedia(mediaQuery)
    const syncSystemPreference = () => setPrefersReduced(query.matches)
    query.addEventListener('change', syncSystemPreference)
    return () => query.removeEventListener('change', syncSystemPreference)
  }, [])

  function toggleMotion() {
    const next = motion === 'full' ? 'reduced' : 'full'
    setPreference(next)
    try {
      localStorage.setItem(preferenceKey, next)
    } catch {
      // The preference still applies to the current visit.
    }
  }

  return { motion, toggleMotion }
}

export function useEditorialReveal(motion: Motion) {
  useLayoutEffect(() => {
    if (motion !== 'full' || !('IntersectionObserver' in window)) return

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return
        target.setAttribute('data-reveal-state', 'visible')
        revealObserver.unobserve(target)
      })
    }, { rootMargin: '0px 0px -4% 0px', threshold: .08 })

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    elements.forEach((element) => {
      if (element.dataset.revealState === 'visible') return

      const reached = element.getBoundingClientRect().top < innerHeight * .91
      element.dataset.revealState = reached ? 'visible' : 'waiting'
      if (!reached) revealObserver.observe(element)
    })

    return () => {
      revealObserver.disconnect()
      elements.forEach((element) => {
        if (element.dataset.revealState === 'waiting') delete element.dataset.revealState
      })
    }
  }, [motion])
}


