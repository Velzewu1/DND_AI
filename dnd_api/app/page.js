"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import NavBar from './components/NavBar'
import HeroParallax from './components/HeroParallax'
import Information from './sections/Information'
import Story from './sections/Story'
import Characters from './sections/Characters'
import Map from './sections/Map'

const undergroundBg = '/assets/underground_background.jpg'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export default function Home() {
  const infoRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)
  const [heroHeight, setHeroHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 0)
  const [infoHeight, setInfoHeight] = useState(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setScrollY(window.scrollY || window.pageYOffset || 0))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    const onResize = () => setHeroHeight(window.innerHeight)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!infoRef.current) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height
        setInfoHeight(h)
      }
    })
    ro.observe(infoRef.current)
    return () => ro.disconnect()
  }, [infoRef])

  const coverStart = 0.35 * heroHeight
  const coverEnd = heroHeight + 0.4 * infoHeight
  const tCover = useMemo(() => clamp((scrollY - coverStart) / Math.max(coverEnd - coverStart, 1), 0, 1), [scrollY, coverStart, coverEnd])

  return (
    <main className="bg-black text-white w-screen overflow-x-hidden crt-lines vhs-noise dark-vignette">
      <div className="fixed top-0 left-0 right-0 z-[1001] h-1 bg-black/50">
        <div className="h-full bg-gradient-to-r from-green-500 via-green-400 to-gold-500 transition-all duration-100 ease-out" style={{ width: `${Math.min((scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100)}%` }} />
      </div>

      <div className="dark-grading" aria-hidden="true" />
      <div className="atmospheric-overlay" aria-hidden="true" />
      <div className="edge-vignette" aria-hidden="true" />
      <div className="noise-overlay" aria-hidden="true" />

      <NavBar />
      <HeroParallax scrollY={scrollY} heroHeight={heroHeight} infoHeight={infoHeight} tCover={tCover} />
      <div aria-hidden style={{ height: heroHeight }} />
      <Information ref={infoRef} />
      <div className="relative w-screen h-[300vh] z-[50]" style={{ backgroundImage: `url(${undergroundBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <Story />
        <Characters />
        <Map />
      </div>
    </main>
  )
}
