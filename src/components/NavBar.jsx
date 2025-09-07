import React, { useState, useEffect } from 'react'

function NavBar() {
	const [activeSection, setActiveSection] = useState('hero')
	const [isScrolled, setIsScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY
			setIsScrolled(scrollPosition > 50)

			// Determine active section based on scroll position
			const sections = ['hero', 'information', 'story', 'characters', 'map']
			const sectionElements = sections.map(id => document.getElementById(id))
			
			let current = 'hero'
			sectionElements.forEach((element, index) => {
				if (element && element.offsetTop <= scrollPosition + 100) {
					current = sections[index]
				}
			})
			setActiveSection(current)
		}

		window.addEventListener('scroll', handleScroll, { passive: true })
		handleScroll()
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const scrollToSection = (sectionId) => {
		const element = document.getElementById(sectionId)
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}

	return (
		<nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
			isScrolled 
				? 'bg-black/95 backdrop-blur-md border-b border-green-500/30' 
				: 'bg-gradient-to-b from-black/95 to-black/85 backdrop-blur-sm border-b border-[#2d5016]/50'
		}`}>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
				{/* Brand */}
				<div className="flex items-baseline gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
					<span className="text-3xl fantasy-title vhs-text hover:scale-105 transition-transform">DND</span>
					<span className="text-xl terminal-text">Ai</span>
				</div>

				{/* Primary nav */}
				<ul className="hidden md:flex gap-6 text-sm">
					{[
						{ id: 'information', label: 'Information' },
						{ id: 'story', label: 'Story' },
						{ id: 'characters', label: 'Characters' },
						{ id: 'map', label: 'Map' }
					].map(({ id, label }) => (
						<li key={id}>
							<button
								onClick={() => scrollToSection(id)}
								className={`stone-text transition-all duration-200 relative px-2 py-1 ${
									activeSection === id 
										? 'text-green-400 shadow-md shadow-green-500/20' 
										: 'hover:text-[#f4e4bc]'
								}`}
							>
								{label}
								{activeSection === id && (
									<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400 animate-pulse" />
								)}
							</button>
						</li>
					))}
				</ul>

				{/* Mobile menu button */}
				<div className="md:hidden">
					<button className="terminal-text text-lg" aria-label="Menu">
						⚡
					</button>
				</div>

				{/* Action */}
				<div className="hidden md:flex">
					<button className="fantasy-button px-5 py-2 text-xs hover:scale-105 transition-transform">
						Enter Realm
					</button>
				</div>
			</div>
		</nav>
	)
}

export default NavBar


