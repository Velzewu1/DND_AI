import React from 'react'
import bottomRocks from '../assets/BottomRocks.png'

function Information() {
	return (
		<section
			id="information"
			className="relative z-[100] w-screen flex items-center justify-center text-white"
			style={{
				aspectRatio: '2560 / 2880', // Correct aspect ratio for BottomRocks
				backgroundImage: `url(${bottomRocks})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center top',
				backgroundRepeat: 'no-repeat',
			}}
		>
			{/* Content container - centered */}
			<div className="relative px-8 max-w-4xl mx-auto grid gap-12">
				{/* Main title section */}
				<div className="text-center space-y-6">
					<h2 className="text-6xl sm:text-7xl fantasy-title ancient-glow vhs-text">
						Information
					</h2>
					<div className="h-0.5 bg-gradient-to-r from-transparent via-[#00ff41]/40 to-transparent" />
				</div>

				{/* Info grid - unified styling */}
				<div className="grid md:grid-cols-2 gap-6 text-sm">
					<div className="space-y-4 bg-black/85 p-6 border border-green-500/30 rounded shadow-lg shadow-green-500/10">
						<h3 className="terminal-text text-base uppercase tracking-wider text-green-400">System Overview</h3>
						<p className="text-gold-light/80 leading-relaxed text-sm font-serif">
							DND Ai integrates classic tabletop mechanics with modern AI assistance. 
							Real-time narrative generation, dynamic world-building, and intelligent NPC behavior.
						</p>
					</div>
					
					<div className="space-y-4 bg-black/85 p-6 border border-green-500/30 rounded shadow-lg shadow-green-500/10">
						<h3 className="terminal-text text-base uppercase tracking-wider text-green-400">Current Status</h3>
						<p className="text-gold-light/80 leading-relaxed text-sm font-serif">
							Alpha phase. Core systems operational. 
							Campaign management, character sheets, and basic AI dungeon master capabilities online.
						</p>
					</div>
					
					<div className="space-y-4 bg-black/85 p-6 border border-green-500/30 rounded shadow-lg shadow-green-500/10">
						<h3 className="terminal-text text-base uppercase tracking-wider text-green-400">Features</h3>
						<ul className="text-gold-light/80 space-y-2 text-sm font-serif">
							<li className="flex items-start gap-3">
								<span className="text-[#00ff41] mt-0.5">◆</span>
								<span>Adaptive storytelling engine</span>
							</li>
							<li className="flex items-start gap-3">
								<span className="text-[#00ff41] mt-0.5">◆</span>
								<span>Procedural dungeon generation</span>
							</li>
							<li className="flex items-start gap-3">
								<span className="text-[#00ff41] mt-0.5">◆</span>
								<span>Voice-activated gameplay</span>
							</li>
						</ul>
					</div>
					
					<div className="space-y-4 bg-black/85 p-6 border border-green-500/30 rounded shadow-lg shadow-green-500/10">
						<h3 className="terminal-text text-base uppercase tracking-wider text-green-400">Access</h3>
						<p className="text-gold-light/80 leading-relaxed text-sm font-serif">
							Limited beta access available Q2 2024. 
							Join the waitlist for early campaign testing.
						</p>
					</div>
				</div>

				{/* Call to action */}
				<div className="text-center">
					<button className="px-8 py-3 border border-green-500 text-green-100 bg-green-500/20 fantasy-title text-sm uppercase tracking-wider transition-all hover:bg-green-500/30 hover:border-gold-500 hover:text-gold-200 rounded">
						Begin Your Journey
					</button>
				</div>
			</div>
		</section>
	)
}

export default Information


