'use client'

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
	const [imageStyle, setImageStyle] = useState("fantasy_realistic")
	const [imageQuality, setImageQuality] = useState("standard")
	const [imageSize, setImageSize] = useState("1024x1024")
	const [generatedCharacter, setGeneratedCharacter] = useState("")
	const [isGenerating, setIsGenerating] = useState(false)
	const [error, setError] = useState("")
	const [generatedImage, setGeneratedImage] = useState("")
	const [isGeneratingImage, setIsGeneratingImage] = useState(false)
	const [imageError, setImageError] = useState("")

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

	const generateCharacterBackstory = async () => {
		setIsGenerating(true)
		setError("")
		setGeneratedCharacter("")
		
		try {
			const response = await fetch('http://localhost:3001/api/generate-character', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					characterType: 'npc',
					config: {
						setting: `${character.culture} lands`,
						role: `${character.class}`,
						race: character.race,
						name: character.name || 'Unnamed Hero',
						traits: character.traits.filter(t => t.trim()),
						items: character.items.filter(i => i.trim()),
						fraction: character.fraction
					}
				})
			})

			const data = await response.json()
			
			if (data.success) {
				setGeneratedCharacter(data.content)
			} else {
				setError(data.error || 'Failed to generate character')
			}
		} catch (err) {
			console.error('Error generating character:', err)
			setError('Network error. Please try again.')
		} finally {
			setIsGenerating(false)
		}
	}

	const generateImage = async () => {
		setIsGeneratingImage(true)
		setImageError("")
		setGeneratedImage("")
		
		try {
			console.log("Generating character image:", character)
			
			const response = await fetch('http://localhost:3001/api/generate-character-image', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					character: {
						name: character.name,
						race: character.race,
						class: character.class,
						culture: character.culture,
						traits: character.traits,
						items: character.items,
						fraction: character.fraction
					},
					style: imageStyle,
					quality: imageQuality,
					size: imageSize
				})
			})

			const data = await response.json()
			
			if (data.success) {
				setGeneratedImage(data.imageUrl)
				console.log("Generated image URL:", data.imageUrl)
			} else {
				setImageError(data.error || 'Failed to generate image')
			}
		} catch (err) {
			console.error('Error generating image:', err)
			setImageError('Network error. Please try again.')
		} finally {
			setIsGeneratingImage(false)
		}
	}

	return (
		<section id="characters" className="h-screen w-screen text-white flex items-center justify-center px-4 relative">
			{/* Unified overlay */}
			<div className="absolute inset-0 bg-black/30" />
			
			<div className="max-w-6xl w-full relative z-10">
				{/* Unified Interface Panel */}
				<div className="bg-black/90 border border-green-500/40 shadow-lg shadow-green-500/10 relative rounded">
					{/* Header */}
					<div className="bg-green-500/10 border-b border-green-500/30 px-4 py-3 flex items-center justify-center">
						<div className="fantasy-title text-xl text-gold-primary ancient-glow">
							Character Forge
						</div>
					</div>

					{/* Content */}
					<div className="p-6">
						<div className="grid md:grid-cols-5 gap-4">
							{/* Identity */}
							<div className="space-y-3">
								<div className="terminal-text text-xs text-green-400 mb-2">IDENTITY</div>
								<input
									type="text"
									value={character.name}
									onChange={(e) => handleInputChange('name', e.target.value)}
									placeholder="Hero name..."
									className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-serif text-sm focus:border-gold-500 focus:outline-none transition-all rounded mb-2"
								/>
								<select
									value={character.race}
									onChange={(e) => handleInputChange('race', e.target.value)}
									className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-serif text-sm focus:border-gold-500 focus:outline-none rounded mb-2"
								>
									<option value="human">Human</option>
									<option value="elf">Elf</option>
									<option value="dwarf">Dwarf</option>
									<option value="halfling">Halfling</option>
									<option value="orc">Orc</option>
									<option value="tiefling">Tiefling</option>
								</select>
								<select
									value={character.class}
									onChange={(e) => handleInputChange('class', e.target.value)}
									className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-serif text-sm focus:border-gold-500 focus:outline-none rounded"
								>
									<option value="fighter">Fighter</option>
									<option value="wizard">Wizard</option>
									<option value="rogue">Rogue</option>
									<option value="cleric">Cleric</option>
									<option value="ranger">Ranger</option>
									<option value="barbarian">Barbarian</option>
								</select>
							</div>

							{/* Heritage */}
							<div className="space-y-3">
								<div className="terminal-text text-xs text-green-400 mb-2">HERITAGE</div>
								<select
									value={character.culture}
									onChange={(e) => handleInputChange('culture', e.target.value)}
									className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-serif text-sm focus:border-gold-500 focus:outline-none rounded mb-2"
								>
									<option value="northern">Northern</option>
									<option value="eastern">Eastern</option>
									<option value="southern">Southern</option>
									<option value="western">Western</option>
									<option value="nomadic">Nomadic</option>
									<option value="urban">Urban</option>
								</select>
								<select
									value={character.fraction}
									onChange={(e) => handleInputChange('fraction', e.target.value)}
									className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-serif text-sm focus:border-gold-500 focus:outline-none rounded"
								>
									<option value="none">No Allegiance</option>
									<option value="guild">Guild</option>
									<option value="order">Order</option>
									<option value="cult">Cult</option>
									<option value="clan">Clan</option>
									<option value="brotherhood">Brotherhood</option>
								</select>
							</div>

							{/* Traits & Items */}
							<div className="space-y-3">
								<div className="terminal-text text-xs text-green-400 mb-2">TRAITS</div>
								{character.traits.map((trait, index) => (
									<input
										key={index}
										type="text"
										value={trait}
										onChange={(e) => handleInputChange('traits', e.target.value, index)}
										placeholder={`Trait ${index + 1}...`}
										className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-serif text-sm focus:border-gold-500 focus:outline-none transition-all rounded mb-2"
									/>
								))}
								<div className="terminal-text text-xs text-green-400 mb-1 mt-3">ITEMS</div>
								{character.items.map((item, index) => (
									<input
										key={index}
										type="text"
										value={item}
										onChange={(e) => handleInputChange('items', e.target.value, index)}
										placeholder={`Item ${index + 1}...`}
										className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-serif text-sm focus:border-gold-500 focus:outline-none transition-all rounded mb-2"
									/>
								))}
							</div>

							{/* Attributes */}
							<div className="space-y-3">
								<div className="terminal-text text-xs text-green-400 mb-2">ATTRIBUTES</div>
								<div className="space-y-2 bg-black/40 p-3 border border-green-500/20 rounded">
									{Object.entries(character.stats).map(([stat, value]) => (
										<div key={stat} className="flex justify-between items-center">
											<span className="terminal-text text-green-300 uppercase text-xs">{stat}:</span>
											<div className="flex items-center gap-2">
												<input
													type="range"
													min="3"
													max="18"
													value={value}
													onChange={(e) => handleInputChange('stats', { stat, value: parseInt(e.target.value) })}
													className="w-16 h-1 bg-black border border-green-500/40 appearance-none"
												/>
												<span className="text-gold-light font-mono w-6 text-center text-xs">{value}</span>
											</div>
										</div>
									))}
									<div className="mt-2 pt-2 border-t border-green-500/20">
										<div className="flex justify-between text-xs">
											<span className="terminal-text text-green-300">Total:</span>
											<span className="text-gold-light font-mono">
												{Math.floor(Object.values(character.stats).reduce((a, b) => a + b, 0) / 6)}
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Actions */}
							<div className="space-y-3">
								<div className="terminal-text text-xs text-green-400 mb-2">ACTIONS</div>
								
								{/* Art Style Selector */}
								<div className="mb-3">
									<div className="text-xs text-gold-light mb-1">Art Style:</div>
									<select
										value={imageStyle}
										onChange={(e) => setImageStyle(e.target.value)}
										className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-serif text-sm focus:border-gold-500 focus:outline-none rounded"
									>
										<option value="fantasy_realistic">Fantasy Realistic</option>
										<option value="pixel_art">Pixel Art</option>
										<option value="anime">Anime Style</option>
										<option value="oil_painting">Oil Painting</option>
										<option value="sketch">Pencil Sketch</option>
										<option value="dark_gothic">Dark Gothic</option>
										<option value="cyberpunk">Cyberpunk</option>
									</select>
								</div>

								{/* Quality & Size Settings */}
								<div className="grid grid-cols-2 gap-2 mb-3">
									<div>
										<div className="text-xs text-gold-light mb-1">Quality:</div>
										<select
											value={imageQuality}
											onChange={(e) => setImageQuality(e.target.value)}
											className="w-full bg-black/80 border border-green-500/40 text-green-200 px-2 py-1 font-serif text-xs focus:border-gold-500 focus:outline-none rounded"
										>
											<option value="standard">Standard</option>
											<option value="hd">HD (Slower)</option>
										</select>
									</div>
									<div>
										<div className="text-xs text-gold-light mb-1">Size:</div>
										<select
											value={imageSize}
											onChange={(e) => setImageSize(e.target.value)}
											className="w-full bg-black/80 border border-green-500/40 text-green-200 px-2 py-1 font-serif text-xs focus:border-gold-500 focus:outline-none rounded"
										>
											<option value="1024x1024">1024×1024</option>
											<option value="1024x1792">1024×1792</option>
											<option value="1792x1024">1792×1024</option>
										</select>
									</div>
								</div>

								<div className="bg-black/40 p-3 border border-green-500/20 rounded mb-3">
									<div className="text-xs text-gold-light space-y-1">
										<div>{character.name || "Unnamed"}</div>
										<div className="capitalize">{character.race} {character.class}</div>
										<div className="text-green-300 capitalize">{character.culture}</div>
										<div className="text-green-300 capitalize">{character.fraction}</div>
									</div>
								</div>
								<button
									onClick={shuffleCharacter}
									className="w-full px-3 py-2 border border-yellow-500 text-yellow-100 bg-yellow-500/20 font-mono text-xs uppercase tracking-wider transition-all hover:bg-yellow-500/30 hover:border-gold-500 hover:text-gold-200 rounded mb-2"
								>
									🎲 RANDOMIZE
								</button>
								<button
									onClick={generateCharacterBackstory}
									disabled={isGenerating}
									className={`w-full px-3 py-2 border font-mono text-xs uppercase tracking-wider transition-all rounded mb-2 ${
										isGenerating
											? 'border-green-500/50 text-green-400 bg-green-500/10 cursor-not-allowed' 
											: 'border-green-500 text-green-100 bg-green-500/20 hover:bg-green-500/30 hover:border-gold-500 hover:text-gold-200'
									}`}
								>
									{isGenerating ? '🧠 THINKING...' : '🧠 AI BACKSTORY'}
								</button>
								<button
									onClick={generateImage}
									disabled={isGeneratingImage}
									className={`w-full px-3 py-2 border font-mono text-xs uppercase tracking-wider transition-all rounded ${
										isGeneratingImage
											? 'border-purple-500/50 text-purple-400 bg-purple-500/10 cursor-not-allowed' 
											: 'border-purple-500 text-purple-100 bg-purple-500/20 hover:bg-purple-500/30 hover:border-gold-500 hover:text-gold-200'
									}`}
								>
									{isGeneratingImage ? '🎨 CREATING...' : '🎨 IMAGE'}
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Generated Character Display */}
				{(generatedCharacter || error) && (
					<div className="mt-6 bg-black/90 border border-green-500/40 shadow-lg shadow-green-500/10 rounded">
						{/* Header */}
						<div className="bg-green-500/10 border-b border-green-500/30 px-4 py-3 flex items-center justify-between">
							<div className="fantasy-title text-lg text-gold-primary ancient-glow">
								Character Profile
							</div>
							<button
								onClick={() => {
									setGeneratedCharacter("")
									setError("")
								}}
								className="text-green-400 hover:text-red-400 transition-colors text-sm"
							>
								✕ Close
							</button>
						</div>

						{/* Content */}
						<div className="p-6">
							{error ? (
								<div className="text-red-400 font-mono text-sm bg-red-500/10 border border-red-500/30 p-4 rounded">
									<div className="text-red-300 mb-2">ERROR:</div>
									{error}
								</div>
							) : (
								<div className="text-green-200 font-serif leading-relaxed whitespace-pre-wrap">
									{generatedCharacter}
								</div>
							)}
						</div>
					</div>
				)}

				{/* Generated Image Display */}
				{(generatedImage || imageError) && (
					<div className="mt-6 bg-black/90 border border-green-500/40 shadow-lg shadow-green-500/10 rounded">
						{/* Header */}
						<div className="bg-green-500/10 border-b border-green-500/30 px-4 py-3 flex items-center justify-between">
							<div className="fantasy-title text-lg text-gold-primary ancient-glow">
								Character Portrait
							</div>
							<button
								onClick={() => {
									setGeneratedImage("")
									setImageError("")
								}}
								className="text-green-400 hover:text-red-400 transition-colors text-sm"
							>
								✕ Close
							</button>
						</div>

						{/* Content */}
						<div className="p-6">
							{imageError ? (
								<div className="text-red-400 font-mono text-sm bg-red-500/10 border border-red-500/30 p-4 rounded">
									<div className="text-red-300 mb-2">IMAGE ERROR:</div>
									{imageError}
								</div>
							) : (
								<div className="flex flex-col items-center">
									<img 
										src={generatedImage} 
										alt={`${character.name || 'Character'} - ${character.race} ${character.class}`}
										className="max-w-full h-auto rounded-lg border border-green-500/30 shadow-lg shadow-green-500/10"
										style={{ maxHeight: '512px' }}
									/>
									<div className="mt-4 text-center">
										<div className="text-gold-light font-serif text-lg">
											{character.name || 'Unnamed Hero'}
										</div>
										<div className="text-green-300 text-sm capitalize">
											{character.race} {character.class} from the {character.culture} lands
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</section>
	)
}

export default Characters