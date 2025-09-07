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
			{/* Dark overlay for readability */}
			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
			
			<div className="max-w-7xl w-full relative z-10">
				{/* Terminal Interface */}
				<div className="bg-black/90 border border-red-500/60 shadow-md shadow-red-500/20 relative">
					{/* Terminal Title Bar */}
					<div className="bg-red-500/10 border-b border-red-500/30 px-3 py-2 flex items-center justify-between">
						<div className="terminal-text text-xs text-red-400">
							💀 CHARACTER.FORGE | NECRO_WORKSHOP v6.66.13 💀
						</div>
						<div className="flex gap-1">
							<div className="w-2 h-2 bg-red-500/80 border border-red-400 animate-pulse"></div>
							<div className="w-2 h-2 bg-yellow-500/60 border border-yellow-400"></div>
							<div className="w-2 h-2 bg-green-500/40 border border-green-400"></div>
						</div>
					</div>

					{/* Terminal Content */}
					<div className="p-4">
						{/* Command Prompt */}
						<div className="terminal-text text-xs mb-3 text-red-300">
							<span className="text-red-400">necro@forge:~$</span> summon_character --bind-soul --dark-essence
						</div>

						<div className="grid lg:grid-cols-5 md:grid-cols-3 gap-3">
							{/* Column 1 - Identity */}
							<div className="bg-red-500/5 border border-red-500/20 p-3">
								<div className="terminal-text text-xs mb-2 text-red-400">[SOUL_MATRIX]</div>
								<input
									type="text"
									value={character.name}
									onChange={(e) => handleInputChange('name', e.target.value)}
									placeholder="> True name..."
									className="w-full bg-black/80 border border-red-500/40 text-red-200 px-2 py-1 font-mono text-xs focus:border-red-400 focus:outline-none transition-all vhs-text mb-2"
								/>
								<select
									value={character.race}
									onChange={(e) => handleInputChange('race', e.target.value)}
									className="w-full bg-black/80 border border-red-500/40 text-red-200 px-2 py-1 font-mono text-xs focus:border-red-400 focus:outline-none mb-2"
								>
									<option value="human">HUMAN</option>
									<option value="elf">ELF_BORN</option>
									<option value="dwarf">STONE_KIN</option>
									<option value="halfling">SMALL_FOLK</option>
									<option value="orc">ORC_BLOOD</option>
									<option value="tiefling">DEMON_TOUCHED</option>
								</select>
								<select
									value={character.class}
									onChange={(e) => handleInputChange('class', e.target.value)}
									className="w-full bg-black/80 border border-red-500/40 text-red-200 px-2 py-1 font-mono text-xs focus:border-red-400 focus:outline-none"
								>
									<option value="fighter">DEATH_KNIGHT</option>
									<option value="wizard">NECROMANCER</option>
									<option value="rogue">SHADOW_BLADE</option>
									<option value="cleric">DARK_PRIEST</option>
									<option value="ranger">VOID_STALKER</option>
									<option value="barbarian">BLOOD_REAVER</option>
								</select>
							</div>

							{/* Column 2 - Heritage */}
							<div className="bg-yellow-500/5 border border-yellow-500/20 p-3">
								<div className="terminal-text text-xs mb-2 text-yellow-400">[BLOODLINE]</div>
								<select
									value={character.culture}
									onChange={(e) => handleInputChange('culture', e.target.value)}
									className="w-full bg-black/80 border border-yellow-500/40 text-yellow-200 px-2 py-1 font-mono text-xs focus:border-yellow-400 focus:outline-none mb-2"
								>
									<option value="northern">FROST_REALM</option>
									<option value="eastern">SHADOW_LANDS</option>
									<option value="southern">BONE_DESERT</option>
									<option value="western">BLOOD_COAST</option>
									<option value="nomadic">VOID_WANDERER</option>
									<option value="urban">DARK_CITADEL</option>
								</select>
								<select
									value={character.fraction}
									onChange={(e) => handleInputChange('fraction', e.target.value)}
									className="w-full bg-black/80 border border-yellow-500/40 text-yellow-200 px-2 py-1 font-mono text-xs focus:border-yellow-400 focus:outline-none"
								>
									<option value="none">NO_ALLEGIANCE</option>
									<option value="guild">SHADOW_GUILD</option>
									<option value="order">DEATH_ORDER</option>
									<option value="cult">VOID_CULT</option>
									<option value="clan">BLOOD_CLAN</option>
									<option value="brotherhood">DARK_BROTHERHOOD</option>
								</select>
							</div>

							{/* Column 3 - Traits */}
							<div className="bg-purple-500/5 border border-purple-500/20 p-3">
								<div className="terminal-text text-xs mb-2 text-purple-400">[SOUL_TRAITS]</div>
								{character.traits.map((trait, index) => (
									<input
										key={index}
										type="text"
										value={trait}
										onChange={(e) => handleInputChange('traits', e.target.value, index)}
										placeholder={`> Trait ${index + 1}...`}
										className="w-full bg-black/80 border border-purple-500/40 text-purple-200 px-2 py-1 font-mono text-xs focus:border-purple-400 focus:outline-none transition-all mb-2"
									/>
								))}
								{character.items.map((item, index) => (
									<input
										key={index}
										type="text"
										value={item}
										onChange={(e) => handleInputChange('items', e.target.value, index)}
										placeholder={`> Item ${index + 1}...`}
										className="w-full bg-black/80 border border-blue-500/40 text-blue-200 px-2 py-1 font-mono text-xs focus:border-blue-400 focus:outline-none transition-all mb-2"
									/>
								))}
							</div>

							{/* Column 4 - Stats */}
							<div className="bg-black/60 border border-red-500/30 p-3">
								<div className="terminal-text text-xs mb-2 text-red-400">[ATTRIBUTES]</div>
								<div className="space-y-1 text-xs">
									{Object.entries(character.stats).map(([stat, value]) => (
										<div key={stat} className="flex justify-between items-center">
											<span className="terminal-text text-red-300 uppercase">{stat}:</span>
											<div className="flex items-center gap-1">
												<input
													type="range"
													min="3"
													max="18"
													value={value}
													onChange={(e) => handleInputChange('stats', { stat, value: parseInt(e.target.value) })}
													className="w-12 h-1 bg-black border border-red-500/40 appearance-none"
												/>
												<span className="text-red-100 font-mono w-4 text-center text-xs">{value}</span>
											</div>
										</div>
									))}
								</div>
								<div className="mt-2 pt-2 border-t border-red-500/20">
									<div className="flex justify-between text-xs">
										<span className="terminal-text text-red-300">POWER:</span>
										<span className="text-red-100 font-mono">
											{Math.floor(Object.values(character.stats).reduce((a, b) => a + b, 0) / 6)}
										</span>
									</div>
								</div>
							</div>

							{/* Column 5 - Preview & Actions */}
							<div className="bg-black/60 border border-gray-500/30 p-3">
								<div className="terminal-text text-xs mb-2 text-gray-400">[PREVIEW]</div>
								<div className="text-xs font-mono text-gray-300 space-y-1 mb-3">
									<div className="text-red-200">{character.name || "UNNAMED_SOUL"}</div>
									<div>{character.race.toUpperCase()}</div>
									<div>{character.class.toUpperCase()}</div>
									<div className="text-yellow-300">{character.culture.toUpperCase()}</div>
									<div className="text-green-300">{character.fraction.toUpperCase()}</div>
									<div className="mt-2 pt-2 border-t border-gray-500/20">
										<div className="text-purple-300">
											{character.traits.filter(t => t.trim()).length}/2 TRAITS
										</div>
										<div className="text-blue-300">
											{character.items.filter(i => i.trim()).length}/2 ITEMS
										</div>
									</div>
								</div>
								<div className="space-y-2">
									<button
										onClick={shuffleCharacter}
										className="w-full px-2 py-1 border border-yellow-500 text-yellow-100 bg-yellow-500/20 font-mono text-xs uppercase tracking-wider transition-all hover:bg-yellow-500/30 vhs-text"
									>
										🎲 RANDOMIZE
									</button>
									<button
										onClick={generateImage}
										className="w-full px-2 py-1 border border-purple-500 text-purple-100 bg-purple-500/20 font-mono text-xs uppercase tracking-wider transition-all hover:bg-purple-500/30 vhs-text"
									>
										👁️ MANIFEST
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Characters