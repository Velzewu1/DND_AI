'use client'

import React, { useState, useEffect } from 'react'

function GeneratingText({ text = "GENERATING", className = "" }) {
	const [dots, setDots] = useState(0)
	
	useEffect(() => {
		const interval = setInterval(() => {
			setDots(prev => (prev + 1) % 4) // 0, 1, 2, 3 для ., .., ..., ....
		}, 500) // Меняем каждые 500мс
		
		return () => clearInterval(interval)
	}, [])
	
	const dotString = '.'.repeat(dots)
	
	return (
		<div className={`flex items-center justify-center ${className}`}>
			<span>{text}{dotString}</span>
		</div>
	)
}

export default GeneratingText
