"use client"
import React, { useState } from 'react'

function Characters() {
	const [character, setCharacter] = useState({
		name: "",
		race: "human",
		class: "fighter",
		culture: "northern",
		traits: ["", ""],
		items: ["", ""],
		fraction: "none",
		stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }
	})

	const handleInputChange = (field, value, index = null) => {
		if (field === 'traits' || field === 'items') {
			setCharacter(prev => ({
				...prev,
				[field]: prev[field].map((item, i) => i === index ? value : item)
			}))
		} else if (field === 'stats') {
			setCharacter(prev => ({
				...prev,
				stats: { ...prev.stats, [value.stat]: value.value }
			}))
		} else {
			setCharacter(prev => ({ ...prev, [field]: value }))
		}
	}

	const shuffleCharacter = () => {
		const races = ["human", "elf", "dwarf", "halfling", "orc", "tiefling"]
		const classes = ["fighter", "wizard", "rogue", "cleric", "ranger", "barbarian"]
		const cultures = ["northern", "eastern", "southern", "western", "nomadic", "urban"]
		const fractions = ["none", "guild", "order", "cult", "clan", "brotherhood"]
		
		setCharacter(prev => ({
			...prev,
			race: races[Math.floor(Math.random() * races.length)],
			class: classes[Math.floor(Math.random() * classes.length)],
			culture: cultures[Math.floor(Math.random() * cultures.length)],
			fraction: fractions[Math.floor(Math.random() * fractions.length)],
			stats: {
				str: Math.floor(Math.random() * 8) + 8,
				dex: Math.floor(Math.random() * 8) + 8,
				con: Math.floor(Math.random() * 8) + 8,
				int: Math.floor(Math.random() * 8) + 8,
				wis: Math.floor(Math.random() * 8) + 8,
				cha: Math.floor(Math.random() * 8) + 8,
			}
		}))
	}

	const generateImage = () => {
		console.log("Generating character image:", character)
		alert(`Generating image for ${character.race} ${character.class}`)
	}

	return (
		<section id="characters" className="h-screen w-screen text-white flex items-center justify-center px-4 relative">
			<div className="absolute inset-0 bg-black/30" />
			<div className="max-w-6xl w-full relative z-10">
				<div className="bg-black/90 border border-green-500/40 shadow-lg shadow-green-500/10 relative rounded">
					<div className="bg-green-500/10 border-b border-green-500/30 px-4 py-3 flex items-center justify-center">
						<div className="fantasy-title text-xl text-gold-primary ancient-glow">Character Forge</div>
					</div>
					<div className="p-6">
						<div className="grid md:grid-cols-5 gap-4">
							<div className="space-y-3">
								<div className="terminal-text text-xs text-green-400 mb-2">IDENTITY</div>
								<input type="text" value={character.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Hero name..." className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-serif text-sm focus:border-gold-500 focus:outline-none transition-all rounded mb-2" />
								<select value={character.race} onChange={(e) => handleInputChange('race', e.target.value)} className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-serif text-sm focus:border-gold-500 focus:outline-none rounded mb-2">
									<option value="human">Human</option>
									<option value="elf">Elf</option>
									<option value="dwarf">Dwarf</option>
									<option value="halfling">Halfling</option>
									<option value="orc">Orc</option>
									<option value="tiefling">Tiefling</option>
								</select>
								<select value={character.class} onChange={(e) => handleInputChange('class', e.target.value)} className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-serif text-sm focus:border-gold-500 focus:outline-none rounded">
									<option value="fighter">Fighter</option>
									<option value="wizard">Wizard</option>
									<option value="rogue">Rogue</option>
									<option value="cleric">Cleric</option>
									<option value="ranger">Ranger</option>
									<option value="barbarian">Barbarian</option>
								</select>
							</div>

							<div className="space-y-3">
								<div className="terminal-text text-xs text-green-400 mb-2">HERITAGE</div>
								<select value={character.culture} onChange={(e) => handleInputChange('culture', e.target.value)} className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-serif text-sm focus:border-gold-500 focus:outline-none rounded mb-2">
									<option value="northern">Northern</option>
									<option value="eastern">Eastern</option>
									<option value="southern">Southern</option>
									<option value="western">Western</option>
									<option value="nomadic">Nomadic</option>
									<option value="urban">Urban</option>
								</select>
								<select value={character.fraction} onChange={(e) => handleInputChange('fraction', e.target.value)} className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-serif text-sm focus:border-gold-500 focus:outline-none rounded">
									<option value="none">No Allegiance</option>
									<option value="guild">Guild</option>
									<option value="order">Order</option>
									<option value="cult">Cult</option>
									<option value="clan">Clan</option>
									<option value="brotherhood">Brotherhood</option>
								</select>
							</div>

							<div className="space-y-3">
								<div className="terminal-text text-xs text-green-400 mb-2">TRAITS</div>
								{character.traits.map((trait, index) => (
									<input key={index} type="text" value={trait} onChange={(e) => handleInputChange('traits', e.target.value, index)} placeholder={`Trait ${index + 1}...`} className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-serif text-sm focus:border-gold-500 focus:outline-none transition-all rounded mb-2" />
								))}
								<div className="terminal-text text-xs text-green-400 mb-1 mt-3">ITEMS</div>
								{character.items.map((item, index) => (
									<input key={index} type="text" value={item} onChange={(e) => handleInputChange('items', e.target.value, index)} placeholder={`Item ${index + 1}...`} className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-serif text-sm focus:border-gold-500 focus:outline-none transition-all rounded mb-2" />
								))}
							</div>

							<div className="space-y-3">
								<div className="terminal-text text-xs text-green-400 mb-2">ATTRIBUTES</div>
								<div className="space-y-2 bg-black/40 p-3 border border-green-500/20 rounded">
									{Object.entries(character.stats).map(([stat, value]) => (
										<div key={stat} className="flex justify-between items-center">
											<span className="terminal-text text-green-300 uppercase text-xs">{stat}:</span>
											<div className="flex items-center gap-2">
												<input type="range" min="3" max="18" value={value} onChange={(e) => handleInputChange('stats', { stat, value: parseInt(e.target.value) })} className="w-16 h-1 bg-black border border-green-500/40 appearance-none" />
												<span className="text-gold-light font-mono w-6 text-center text-xs">{value}</span>
											</div>
										</div>
									))}
									<div className="mt-2 pt-2 border-t border-green-500/20">
										<div className="flex justify-between text-xs">
											<span className="terminal-text text-green-300">Total:</span>
											<span className="text-gold-light font-mono">{Math.floor(Object.values(character.stats).reduce((a, b) => a + b, 0) / 6)}</span>
										</div>
									</div>
								</div>
							</div>

							<div className="space-y-3">
								<div className="terminal-text text-xs text-green-400 mb-2">ACTIONS</div>
								<div className="bg-black/40 p-3 border border-green-500/20 rounded mb-3">
									<div className="text-xs text-gold-light space-y-1">
										<div>{character.name || 'Unnamed'}</div>
										<div className="capitalize">{character.race} {character.class}</div>
										<div className="text-green-300 capitalize">{character.culture}</div>
										<div className="text-green-300 capitalize">{character.fraction}</div>
									</div>
								</div>
								<button onClick={shuffleCharacter} className="w-full px-3 py-2 border border-yellow-500 text-yellow-100 bg-yellow-500/20 font-mono text-xs uppercase tracking-wider transition-all hover:bg-yellow-500/30 hover:border-gold-500 hover:text-gold-200 rounded">🎲 RANDOMIZE</button>
								<button onClick={generateImage} className="w-full px-3 py-2 border border-purple-500 text-purple-100 bg-purple-500/20 font-mono text-xs uppercase tracking-wider transition-all hover:bg-purple-500/30 hover:border-gold-500 hover:text-gold-200 rounded">🎨 GENERATE</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Characters


