import React from 'react'
import './App.css'
import NavBar from './components/NavBar.jsx'
import HeroParallax from './components/HeroParallax.jsx'
import Information from './sections/Information.jsx'
import Story from './sections/Story.jsx'
import Characters from './sections/Characters.jsx'
import Map from './sections/Map.jsx'

function App() {
	return (
		<main className="bg-black text-white w-screen overflow-x-hidden">
			<NavBar />
			<HeroParallax />
			<Information />
			<Story />
			<Characters />
			<Map />
		</main>
	)
}

export default App
