import React from 'react'

function NavBar() {
	return (
		<nav className="fixed top-0 left-0 right-0 z-[1000] bg-gradient-to-b from-black/95 to-black/85 backdrop-blur-sm border-b border-[#2d5016]/50">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
				{/* Brand */}
				<div className="flex items-baseline gap-2">
					<span className="text-3xl fantasy-title vhs-text">DND</span>
					<span className="text-xl terminal-text">Ai</span>
				</div>

				{/* Primary nav */}
				<ul className="hidden md:flex gap-8 text-sm">
					<li><a className="stone-text hover:text-[#f4e4bc] transition-colors" href="#information">Information</a></li>
					<li><a className="stone-text hover:text-[#f4e4bc] transition-colors" href="#story">Story</a></li>
					<li><a className="stone-text hover:text-[#f4e4bc] transition-colors" href="#characters">Characters</a></li>
					<li><a className="stone-text hover:text-[#f4e4bc] transition-colors" href="#map">Map</a></li>
				</ul>

				{/* Action */}
				<div className="flex">
					<button className="fantasy-button px-5 py-2 text-xs">
						Enter Realm
					</button>
				</div>
			</div>
		</nav>
	)
}

export default NavBar


