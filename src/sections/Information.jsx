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

				{/* Info grid */}
				<div className="grid md:grid-cols-2 gap-8 text-sm">
					<div className="space-y-4 bg-gradient-to-b from-black/80 to-black/60 backdrop-blur-sm p-6 engraved-border">
						<h3 className="terminal-text text-base uppercase tracking-wider">System Overview</h3>
						<p className="text-[#f4e4bc]/70 leading-relaxed text-sm font-['IM_Fell_English']">
							DND Ai integrates classic tabletop mechanics with modern AI assistance. 
							Real-time narrative generation, dynamic world-building, and intelligent NPC behavior.
						</p>
					</div>
					
					<div className="space-y-4 bg-gradient-to-b from-black/80 to-black/60 backdrop-blur-sm p-6 engraved-border">
						<h3 className="terminal-text text-base uppercase tracking-wider">Current Status</h3>
						<p className="text-[#f4e4bc]/70 leading-relaxed text-sm font-['IM_Fell_English']">
							Alpha phase. Core systems operational. 
							Campaign management, character sheets, and basic AI dungeon master capabilities online.
						</p>
					</div>
					
					<div className="space-y-4 bg-gradient-to-b from-black/80 to-black/60 backdrop-blur-sm p-6 engraved-border">
						<h3 className="terminal-text text-base uppercase tracking-wider">Features</h3>
						<ul className="text-[#f4e4bc]/70 space-y-2 text-sm font-['IM_Fell_English']">
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
					
					<div className="space-y-4 bg-gradient-to-b from-black/80 to-black/60 backdrop-blur-sm p-6 engraved-border">
						<h3 className="terminal-text text-base uppercase tracking-wider">Access</h3>
						<p className="text-[#f4e4bc]/70 leading-relaxed text-sm font-['IM_Fell_English']">
							Limited beta access available Q2 2024. 
							Join the waitlist for early campaign testing.
						</p>
					</div>
				</div>

				{/* Call to action */}
				<div className="text-center">
					<button className="fantasy-button px-8 py-3 text-sm">
						Begin Your Journey
					</button>
				</div>
			</div>
		</section>
	)
}

export default Information


