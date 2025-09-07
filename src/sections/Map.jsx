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
			{/* Dark overlay for readability */}
			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
			
			<div className="max-w-7xl w-full relative z-10">
				{/* Terminal Interface */}
				<div className="bg-black/90 border border-purple-500/60 shadow-md shadow-purple-500/20 relative">
					{/* Terminal Title Bar */}
					<div className="bg-purple-500/10 border-b border-purple-500/30 px-3 py-2 flex items-center justify-between">
						<div className="terminal-text text-xs text-purple-400">
							🗺️ CARTOGRAPHER.SYS | VOID_MAPPER v3.14.159 🗺️
						</div>
						<div className="flex gap-1">
							<div className="w-2 h-2 bg-red-500/60 border border-red-400"></div>
							<div className="w-2 h-2 bg-yellow-500/60 border border-yellow-400"></div>
							<div className="w-2 h-2 bg-purple-500/80 border border-purple-400 animate-pulse"></div>
						</div>
					</div>

					{/* Terminal Content */}
					<div className="p-4">
						{/* Command Prompt */}
						<div className="terminal-text text-xs mb-3 text-purple-300">
							<span className="text-purple-400">void@cartographer:~$</span> generate_realm --dark-fantasy --procedural
						</div>

						<div className="grid lg:grid-cols-4 md:grid-cols-2 gap-3">
							{/* Column 1 - Configuration */}
							<div className="bg-purple-500/5 border border-purple-500/20 p-3">
								<div className="terminal-text text-xs mb-2 text-purple-400">[REALM_PARAMS]</div>
								<div className="grid grid-cols-2 gap-1 mb-2">
									{['small', 'medium', 'large', 'massive'].map(size => (
										<button
											key={size}
											onClick={() => handleConfigChange('size', size)}
											className={`px-2 py-1 border font-mono text-xs transition-all uppercase ${
												mapConfig.size === size
													? 'bg-purple-500/30 border-purple-400 text-purple-100'
													: 'bg-black/60 border-purple-500/30 text-purple-300 hover:border-purple-400'
											}`}
										>
											{size}
										</button>
									))}
								</div>
								<select
									value={mapConfig.genre}
									onChange={(e) => handleConfigChange('genre', e.target.value)}
									className="w-full bg-black/80 border border-purple-500/40 text-purple-200 px-2 py-1 font-mono text-xs focus:border-purple-400 focus:outline-none mb-2"
								>
									<option value="dark fantasy">DARK_FANTASY</option>
									<option value="horror">HORROR_REALM</option>
									<option value="gothic">GOTHIC_NIGHTMARE</option>
									<option value="lovecraftian">ELDRITCH_HORROR</option>
									<option value="cyberpunk">CYBER_DYSTOPIA</option>
								</select>
								<select
									value={mapConfig.style}
									onChange={(e) => handleConfigChange('style', e.target.value)}
									className="w-full bg-black/80 border border-purple-500/40 text-purple-200 px-2 py-1 font-mono text-xs focus:border-purple-400 focus:outline-none"
								>
									<option value="dungeon">DUNGEON_CRAWL</option>
									<option value="overworld">OVERWORLD_MAP</option>
									<option value="city">CURSED_CITY</option>
									<option value="wilderness">DARK_WILDS</option>
									<option value="underground">VOID_DEPTHS</option>
									<option value="planar">PLANAR_SHIFT</option>
								</select>
							</div>

							{/* Column 2 - Seed & Legend */}
							<div className="bg-purple-500/5 border border-purple-500/20 p-3">
								<div className="terminal-text text-xs mb-2 text-purple-400">[CHAOS_SEED]</div>
								<div className="flex gap-1 mb-3">
									<input
										type="number"
										value={mapConfig.seed}
										onChange={(e) => handleConfigChange('seed', parseInt(e.target.value))}
										className="flex-1 bg-black/80 border border-purple-500/40 text-purple-200 px-2 py-1 font-mono text-xs focus:border-purple-400 focus:outline-none vhs-text"
									/>
									<button
										onClick={() => handleConfigChange('seed', Math.floor(Math.random() * 999999))}
										className="px-2 py-1 border border-purple-500/40 text-purple-300 bg-black/60 font-mono text-xs hover:border-purple-400 transition-all"
									>
										🎲
									</button>
								</div>
								<div className="terminal-text text-xs mb-1 text-purple-400">[LEGEND]</div>
								<div className="grid grid-cols-2 gap-1 text-xs font-mono">
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-gray-600 border border-gray-500"></div>
										<span className="text-gray-300">WALL</span>
									</div>
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-yellow-600 border border-yellow-500"></div>
										<span className="text-yellow-300">GOLD</span>
									</div>
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-red-600 border border-red-500"></div>
										<span className="text-red-300">TRAP</span>
									</div>
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-blue-600 border border-blue-500"></div>
										<span className="text-blue-300">WATER</span>
									</div>
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-green-600 border border-green-500"></div>
										<span className="text-green-300">EXIT</span>
									</div>
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-purple-600 border border-purple-500"></div>
										<span className="text-purple-300">MAGIC</span>
									</div>
								</div>
							</div>

							{/* Column 3 - Map Preview */}
							<div className="bg-black/60 border border-purple-500/30 p-3">
								<div className="terminal-text text-xs mb-2 text-purple-400">[MAP_PREVIEW]</div>
								<div className="aspect-square bg-black/60 border border-purple-500/20 p-1 relative overflow-hidden mb-2">
									{/* Simulated map preview */}
									<div className="absolute inset-0 opacity-30">
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
															className={`w-2 h-2 ${bgColor} border border-purple-500/10`}
														/>
													)
												})}
											</div>
										))}
									</div>
									
									{/* Overlay text */}
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="text-center">
											<div className="terminal-text text-purple-400 text-xs mb-1">GENERATING...</div>
											<div className="terminal-text text-purple-300 text-xs">
												{mapConfig.size.toUpperCase()}
											</div>
										</div>
									</div>
								</div>
								<div className="text-xs font-mono text-purple-300">
									<div className="flex justify-between">
										<span>STYLE:</span>
										<span className="text-purple-200 uppercase">{mapConfig.style}</span>
									</div>
								</div>
							</div>

							{/* Column 4 - Stats & Actions */}
							<div className="bg-black/60 border border-gray-500/30 p-3">
								<div className="terminal-text text-xs mb-2 text-gray-400">[REALM_STATS]</div>
								<div className="text-xs font-mono text-gray-300 space-y-1 mb-3">
									<div className="flex justify-between">
										<span>SIZE:</span>
										<span className="text-purple-200 uppercase">{mapConfig.size}</span>
									</div>
									<div className="flex justify-between">
										<span>GENRE:</span>
										<span className="text-purple-200 uppercase">{mapConfig.genre.split(' ')[0]}</span>
									</div>
									<div className="flex justify-between">
										<span>SEED:</span>
										<span className="text-purple-200 font-mono">{mapConfig.seed}</span>
									</div>
									<div className="flex justify-between mt-2 pt-2 border-t border-gray-500/20">
										<span>EST_SIZE:</span>
										<span className="text-purple-200">
											{mapConfig.size === 'small' && '~100KB'}
											{mapConfig.size === 'medium' && '~500KB'}
											{mapConfig.size === 'large' && '~2MB'}
											{mapConfig.size === 'massive' && '~8MB'}
										</span>
									</div>
								</div>
								<div className="space-y-2">
									<button
										onClick={randomizeMap}
										className="w-full px-2 py-1 border border-yellow-500 text-yellow-100 bg-yellow-500/20 font-mono text-xs uppercase tracking-wider transition-all hover:bg-yellow-500/30 vhs-text"
									>
										🎲 RANDOMIZE
									</button>
									<button
										onClick={downloadMap}
										className="w-full px-2 py-1 border border-green-500 text-green-100 bg-green-500/20 font-mono text-xs uppercase tracking-wider transition-all hover:bg-green-500/30 vhs-text"
									>
										⬇️ DOWNLOAD
									</button>
								</div>
								<div className="mt-2 pt-2 border-t border-gray-500/20">
									<div className="grid grid-cols-2 gap-1 text-xs">
										<button className="px-1 py-1 border border-red-500/30 text-red-300 bg-black/60 font-mono hover:border-red-400 transition-all">
											.PNG
										</button>
										<button className="px-1 py-1 border border-red-500/30 text-red-300 bg-black/60 font-mono hover:border-red-400 transition-all">
											.JSON
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Map