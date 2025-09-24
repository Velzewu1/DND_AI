import React, { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import NavBar from './components/NavBar.jsx'
import HeroParallax from './components/HeroParallax.jsx'
import Information from './sections/Information.jsx'
import Story from './sections/Story.jsx'
import Characters from './sections/Characters.jsx'
import Map from './sections/Map.jsx'
// Using public path for underground background

function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max)
}

function App() {
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

	// Derived cover progress (optional usage by child components)
	const coverStart = 0.35 * heroHeight
	const coverEnd = heroHeight + 0.4 * infoHeight
	const tCover = useMemo(() => clamp((scrollY - coverStart) / Math.max(coverEnd - coverStart, 1), 0, 1), [scrollY, coverStart, coverEnd])

	return (
		<main className="bg-black text-white w-screen overflow-x-hidden crt-lines vhs-noise dark-vignette">
			{/* Scroll Progress Indicator */}
			<div className="fixed top-0 left-0 right-0 z-[1001] h-1 bg-black/50">
				<div 
					className="h-full bg-gradient-to-r from-green-500 via-green-400 to-gold-500 transition-all duration-100 ease-out"
					style={{ width: `${Math.min((scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100)}%` }}
				/>
			</div>

			{/* Dark grading overlay */}
			<div className="dark-grading" aria-hidden="true" />
			
			{/* Enhanced atmospheric overlays */}
			<div className="atmospheric-overlay" aria-hidden="true" />
			<div className="edge-vignette" aria-hidden="true" />
			
			{/* Video noise overlay - add video element here later */}
			<div className="noise-overlay" aria-hidden="true">
				{/* <video autoPlay loop muted playsInline>
					<source src="/path-to-noise-video.webm" type="video/webm" />
				</video> */}
			</div>
			
			<NavBar />

			{/* Fixed hero below content (z-10) */}
			<HeroParallax scrollY={scrollY} heroHeight={heroHeight} infoHeight={infoHeight} tCover={tCover} />

			{/* Spacer to allow page scroll while hero stays fixed */}
			<div aria-hidden style={{ height: heroHeight }} />

			{/* Content sections (cover hero) */}
			<Information ref={infoRef} />
			
			{/* Underground section with 3 full-screen parts */}
			<div 
				className="relative w-screen h-[300vh] z-[50] overflow-hidden"
				style={{
					backgroundImage: `url(/underground_background.jpg)`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat'
				}}
			>
				{/* Enhanced background effects for all sections */}
				<div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%)]" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.08),transparent_50%)]" />
				<div className="absolute inset-0 bg-[conic-gradient(from_45deg_at_50%_50%,transparent_0deg,rgba(16,185,129,0.05)_90deg,transparent_180deg,rgba(168,85,247,0.05)_270deg,transparent_360deg)] animate-spin" style={{animationDuration: '30s'}} />
				<div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_0%,rgba(16,185,129,0.02)_25%,transparent_50%,rgba(168,85,247,0.02)_75%,transparent_100%)] animate-pulse" style={{animationDuration: '8s'}} />
				
				{/* Floating particles effect */}
				<div className="absolute inset-0">
					{[...Array(20)].map((_, i) => (
						<div
							key={i}
							className="absolute w-1 h-1 bg-green-400/30 rounded-full animate-pulse"
							style={{
								left: `${Math.random() * 100}%`,
								top: `${Math.random() * 100}%`,
								animationDelay: `${Math.random() * 5}s`,
								animationDuration: `${2 + Math.random() * 3}s`
							}}
						/>
					))}
				</div>
				{/* Story Section - 1/3 */}
				<Story />
				
				{/* Characters Section - 2/3 */}
				<Characters />
				
				{/* Map Section - 3/3 */}
				<Map />
			</div>
		</main>
	)
}

export default App
