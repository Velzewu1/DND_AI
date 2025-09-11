"use client"
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
		await new Promise(resolve => setTimeout(resolve, 2000))
		setIsGenerating(false)
		alert(`Story generated with setting: "${config.setting}"`)
	}

	return (
		<section id="story" className="h-screen w-screen text-white flex items-center justify-center px-4 relative">
			<div className="absolute inset-0 bg-black/30" />
			<div className="max-w-6xl w-full relative z-10">
				<div className="bg-black/90 border border-green-500/40 shadow-lg shadow-green-500/10 relative rounded">
					<div className="bg-green-500/10 border-b border-green-500/30 px-4 py-3 flex items-center justify-center">
						<div className="fantasy-title text-xl text-gold-primary ancient-glow">Chronicle Generator</div>
					</div>
					<div className="p-6">
						<div className="grid md:grid-cols-4 gap-6">
							<div className="space-y-3">
								<div className="terminal-text text-xs text-green-400 mb-2">REALM</div>
								<input type="text" value={config.setting} onChange={(e) => handleInputChange('setting', e.target.value)} placeholder="Enter realm..." className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-serif text-sm focus:border-gold-500 focus:outline-none transition-all rounded" />
								<select value={config.tone} onChange={(e) => handleInputChange('tone', e.target.value)} className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-serif text-sm focus:border-gold-500 focus:outline-none rounded">
									<option value="dark fantasy">Dark Fantasy</option>
									<option value="high fantasy">High Fantasy</option>
									<option value="horror">Gothic Horror</option>
									<option value="mystery">Arcane Mystery</option>
								</select>
							</div>
							<div className="space-y-3">
								<div className="terminal-text text-xs text-green-400 mb-2">STRUCTURE</div>
								<div>
									<div className="text-xs text-gold-light mb-1">Acts:</div>
									<div className="flex gap-1">
										{[1,2,3,4,5].map(num => (
											<button key={num} onClick={() => handleInputChange('acts', num)} className={`flex-1 px-2 py-1 border font-mono text-xs transition-all ${config.acts === num ? 'bg-green-500/30 border-green-400 text-green-100' : 'bg-black/60 border-green-500/30 text-green-300 hover:border-green-400'}`}>{num}</button>
										))}
									</div>
								</div>
								<div>
									<div className="text-xs text-gold-light mb-1">Scenes:</div>
									<div className="flex gap-1">
										{[1,2,3,4].map(num => (
											<button key={num} onClick={() => handleInputChange('scenesPerAct', num)} className={`flex-1 px-2 py-1 border font-mono text-xs transition-all ${config.scenesPerAct === num ? 'bg-green-500/30 border-green-400 text-green-100' : 'bg-black/60 border-green-500/30 text-green-300 hover:border-green-400'}`}>{num}</button>
										))}
									</div>
								</div>
							</div>
							<div className="space-y-3">
								<div className="terminal-text text-xs text-green-400 mb-2">DIFFICULTY</div>
								<div className="grid grid-cols-2 gap-1">
									{['simple','medium','complex','epic'].map(level => (
										<button key={level} onClick={() => handleInputChange('complexity', level)} className={`px-2 py-1 border font-mono text-xs transition-all uppercase ${config.complexity === level ? 'bg-green-500/30 border-green-400 text-green-100' : 'bg-black/60 border-green-500/30 text-green-300 hover:border-green-400'}`}>{level}</button>
									))}
								</div>
								<select value={config.npcDensity} onChange={(e) => handleInputChange('npcDensity', e.target.value)} className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-serif text-sm focus:border-gold-500 focus:outline-none rounded">
									<option value="low">Few NPCs</option>
									<option value="medium">Normal NPCs</option>
									<option value="high">Many NPCs</option>
									<option value="crowded">Crowded NPCs</option>
								</select>
							</div>
							<div className="space-y-3">
								<div className="terminal-text text-xs text-green-400 mb-2">STATUS</div>
								<div className="font-mono text-xs text-green-300 space-y-1 mb-3 bg-black/40 p-3 border border-green-500/20 rounded">
									<div className="flex justify-between"><span>Acts:</span><span className="text-gold-light">{config.acts}</span></div>
									<div className="flex justify-between"><span>Scenes:</span><span className="text-gold-light">{config.acts * config.scenesPerAct}</span></div>
									<div className="flex justify-between"><span>Ready:</span><span className={config.setting.trim() ? 'text-green-400' : 'text-red-400'}>{config.setting.trim() ? 'YES' : 'NO'}</span></div>
								</div>
								<button onClick={generateStory} disabled={!config.setting.trim() || isGenerating} className={`w-full px-4 py-2 border font-mono text-xs uppercase tracking-wider transition-all rounded ${!config.setting.trim() || isGenerating ? 'border-red-500/50 text-red-400 bg-red-500/10 cursor-not-allowed' : 'border-green-500 text-green-100 bg-green-500/20 hover:bg-green-500/30 hover:border-gold-500 hover:text-gold-200'}`}>
									{isGenerating ? 'GENERATING...' : !config.setting.trim() ? 'BLOCKED' : 'EXECUTE'}
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


