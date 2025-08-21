import React from 'react'

function NavBar() {
	return (
		<nav className="fixed top-0 left-0 right-0 z-[1000] bg-black/40 backdrop-blur-sm border-b border-white/10">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
				<div className="text-white font-semibold tracking-wide">DND Ai</div>
				<div className="hidden sm:flex gap-6 text-sm text-white/80">
					<a href="#information" className="hover:text-white transition-colors">Information</a>
					<a href="#story" className="hover:text-white transition-colors">Story</a>
					<a href="#characters" className="hover:text-white transition-colors">Characters</a>
					<a href="#map" className="hover:text-white transition-colors">Map</a>
				</div>
			</div>
		</nav>
	)
}

export default NavBar


