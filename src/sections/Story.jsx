import React, { useState } from 'react'

function Story() {
	const [config, setConfig] = useState({
		setting: "",
		tone: "dark fantasy",
		acts: 3,
		scenesPerAct: 2,
		complexity: "medium",
		focus: "exploration",
		npcDensity: "medium"
	})
	const [isGenerating, setIsGenerating] = useState(false)

	const handleInputChange = (field, value) => {
		setConfig(prev => ({ ...prev, [field]: value }))
	}

	const generateStory = async () => {
		if (!config.setting.trim()) return
		
		setIsGenerating(true)
		console.log("Story Configuration:", config)
		
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 2000))
		
		setIsGenerating(false)
		alert(`Story generated with setting: "${config.setting}"`)
	}

	return (
		<section id="story" className="h-screen w-screen text-white flex items-center justify-center px-4 relative">
			{/* Dark overlay for readability */}
			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
			
			<div className="max-w-7xl w-full relative z-10">
				{/* Terminal Interface */}
				<div className="bg-black/90 border border-green-500/60 shadow-md shadow-green-500/20 relative">
					{/* Terminal Title Bar */}
					<div className="bg-green-500/10 border-b border-green-500/30 px-3 py-2 flex items-center justify-between">
						<div className="terminal-text text-xs text-green-400">
							⚡ CHRONICLE.EXE | DM_AI v2.1.337 ⚡
						</div>
						<div className="flex gap-1">
							<div className="w-2 h-2 bg-red-500/60 border border-red-400"></div>
							<div className="w-2 h-2 bg-yellow-500/60 border border-yellow-400"></div>
							<div className="w-2 h-2 bg-green-500/60 border border-green-400 animate-pulse"></div>
						</div>
					</div>

					{/* Terminal Content */}
					<div className="p-4">
						{/* Command Prompt */}
						<div className="terminal-text text-xs mb-3 text-green-300">
							<span className="text-green-400">root@dungeon:~$</span> configure_adventure --interactive
						</div>

						<div className="grid lg:grid-cols-4 md:grid-cols-2 gap-3">
							{/* Column 1 - World Setting */}
							<div className="bg-green-500/5 border border-green-500/20 p-3">
								<div className="terminal-text text-xs mb-2 text-green-400">[WORLD_SETTING]</div>
								<input
									type="text"
									value={config.setting}
									onChange={(e) => handleInputChange('setting', e.target.value)}
									placeholder="> Enter realm..."
									className="w-full bg-black/80 border border-green-500/40 text-green-200 px-2 py-1 font-mono text-xs focus:border-green-400 focus:outline-none transition-all vhs-text mb-2"
								/>
								<select
									value={config.tone}
									onChange={(e) => handleInputChange('tone', e.target.value)}
									className="w-full bg-black/80 border border-green-500/40 text-green-200 px-2 py-1 font-mono text-xs focus:border-green-400 focus:outline-none"
								>
									<option value="dark fantasy">DARK_FANTASY</option>
									<option value="high fantasy">HIGH_FANTASY</option>
									<option value="horror">HORROR_MODE</option>
									<option value="mystery">MYSTERY_BOX</option>
								</select>
							</div>

							{/* Column 2 - Structure */}
							<div className="bg-green-500/5 border border-green-500/20 p-3">
								<div className="terminal-text text-xs mb-2 text-green-400">[STRUCTURE]</div>
								<div className="grid grid-cols-2 gap-2 mb-2">
									<div>
										<div className="text-xs text-green-300 mb-1">ACTS:</div>
										<div className="flex gap-1">
											{[1, 2, 3, 4, 5].map(num => (
												<button
													key={num}
													onClick={() => handleInputChange('acts', num)}
													className={`flex-1 px-1 py-1 border font-mono text-xs transition-all ${
														config.acts === num
															? 'bg-green-500/30 border-green-400 text-green-100'
															: 'bg-black/60 border-green-500/30 text-green-300 hover:border-green-400'
													}`}
												>
													{num}
												</button>
											))}
										</div>
									</div>
									<div>
										<div className="text-xs text-green-300 mb-1">SCENES:</div>
										<div className="flex gap-1">
											{[1, 2, 3, 4].map(num => (
												<button
													key={num}
													onClick={() => handleInputChange('scenesPerAct', num)}
													className={`flex-1 px-1 py-1 border font-mono text-xs transition-all ${
														config.scenesPerAct === num
															? 'bg-green-500/30 border-green-400 text-green-100'
															: 'bg-black/60 border-green-500/30 text-green-300 hover:border-green-400'
													}`}
												>
													{num}
												</button>
											))}
										</div>
									</div>
								</div>
								<select
									value={config.focus}
									onChange={(e) => handleInputChange('focus', e.target.value)}
									className="w-full bg-black/80 border border-green-500/40 text-green-200 px-2 py-1 font-mono text-xs focus:border-green-400 focus:outline-none"
								>
									<option value="exploration">EXPLORE.EXE</option>
									<option value="combat">COMBAT.SYS</option>
									<option value="roleplay">SOCIAL.DLL</option>
									<option value="puzzle">PUZZLE.BIN</option>
								</select>
							</div>

							{/* Column 3 - Complexity */}
							<div className="bg-green-500/5 border border-green-500/20 p-3">
								<div className="terminal-text text-xs mb-2 text-green-400">[COMPLEXITY]</div>
								<div className="grid grid-cols-2 gap-1 mb-2">
									{['simple', 'medium', 'complex', 'epic'].map(level => (
										<button
											key={level}
											onClick={() => handleInputChange('complexity', level)}
											className={`px-2 py-1 border font-mono text-xs transition-all uppercase ${
												config.complexity === level
													? 'bg-green-500/30 border-green-400 text-green-100'
													: 'bg-black/60 border-green-500/30 text-green-300 hover:border-green-400'
											}`}
										>
											{level}
										</button>
									))}
								</div>
								<select
									value={config.npcDensity}
									onChange={(e) => handleInputChange('npcDensity', e.target.value)}
									className="w-full bg-black/80 border border-green-500/40 text-green-200 px-2 py-1 font-mono text-xs focus:border-green-400 focus:outline-none"
								>
									<option value="low">LOW_NPC</option>
									<option value="medium">MED_NPC</option>
									<option value="high">HIGH_NPC</option>
									<option value="crowded">CROWD_NPC</option>
								</select>
							</div>

							{/* Column 4 - Status & Execute */}
							<div className="bg-black/60 border border-green-500/30 p-3">
								<div className="terminal-text text-xs mb-2 text-green-400">[STATUS]</div>
								<div className="font-mono text-xs text-green-300 space-y-1 mb-3">
									<div className="flex justify-between">
										<span>ACTS:</span>
										<span className="text-green-100">{config.acts}</span>
									</div>
									<div className="flex justify-between">
										<span>SCENES:</span>
										<span className="text-green-100">{config.acts * config.scenesPerAct}</span>
									</div>
									<div className="flex justify-between">
										<span>LEVEL:</span>
										<span className="text-green-100 uppercase">{config.complexity}</span>
									</div>
									<div className="flex justify-between">
										<span>STATUS:</span>
										<span className={config.setting.trim() ? "text-green-400 animate-pulse" : "text-red-400"}>
											{config.setting.trim() ? "READY" : "WAITING"}
										</span>
									</div>
								</div>
								<button
									onClick={generateStory}
									disabled={!config.setting.trim() || isGenerating}
									className={`w-full px-3 py-2 border font-mono text-xs uppercase tracking-wider transition-all ${
										!config.setting.trim() || isGenerating
											? 'border-red-500/50 text-red-400 bg-red-500/10 cursor-not-allowed' 
											: 'border-green-500 text-green-100 bg-green-500/20 hover:bg-green-500/30 hover:shadow-md hover:shadow-green-500/30 vhs-text hover:scale-105'
									} ${isGenerating ? 'loading' : ''}`}
								>
									{isGenerating ? '⚡ GENERATING...' : !config.setting.trim() ? '⚠ BLOCKED' : '⚡ EXECUTE'}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Story