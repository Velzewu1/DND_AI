import React from 'react'

function Information() {
	return (
		<section id="information" className="relative min-h-[100vh] w-full flex items-center justify-center bg-neutral-950 text-white px-6">
			<div className="max-w-2xl text-center space-y-4">
				<h2 className="text-3xl sm:text-4xl font-bold tracking-tight">About DND Ai</h2>
				<p className="text-white/80 leading-relaxed">
					DND Ai — экспериментальный проект помощника для мастеров и игроков. Здесь будет краткая
					информация о возможностях, целях и текущем статусе разработки. Прокрутите, чтобы продолжить.
				</p>
			</div>
		</section>
	)
}

export default Information


