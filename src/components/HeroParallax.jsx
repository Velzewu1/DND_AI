import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import { useSpring, animated as a } from '@react-spring/web'

import backgroundImg from '../assets/dark_fantasy_background.jpg'
import moonImg from '../assets/moon.png'
import castleImg from '../assets/castle.png'
import rocksImg from '../assets/rocks.png'
import frontFogImg from '../assets/front fog.png'

const parallaxConfig = {
	speeds: {
		background: 0.0,
		moon: 0.08,
		castle: 0.05,
		rocks: 0.25,
		frontFog: 0.02,
	},
	logo: {
		startScale: 1.0,
		endScale: 0.7,
		startY: 0,
		endY: -120,
		fadeOutOnUnpin: true,
	},
	breakpoints: {
		unpinRatioInNextSection: 0.5,
	},
	mobile: {
		speedScale: 0.6,
		endY: -80,
	},
}

function useElementSize(element) {
	const [size, setSize] = useState({ width: 0, height: 0 })
	useEffect(() => {
		if (!element) return
		const ro = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { inlineSize: width, blockSize: height } = entry.borderBoxSize?.[0] || {}
				setSize({ width: width ?? entry.contentRect.width, height: height ?? entry.contentRect.height })
			}
		})
		ro.observe(element)
		return () => ro.disconnect()
	}, [element])
	return size
}

function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max)
}

function HeroParallax() {
	const heroRef = useRef(null)
	const parallaxRef = useRef(null)
	const isMobile = useMemo(() => (typeof window !== 'undefined' ? window.matchMedia('(max-width: 640px)').matches : false), [])

	const speeds = useMemo(() => {
		const scale = isMobile ? parallaxConfig.mobile.speedScale : 1
		return {
			background: parallaxConfig.speeds.background * scale,
			moon: parallaxConfig.speeds.moon * scale,
			castle: parallaxConfig.speeds.castle * scale,
			rocks: parallaxConfig.speeds.rocks * scale,
			frontFog: parallaxConfig.speeds.frontFog * scale,
		}
	}, [isMobile])

	const heroPages = 1.15

	const [{ logoScale, logoY, logoOpacity }, logoApi] = useSpring(() => ({
		logoScale: parallaxConfig.logo.startScale,
		logoY: parallaxConfig.logo.startY,
		logoOpacity: 1,
		config: { tension: 170, friction: 26 },
	}))

	const handleScroll = (e) => {
		const viewport = e?.target?.clientHeight || window.innerHeight || 1
		const scrollTop = e?.target?.scrollTop || 0
		const curr = scrollTop / viewport
		const t = clamp(curr / heroPages, 0, 1)
		const endY = isMobile ? parallaxConfig.mobile.endY : parallaxConfig.logo.endY
		const scale = parallaxConfig.logo.startScale + (parallaxConfig.logo.endScale - parallaxConfig.logo.startScale) * t
		const y = parallaxConfig.logo.startY + (endY - parallaxConfig.logo.startY) * t

		logoApi.start({ logoScale: scale, logoY: y })
	}

	useEffect(() => {
		// recalc logo on mobile breakpoint change
		logoApi.start({ logoScale: parallaxConfig.logo.startScale, logoY: parallaxConfig.logo.startY, logoOpacity: 1 })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMobile])

	// Measure hero and information for fade-out threshold
	const { height: heroHeight } = useElementSize(heroRef.current)
	const [infoEl, setInfoEl] = useState(null)
	useEffect(() => {
		setInfoEl(document.getElementById('information'))
	}, [])
	const { height: informationHeight } = useElementSize(infoEl)

	const unpinAt = heroHeight + parallaxConfig.breakpoints.unpinRatioInNextSection * (informationHeight || 0)

	// Opacity based on window scroll beyond hero
	useEffect(() => {
		if (!parallaxConfig.logo.fadeOutOnUnpin) return
		let raf = 0
		const onWinScroll = () => {
			if (raf) cancelAnimationFrame(raf)
			raf = requestAnimationFrame(() => {
				const y = window.scrollY || window.pageYOffset || 0
				if (y <= unpinAt) {
					logoApi.start({ logoOpacity: 1 })
					return
				}
				const extra = clamp((y - unpinAt) / 200, 0, 1)
				logoApi.start({ logoOpacity: 1 - extra })
			})
		}
		onWinScroll()
		window.addEventListener('scroll', onWinScroll, { passive: true })
		return () => {
			if (raf) cancelAnimationFrame(raf)
			window.removeEventListener('scroll', onWinScroll)
		}
	}, [logoApi, unpinAt])

	return (
		<section ref={heroRef} className="relative w-screen h-screen bg-black text-white overflow-hidden">
			{/* Fixed overlay logo to span into next section for fade-out */}
			<div className="pointer-events-none fixed inset-0 z-[900] flex items-center justify-center">
				<a.div style={{ opacity: logoOpacity, willChange: 'transform, opacity', transform: logoScale.to((s) => `scale(${s})`) }}>
					<a.div className="text-white font-extrabold tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]" style={{ transform: logoY.to((y) => `translate3d(0, ${y}px, 0)`) }}>
						<span className="text-5xl sm:text-6xl">DND</span>
						<span className="mx-2 text-rose-400">Ai</span>
					</a.div>
				</a.div>
			</div>

			<Parallax ref={parallaxRef} pages={heroPages} className="h-screen w-screen" onScroll={handleScroll}>
				{/* Hero layers */}
				<ParallaxLayer offset={0} factor={heroPages} speed={speeds.background} style={{ zIndex: 0 }}>
					<img src={backgroundImg} alt="background" loading="lazy" className="w-full h-full object-cover" />
				</ParallaxLayer>

				<ParallaxLayer offset={0} factor={heroPages} speed={speeds.moon} style={{ zIndex: 10, pointerEvents: 'none' }}>
					<img src={moonImg} alt="moon" loading="lazy" className="w-full h-full object-contain object-[70%_20%] opacity-90" />
				</ParallaxLayer>

				<ParallaxLayer offset={0} factor={heroPages} speed={speeds.castle} style={{ zIndex: 20, pointerEvents: 'none' }}>
					<img src={castleImg} alt="castle" loading="lazy" className="w-full h-full object-contain object-center" />
				</ParallaxLayer>

				<ParallaxLayer offset={0} factor={heroPages} speed={speeds.rocks} style={{ zIndex: 30, pointerEvents: 'none' }}>
					<img src={rocksImg} alt="rocks" loading="lazy" className="w-full h-full object-cover object-bottom opacity-95" />
				</ParallaxLayer>

				<ParallaxLayer offset={0} factor={heroPages} speed={speeds.frontFog} style={{ zIndex: 40, pointerEvents: 'none' }}>
					<img src={frontFogImg} alt="front fog" loading="lazy" className="w-full h-full object-cover opacity-80" />
				</ParallaxLayer>
			</Parallax>
		</section>
	)
}

export default HeroParallax


