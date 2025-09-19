'use client'

import React, { useState } from 'react'

function Map() {
	const [mapConfig, setMapConfig] = useState({
		size: "medium",
		genre: "dark fantasy",
		style: "dungeon",
		seed: Math.floor(Math.random() * 999999)
	})

	const handleConfigChange = (field, value) => {
		setMapConfig(prev => ({ ...prev, [field]: value }))
	}

	const randomizeMap = () => {
		const sizes = ["small", "medium", "large", "massive"]
		const styles = ["dungeon", "overworld", "city", "wilderness", "underground", "planar"]
		
		setMapConfig(prev => ({
			...prev,
			size: sizes[Math.floor(Math.random() * sizes.length)],
			style: styles[Math.floor(Math.random() * styles.length)],
			seed: Math.floor(Math.random() * 999999)
		}))
	}

	const downloadMap = () => {
		console.log("Downloading map:", mapConfig)
		alert(`Generating ${mapConfig.size} ${mapConfig.style} map...`)
	}

	return (
		<section id="map" className="h-screen w-screen text-white flex items-center justify-center px-4 relative">
			{/* Unified overlay */}
			<div className="absolute inset-0 bg-black/30" />
			
			<div className="max-w-6xl w-full relative z-10">
				{/* Unified Interface Panel */}
				<div className="bg-black/90 border border-green-500/40 shadow-lg shadow-green-500/10 relative rounded">
					{/* Header */}
					<div className="bg-green-500/10 border-b border-green-500/30 px-4 py-3 flex items-center justify-center">
						<div className="fantasy-title text-xl text-gold-primary ancient-glow">
							Realm Cartographer
						</div>
					</div>

					{/* Content */}
					<div className="p-6">
						<div className="grid md:grid-cols-4 gap-6">
							{/* Configuration */}
							<div className="space-y-3">
								<div className="terminal-text text-xs text-green-400 mb-2">CONFIG</div>
								<div className="grid grid-cols-2 gap-1 mb-2">
									{['small', 'medium', 'large', 'massive'].map(size => (
										<button
											key={size}
											onClick={() => handleConfigChange('size', size)}
											className={`px-2 py-1 border font-mono text-xs transition-all uppercase ${
												mapConfig.size === size
													? 'bg-green-500/30 border-green-400 text-green-100'
													: 'bg-black/60 border-green-500/30 text-green-300 hover:border-green-400'
											}`}
										>
											{size}
										</button>
									))}
								</div>
								<select
									value={mapConfig.genre}
									onChange={(e) => handleConfigChange('genre', e.target.value)}
									className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-serif text-sm focus:border-gold-500 focus:outline-none rounded mb-2"
								>
									<option value="dark fantasy">Dark Fantasy</option>
									<option value="horror">Horror</option>
									<option value="gothic">Gothic</option>
									<option value="lovecraftian">Lovecraftian</option>
									<option value="cyberpunk">Cyberpunk</option>
								</select>
								<select
									value={mapConfig.style}
									onChange={(e) => handleConfigChange('style', e.target.value)}
									className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-serif text-sm focus:border-gold-500 focus:outline-none rounded"
								>
									<option value="dungeon">Dungeon</option>
									<option value="overworld">Overworld</option>
									<option value="city">City</option>
									<option value="wilderness">Wilderness</option>
									<option value="underground">Underground</option>
									<option value="planar">Planar</option>
								</select>
							</div>

							{/* Seed */}
							<div className="space-y-3">
								<div className="terminal-text text-xs text-green-400 mb-2">SEED</div>
								<div className="flex gap-1">
									<input
										type="number"
										value={mapConfig.seed}
										onChange={(e) => handleConfigChange('seed', parseInt(e.target.value))}
										className="flex-1 bg-black/80 border border-green-500/40 text-green-200 px-2 py-1 font-mono text-xs focus:border-gold-500 focus:outline-none rounded"
									/>
									<button
										onClick={() => handleConfigChange('seed', Math.floor(Math.random() * 999999))}
										className="px-2 py-1 border border-green-500/40 text-green-300 bg-black/60 font-mono text-xs hover:border-green-400 transition-all rounded"
									>
										🎲
									</button>
								</div>
								<div className="terminal-text text-xs text-green-400 mb-1 mt-3">LEGEND</div>
								<div className="grid grid-cols-2 gap-1 text-xs font-mono">
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-gray-600 border border-gray-500"></div>
										<span className="text-gray-300">Wall</span>
									</div>
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-yellow-600 border border-yellow-500"></div>
										<span className="text-yellow-300">Gold</span>
									</div>
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-red-600 border border-red-500"></div>
										<span className="text-red-300">Trap</span>
									</div>
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-blue-600 border border-blue-500"></div>
										<span className="text-blue-300">Water</span>
									</div>
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-green-600 border border-green-500"></div>
										<span className="text-green-300">Exit</span>
									</div>
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-purple-600 border border-purple-500"></div>
										<span className="text-purple-300">Magic</span>
									</div>
								</div>
							</div>

							{/* Preview */}
							<div className="space-y-3">
								<div className="terminal-text text-xs text-green-400 mb-2">PREVIEW</div>
								<div className="aspect-square bg-black/60 border border-green-500/20 p-1 relative overflow-hidden rounded">
									{/* Simulated map preview */}
									<div className="absolute inset-0 opacity-40">
										{Array.from({ length: 12 }, (_, row) => (
											<div key={row} className="flex">
												{Array.from({ length: 12 }, (_, col) => {
													const random = (row * 12 + col + mapConfig.seed) % 100
													let bgColor = 'bg-black'
													if (random > 85) bgColor = 'bg-gray-600'
													else if (random > 70) bgColor = 'bg-red-600/50'
													else if (random > 60) bgColor = 'bg-yellow-600/50'
													else if (random > 50) bgColor = 'bg-blue-600/50'
													else if (random > 40) bgColor = 'bg-green-600/50'
													else if (random > 30) bgColor = 'bg-purple-600/50'
													
													return (
														<div 
															key={col} 
															className={`w-2 h-2 ${bgColor} border border-green-500/10`}
														/>
													)
												})}
											</div>
										))}
									</div>
									
									{/* Overlay */}
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="text-center">
											<div className="terminal-text text-green-400 text-xs mb-1">GENERATING...</div>
											<div className="terminal-text text-green-300 text-xs uppercase">
												{mapConfig.size}
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Stats & Actions */}
							<div className="space-y-3 col-span-1">
								<div className="terminal-text text-xs text-green-400 mb-2">STATUS</div>
								<div className="bg-black/40 p-3 border border-green-500/20 rounded mb-3">
									<div className="text-xs font-mono text-green-300 space-y-1">
										<div className="flex justify-between">
											<span>Size:</span>
											<span className="text-gold-light uppercase">{mapConfig.size}</span>
										</div>
										<div className="flex justify-between">
											<span>Style:</span>
											<span className="text-gold-light uppercase">{mapConfig.style}</span>
										</div>
										<div className="flex justify-between">
											<span>Seed:</span>
											<span className="text-gold-light">{mapConfig.seed}</span>
										</div>
									</div>
								</div>
								<button
									onClick={randomizeMap}
									className="w-full px-3 py-2 border border-yellow-500 text-yellow-100 bg-yellow-500/20 font-mono text-xs uppercase tracking-wider transition-all hover:bg-yellow-500/30 hover:border-gold-500 hover:text-gold-200 rounded mb-2"
								>
									🎲 RANDOMIZE
								</button>
								<button
									onClick={downloadMap}
									className="w-full px-3 py-2 border border-green-500 text-green-100 bg-green-500/20 font-mono text-xs uppercase tracking-wider transition-all hover:bg-green-500/30 hover:border-gold-500 hover:text-gold-200 rounded"
								>
									⬇️ DOWNLOAD
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Map