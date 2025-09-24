'use client'

import React, { useState, useMemo } from 'react'
import { API_BASE_URL } from '../config'
import { Noise } from 'noisejs'
import { generateMapDescription, generateASCIIMap } from '../utils/mapAnalysis'
import GeneratingText from '../components/GeneratingText'

function Map() {
	const [mapConfig, setMapConfig] = useState({
		size: 64, // числовой размер карты (medium)
		genre: "dark fantasy",
		style: "dungeon",
		seed: Math.floor(Math.random() * 999999),
		terrainType: "archipelago"
	})

	const [isGenerating, setIsGenerating] = useState(false)
	const [generatedMap, setGeneratedMap] = useState(null)
	const [isGeneratingImage, setIsGeneratingImage] = useState(false)
	const [generatedImage, setGeneratedImage] = useState(null)
	const [imageError, setImageError] = useState(null)

	const handleConfigChange = (field, value) => {
		setMapConfig(prev => ({ ...prev, [field]: value }))
		// Clear generated map when config changes
		if (generatedMap) {
			setGeneratedMap(null)
		}
	}

	// Create noise instance with seed
	const createNoiseInstance = (seed) => {
		return new Noise(seed)
	}

	const generateMapPNG = () => {
		if (!generatedMap) {
			console.error('No generated map available');
			return null;
		}

		try {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			
			// Увеличиваем размер для лучшего качества
			const scale = 16; // Увеличиваем для лучшего качества
			const mapWidth = generatedMap[0].length;
			const mapHeight = generatedMap.length;
			
			canvas.width = mapWidth * scale;
			canvas.height = mapHeight * scale;

			// Рендерим карту
			for (let y = 0; y < mapHeight; y++) {
				for (let x = 0; x < mapWidth; x++) {
					const cell = generatedMap[y][x];
					let color = '#1e3a8a'; // water - синий
					
				switch (cell.type) {
					case 'coast': color = '#fbbf24'; break; // coast - желтый
					case 'land': color = '#16a34a'; break; // land - зеленый
					case 'mountain': color = '#6b7280'; break; // mountain - серый
					case 'peak': color = '#f3f4f6'; break; // peak - белый
					case 'special': color = '#a855f7'; break; // special - фиолетовый
				}
					
					ctx.fillStyle = color;
					ctx.fillRect(x * scale, y * scale, scale, scale);
				}
			}

			const dataURL = canvas.toDataURL('image/png');
			console.log('PNG generated successfully, size:', dataURL.length);
			return dataURL;
		} catch (error) {
			console.error('Error generating PNG:', error);
			return null;
		}
	}

	const generateMapImage = async () => {
		if (!generatedMap) {
			setImageError('Please generate a map first');
			return;
		}

		setIsGeneratingImage(true);
		setImageError(null);
		setGeneratedImage(null);

		try {
			const mapDescription = generateMapDescription(generatedMap, mapConfig);
			const mapPNG = generateMapPNG();

			console.log('Generating image with description:', mapDescription);
			console.log('Map PNG generated:', mapPNG ? 'Yes' : 'No');

			if (!mapPNG) {
				throw new Error('Failed to generate PNG from map');
			}

			const response = await fetch(`${API_BASE_URL}/api/generate-map-image`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					mapDescription,
					style: mapConfig.style,
					genre: mapConfig.genre,
					terrainType: mapConfig.terrainType,
					mapPNG // Возвращаем PNG для img2img
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			
			if (result.success) {
				setGeneratedImage(result.imageUrl);
				console.log('Image generated successfully:', result.imageUrl);
			} else {
				throw new Error(result.error || 'Failed to generate image');
			}

		} catch (error) {
			console.error('Error generating map image:', error);
			setImageError(error.message);
		} finally {
			setIsGeneratingImage(false);
		}
	}

	const generateNoiseMap = () => {
		console.log('Starting map generation...')
		setIsGenerating(true)
		setGeneratedMap(null) // Clear previous map
		
		try {
			// Create noise instance with seed
			const noiseInstance = createNoiseInstance(mapConfig.seed)
			
			// Map size configuration - числовой размер с ограничениями
			const minSize = 48  // medium
			const maxSize = 96  // large_minus
			const mapSize = Math.max(minSize, Math.min(maxSize, mapConfig.size))
			
			// Автоматически вычисляем scale на основе размера
			const scale = Math.max(0.12, 0.08 - (mapSize - 64) * 0.0005)
			
			const config = {
				width: mapSize,
				height: mapSize,
				scale: scale
			}
			const map = []
			
			console.log(`Generating ${mapConfig.terrainType} map: ${config.width}x${config.height} with seed: ${mapConfig.seed}`)
			
			// Generate noise based on terrain type
			for (let y = 0; y < config.height; y++) {
				const row = []
				for (let x = 0; x < config.width; x++) {
					let noiseValue = 0
					
					// Different noise patterns for different terrain types
					switch (mapConfig.terrainType) {
						case "archipelago":
							// Multiple small islands with layered Perlin noise
							noiseValue = noiseInstance.perlin2(x * config.scale, y * config.scale) * 0.5 + 
										noiseInstance.perlin2(x * config.scale * 2, y * config.scale * 2) * 0.3 +
										noiseInstance.perlin2(x * config.scale * 4, y * config.scale * 4) * 0.2
							break
						case "continent":
							// Single large landmass with smooth Perlin noise
							noiseValue = noiseInstance.perlin2(x * config.scale * 0.3, y * config.scale * 0.3) * 0.8 +
										noiseInstance.perlin2(x * config.scale, y * config.scale) * 0.2
							break
						case "2 continents":
							// Two separate landmasses using distance-based noise
							const center1X = config.width * 0.3
							const center1Y = config.height * 0.3
							const center2X = config.width * 0.7
							const center2Y = config.height * 0.7
							
							const dist1 = Math.sqrt((x - center1X) ** 2 + (y - center1Y) ** 2)
							const dist2 = Math.sqrt((x - center2X) ** 2 + (y - center2Y) ** 2)
							
							const continent1 = noiseInstance.perlin2(x * config.scale * 0.4, y * config.scale * 0.4) - (dist1 / config.width) * 0.5
							const continent2 = noiseInstance.perlin2(x * config.scale * 0.4, y * config.scale * 0.4) - (dist2 / config.width) * 0.5
							
							noiseValue = Math.max(continent1, continent2) * 0.7 + 
										noiseInstance.perlin2(x * config.scale, y * config.scale) * 0.3
							break
					}
					
					// Normalize and classify terrain with better thresholds
					let terrainType = 'water'
					if (noiseValue > 0.05) terrainType = 'coast'
					if (noiseValue > 0.2) terrainType = 'land'
					if (noiseValue > 0.4) terrainType = 'mountain'
					if (noiseValue > 0.6) terrainType = 'peak'
					
					// Add special terrain for very high values
					if (noiseValue > 0.8) terrainType = 'special'
					
					row.push({
						value: noiseValue,
						type: terrainType,
						x, y
					})
				}
				map.push(row)
			}
			
			console.log('Map generated successfully:', map.length, 'rows')
			console.log('First few cells:', map[0]?.slice(0, 3))
			
			// Set the generated map
			setGeneratedMap(map)
			setIsGenerating(false)
			console.log('Map state updated')
			
		} catch (error) {
			console.error('Error generating map:', error)
			setIsGenerating(false)
		}
	}

	const randomizeMap = () => {
		const styles = ["dungeon", "overworld", "city", "wilderness", "underground", "planar"]
		const terrainTypes = ["archipelago", "continent", "2 continents"]
		
		// Случайный размер между 48 и 96
		const randomSize = Math.floor(Math.random() * (96 - 48 + 1)) + 48
		
		setMapConfig(prev => ({
			...prev,
			size: randomSize,
			style: styles[Math.floor(Math.random() * styles.length)],
			terrainType: terrainTypes[Math.floor(Math.random() * terrainTypes.length)],
			seed: Math.floor(Math.random() * 999999)
		}))
	}

	const downloadMap = () => {
		if (!generatedMap) {
			alert("Generate a map first!")
			return
		}

		try {
			// Создаем PNG из карты
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')
			
			const scale = 16
			const mapWidth = generatedMap[0].length
			const mapHeight = generatedMap.length
			
			canvas.width = mapWidth * scale
			canvas.height = mapHeight * scale

			// Рендерим карту
			for (let y = 0; y < mapHeight; y++) {
				for (let x = 0; x < mapWidth; x++) {
					const cell = generatedMap[y][x]
					let color = '#1e3a8a' // water
					
					switch (cell.type) {
						case 'coast': color = '#fbbf24'; break
						case 'land': color = '#16a34a'; break
						case 'mountain': color = '#6b7280'; break
						case 'peak': color = '#f3f4f6'; break
						case 'special': color = '#a855f7'; break
					}
					
					ctx.fillStyle = color
					ctx.fillRect(x * scale, y * scale, scale, scale)
				}
			}

			// Создаем ссылку для скачивания
			const link = document.createElement('a')
			link.download = `${mapConfig.terrainType}_${mapConfig.size}_seed_${mapConfig.seed}.png`
			link.href = canvas.toDataURL('image/png')
			link.click()

			console.log(`Downloaded: ${mapConfig.terrainType}_${mapConfig.size}_seed_${mapConfig.seed}.png`)
		} catch (error) {
			console.error('Error downloading map:', error)
			alert('Error downloading map. Please try again.')
		}
	}

	return (
		<section id="map" className="h-screen w-screen text-white flex items-center justify-center px-4 relative overflow-hidden">
			{/* Enhanced background effects */}
			<div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40" />
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_75%,rgba(168,85,247,0.08),transparent_50%)]" />
			<div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(16,185,129,0.05)_60deg,transparent_120deg,rgba(168,85,247,0.05)_180deg,transparent_240deg)] animate-spin" style={{animationDuration: '20s'}} />
			<div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(16,185,129,0.02)_25%,transparent_50%,rgba(168,85,247,0.02)_75%,transparent_100%)] animate-pulse" style={{animationDuration: '6s'}} />
			
			{/* Floating map markers */}
			<div className="absolute inset-0">
				{[...Array(18)].map((_, i) => (
					<div
						key={i}
						className="absolute w-1 h-1 bg-yellow-400/40 rounded-full animate-pulse"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 7}s`,
							animationDuration: `${3 + Math.random() * 3}s`
						}}
					/>
				))}
			</div>
			
			<div className="max-w-6xl w-full relative z-10">
				{/* Unified Interface Panel */}
				<div className="bg-black/90 border border-green-500/40 shadow-lg shadow-green-500/10 relative rounded backdrop-blur-sm">
					{/* Glow effect */}
					<div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5 rounded pointer-events-none" />
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
								<div className="mb-2">
									<div className="terminal-text text-xs text-green-400 mb-1">SIZE (48-96)</div>
									<input
										type="number"
										min="48"
										max="96"
										value={mapConfig.size}
										onChange={(e) => handleConfigChange('size', parseInt(e.target.value) || 64)}
										className="w-full px-2 py-1 bg-black/60 border border-green-500/30 text-green-300 font-mono text-xs focus:border-green-400 focus:outline-none"
										placeholder="64"
									/>
									<div className="text-xs text-green-500/60 mt-1">
										Current: {mapConfig.size}x{mapConfig.size}
									</div>
								</div>
								<div className="terminal-text text-xs text-green-400 mb-1">TERRAIN TYPE</div>
								<div className="grid grid-cols-1 gap-1 mb-2">
									{['archipelago', 'continent', '2 continents'].map(terrain => (
										<button
											key={terrain}
											onClick={() => handleConfigChange('terrainType', terrain)}
											className={`px-2 py-1 border font-mono text-xs transition-all uppercase ${
												mapConfig.terrainType === terrain
													? 'bg-green-500/30 border-green-400 text-green-100'
													: 'bg-black/60 border-green-500/30 text-green-300 hover:border-green-400'
											}`}
										>
											{terrain}
										</button>
									))}
								</div>
								<div className="relative mb-2">
									<select
										value={mapConfig.genre}
										onChange={(e) => handleConfigChange('genre', e.target.value)}
										className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-mono text-xs focus:border-gold-500 focus:outline-none rounded appearance-none cursor-pointer hover:border-green-400 transition-all"
										style={{
											backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
											backgroundPosition: 'right 8px center',
											backgroundRepeat: 'no-repeat',
											backgroundSize: '16px'
										}}
									>
										<option value="dark fantasy" className="bg-black text-green-200">Dark Fantasy</option>
										<option value="horror" className="bg-black text-green-200">Horror</option>
										<option value="gothic" className="bg-black text-green-200">Gothic</option>
										<option value="lovecraftian" className="bg-black text-green-200">Lovecraftian</option>
										<option value="cyberpunk" className="bg-black text-green-200">Cyberpunk</option>
									</select>
								</div>
								<div className="relative">
									<select
										value={mapConfig.style}
										onChange={(e) => handleConfigChange('style', e.target.value)}
										className="w-full bg-black/80 border border-green-500/40 text-green-200 px-3 py-2 font-mono text-xs focus:border-gold-500 focus:outline-none rounded appearance-none cursor-pointer hover:border-green-400 transition-all"
										style={{
											backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
											backgroundPosition: 'right 8px center',
											backgroundRepeat: 'no-repeat',
											backgroundSize: '16px'
										}}
									>
										<option value="dungeon" className="bg-black text-green-200">Dungeon</option>
										<option value="overworld" className="bg-black text-green-200">Overworld</option>
										<option value="city" className="bg-black text-green-200">City</option>
										<option value="wilderness" className="bg-black text-green-200">Wilderness</option>
										<option value="underground" className="bg-black text-green-200">Underground</option>
										<option value="planar" className="bg-black text-green-200">Planar</option>
									</select>
								</div>
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
										RANDOM
									</button>
								</div>
								<div className="terminal-text text-xs text-green-400 mb-1 mt-3">TERRAIN LEGEND</div>
								<div className="grid grid-cols-2 gap-1 text-xs font-mono">
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-blue-900 border border-blue-500"></div>
										<span className="text-blue-300">Water</span>
									</div>
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-yellow-600 border border-yellow-500"></div>
										<span className="text-yellow-300">Coast</span>
									</div>
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-green-700 border border-green-500"></div>
										<span className="text-green-300">Land</span>
									</div>
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-gray-600 border border-gray-500"></div>
										<span className="text-gray-300">Mountain</span>
									</div>
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-gray-400 border border-gray-300"></div>
										<span className="text-gray-200">Peak</span>
									</div>
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-purple-600 border border-purple-500"></div>
										<span className="text-purple-300">Special</span>
									</div>
								</div>
							</div>

							{/* Preview */}
							<div className="space-y-3">
								<div className="terminal-text text-xs text-green-400 mb-2">PREVIEW</div>
								<div className="aspect-square bg-black/60 border border-green-500/20 p-1 relative overflow-hidden rounded">
									{/* Generated noise map preview */}
									{generatedMap && !isGenerating ? (
										<div 
											className="absolute inset-0 overflow-auto p-2 map-preview-scroll"
											style={{
												scrollbarWidth: 'thin',
												scrollbarColor: '#10b981 #1f2937'
											}}
										>
											<div className="grid gap-0 mx-auto" style={{
												gridTemplateColumns: `repeat(${generatedMap[0].length}, 1fr)`,
												width: 'fit-content',
												height: 'fit-content'
											}}>
												{generatedMap.flat().map((cell, index) => {
													let bgColor = 'bg-blue-900' // water
													if (cell.type === 'coast') bgColor = 'bg-yellow-600'
													else if (cell.type === 'land') bgColor = 'bg-green-700'
													else if (cell.type === 'mountain') bgColor = 'bg-gray-600'
													else if (cell.type === 'peak') bgColor = 'bg-gray-400'
													else if (cell.type === 'special') bgColor = 'bg-purple-600'
													
													return (
														<div 
															key={index}
															className={`w-2 h-2 ${bgColor} border border-green-500/10`}
															title={`${cell.type}: ${cell.value.toFixed(2)}`}
														/>
													)
												})}
											</div>
										</div>
									) : (
										<div className="absolute inset-0 flex items-center justify-center">
											<div className="text-center">
												{isGenerating ? (
													<>
														<div className="terminal-text text-green-400 text-xs mb-1">GENERATING...</div>
														<div className="terminal-text text-green-300 text-xs uppercase">
															{mapConfig.terrainType}
														</div>
													</>
												) : (
													<>
														<div className="terminal-text text-green-400 text-xs mb-1">READY</div>
														<div className="terminal-text text-green-300 text-xs uppercase">
															{mapConfig.size}
														</div>
													</>
												)}
											</div>
										</div>
									)}
								</div>
							</div>

							{/* Stats & Actions */}
							<div className="space-y-3 col-span-1">
								<div className="terminal-text text-xs text-green-400 mb-2">STATUS</div>
								
								{/* Chronicles & Legends Info */}
								<div className="bg-black/40 p-3 border border-green-500/20 rounded mb-3">
									<div className="text-xs font-mono text-green-300 space-y-2">
										<div className="text-green-400 font-bold">CHRONICLES & LEGENDS</div>
										<div className="text-xs text-gray-300">
											Use generated maps as inspiration for:
										</div>
										<div className="text-xs text-gray-300 space-y-1">
											• <span className="text-yellow-300">Chronicles</span> - Historical events and timelines
										</div>
										<div className="text-xs text-gray-300 space-y-1">
											• <span className="text-purple-300">Legends</span> - Myths and folklore of the land
										</div>
										<div className="text-xs text-gray-300 space-y-1">
											• <span className="text-blue-300">Adventures</span> - Quest locations and dungeons
										</div>
										<div className="text-xs text-gray-300 space-y-1">
											• <span className="text-red-300">Campaigns</span> - Long-term story arcs
										</div>
									</div>
								</div>
								<div className="bg-black/40 p-3 border border-green-500/20 rounded mb-3">
									<div className="text-xs font-mono text-green-300 space-y-1">
										<div className="flex justify-between">
											<span>Size:</span>
											<span className="text-gold-light uppercase">{mapConfig.size}</span>
										</div>
										<div className="flex justify-between">
											<span>Terrain:</span>
											<span className="text-gold-light uppercase">{mapConfig.terrainType}</span>
										</div>
										<div className="flex justify-between">
											<span>Seed:</span>
											<span className="text-gold-light">{mapConfig.seed}</span>
										</div>
										<div className="flex justify-between">
											<span>Status:</span>
											<span className={`${generatedMap ? 'text-green-400' : 'text-yellow-400'}`}>
												{generatedMap ? 'GENERATED' : 'READY'}
											</span>
										</div>
									</div>
								</div>

								{/* Generated Image Display */}
								{(generatedImage || imageError) && (
									<div className="space-y-3">
										<div className="terminal-text text-xs text-green-400 mb-2">GENERATED IMAGE</div>
										<div className="bg-black/40 p-3 border border-green-500/20 rounded max-h-[50vh] flex flex-col">
											{generatedImage ? (
												<div className="space-y-2 flex flex-col flex-1">
													<div className="overflow-y-auto flex-1">
														<img 
															src={generatedImage} 
															alt="Generated Map" 
															className="w-full h-auto rounded border border-green-500/20"
															style={{ maxHeight: '300px' }}
														/>
													</div>
													<div className="flex justify-between items-center mt-2 flex-shrink-0">
														<div className="text-xs text-green-300">
															AI Generated Map
														</div>
														<div className="flex gap-2">
															<button
																onClick={() => {
																	const link = document.createElement('a')
																	link.download = `ai_${mapConfig.terrainType}_${mapConfig.size}_${mapConfig.genre}.png`
																	link.href = generatedImage
																	link.click()
																}}
																className="px-2 py-1 bg-green-500/20 border border-green-500/40 text-green-300 text-xs font-mono hover:bg-green-500/30 transition-all rounded"
															>
																Download
															</button>
														</div>
													</div>
												</div>
											) : imageError ? (
												<div className="text-red-400 text-xs font-mono">
													❌ Error: {imageError}
												</div>
											) : null}
										</div>
									</div>
								)}

								<button
									onClick={generateNoiseMap}
									disabled={isGenerating}
									className={`w-full px-3 py-2 border font-mono text-xs uppercase tracking-wider transition-all duration-300 rounded mb-2 transform hover:scale-105 ${
										isGenerating
											? 'border-gray-500 text-gray-400 bg-gray-500/20 cursor-not-allowed animate-pulse'
											: 'border-blue-500 text-blue-100 bg-blue-500/20 hover:bg-blue-500/30 hover:border-gold-500 hover:text-gold-200 hover:shadow-lg hover:shadow-blue-500/20'
									}`}
								>
									{isGenerating ? (
										<GeneratingText text="GENERATING" />
									) : 'GENERATE MAP'}
								</button>
								<button
									onClick={generateMapImage}
									disabled={!generatedMap || isGeneratingImage}
									className={`w-full px-3 py-2 border font-mono text-xs uppercase tracking-wider transition-all rounded mb-2 ${
										!generatedMap || isGeneratingImage
											? 'border-gray-500 text-gray-400 bg-gray-500/20 cursor-not-allowed'
											: 'border-purple-500 text-purple-100 bg-purple-500/20 hover:bg-purple-500/30 hover:border-gold-500 hover:text-gold-200'
									}`}
								>
									{isGeneratingImage ? (
										<GeneratingText text="GENERATING IMAGE" />
									) : generatedImage ? 'GENERATE NEW IMAGE' : 'GENERATE IMAGE'}
								</button>
								<button
									onClick={randomizeMap}
									className="w-full px-3 py-2 border border-yellow-500 text-yellow-100 bg-yellow-500/20 font-mono text-xs uppercase tracking-wider transition-all hover:bg-yellow-500/30 hover:border-gold-500 hover:text-gold-200 rounded mb-2"
								>
									RANDOMIZE
								</button>
								{(generatedMap || generatedImage) && (
									<button
										onClick={() => {
											setGeneratedMap(null);
											setGeneratedImage(null);
											setImageError(null);
										}}
										className="w-full px-3 py-2 border border-red-500 text-red-100 bg-red-500/20 font-mono text-xs uppercase tracking-wider transition-all hover:bg-red-500/30 hover:border-gold-500 hover:text-gold-200 rounded mb-2"
									>
										CLEAR ALL
									</button>
								)}
								<button
									onClick={downloadMap}
									disabled={!generatedMap}
									className={`w-full px-3 py-2 border font-mono text-xs uppercase tracking-wider transition-all rounded ${
										!generatedMap
											? 'border-gray-500 text-gray-400 bg-gray-500/20 cursor-not-allowed'
											: 'border-green-500 text-green-100 bg-green-500/20 hover:bg-green-500/30 hover:border-gold-500 hover:text-gold-200'
									}`}
								>
									DOWNLOAD
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
