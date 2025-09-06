import React, { useEffect, useMemo, useRef } from 'react'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import { useSpring, animated as a } from '@react-spring/web'

import backgroundImg from '../assets/dark_fantasy_background.jpg'
import moonImg from '../assets/moon.png'
import castleImg from '../assets/castle.png'
import rocksImg from '../assets/rocks.png'
import frontFogImg from '../assets/front fog.png'

function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max)
}

const cfg = {
	pages: 2,
	speeds: { moon: -0.03, rocks: -0.25 },
	logo: { startScale: 1.0, endScale: 0.72, startY: 0, endY: -120, mobileEndY: -80, fadeOutAfter: 200 },
	rocksStartVH: 50,
}

function HeroParallax({ scrollY = 0, heroHeight = 0, infoHeight = 0, tCover = 0 }) {
	const backParallaxRef = useRef(null)
	const frontParallaxRef = useRef(null)
	const isMobile = useMemo(() => (typeof window !== 'undefined' ? window.matchMedia('(max-width: 640px)').matches : false), [])
	const speedScale = isMobile ? 0.6 : 1

	const tHero = useMemo(() => (heroHeight > 0 ? clamp(scrollY / heroHeight, 0, 1) : 0), [scrollY, heroHeight])

	useEffect(() => {
		const page = tHero * (cfg.pages - 1)
		if (backParallaxRef.current) backParallaxRef.current.scrollTo(page)
		if (frontParallaxRef.current) frontParallaxRef.current.scrollTo(page)
	}, [tHero])

	const endY = isMobile ? cfg.logo.mobileEndY : cfg.logo.endY
	const [{ logoScale, logoY, logoOpacity }, logoApi] = useSpring(() => ({ logoScale: 1, logoY: 0, logoOpacity: 1, config: { tension: 170, friction: 26 } }))
	useEffect(() => {
		const s = 1 + (0.72 - 1) * tHero
		const y = 0 + (endY - 0) * tHero
		const unpinAt = heroHeight + 0.5 * (infoHeight || 0)
		let opacity = 1
		if (scrollY > unpinAt) {
			const extra = clamp((scrollY - unpinAt) / 200, 0, 1)
			opacity = 1 - extra
		}
		logoApi.start({ logoScale: s, logoY: y, logoOpacity: opacity })
	}, [tHero, endY, scrollY, heroHeight, infoHeight, logoApi])

	return (
		<div className="fixed inset-0 z-10 pointer-events-none overflow-hidden bg-black">
			<img src={backgroundImg} alt="bg" className="absolute inset-0 z-0 w-full h-full object-cover object-center" />
			<img src={castleImg} alt="castle" className="absolute inset-0 z-10 w-full h-full object-cover object-bottom" />
			<img src={frontFogImg} alt="fog" className="absolute inset-0 z-30 w-full h-full object-cover opacity-80" />

			<div className="absolute inset-0 z-[35] bg-black" style={{ opacity: tCover * 0.6 }} />

			<Parallax ref={backParallaxRef} pages={cfg.pages} className="parallax-viewport absolute inset-0 z-5 h-full w-full" style={{ pointerEvents: 'none', background: 'transparent' }}>
				<ParallaxLayer offset={0} speed={cfg.speeds.moon * speedScale} style={{ zIndex: 1, pointerEvents: 'none', background: 'transparent' }}>
					<img src={moonImg} alt="moon" className="absolute inset-0 w-full h-full object-contain object-[70%_20%] opacity-90" />
				</ParallaxLayer>
			</Parallax>

			<Parallax ref={frontParallaxRef} pages={cfg.pages} className="parallax-viewport absolute inset-0 z-20 h-full w-full" style={{ pointerEvents: 'none', background: 'transparent' }}>
				<ParallaxLayer offset={0} speed={cfg.speeds.rocks * speedScale} style={{ zIndex: 1, pointerEvents: 'none', background: 'transparent' }}>
					<img
						src={rocksImg}
						alt="rocks"
						className="absolute inset-x-0 bottom-0 w-full h-auto object-contain object-bottom"
						style={{ transform: `translateY(${cfg.rocksStartVH}vh)` }}
					/>
				</ParallaxLayer>
			</Parallax>

			{/* Golden-Green Fantasy logo */}
			<a.div className="absolute inset-0 z-[900] flex items-center justify-center pointer-events-none" style={{ opacity: logoOpacity }}>
				<a.div style={{ transform: logoScale.to((s) => `scale(${s})`) }}>
					<a.div style={{ transform: logoY.to((y) => `translate3d(0, ${y}px, 0)`) }}>
						<h1 className="text-7xl sm:text-8xl fantasy-title ancient-glow vhs-text tracking-wider">
							DND <span className="text-5xl sm:text-6xl terminal-text">Ai</span>
						</h1>
					</a.div>
				</a.div>
			</a.div>
		</div>
	)
}

export default HeroParallax


