export const metadata = {
	title: 'DND Ai',
	description: 'Dark fantasy UI'
}

import './globals.css'

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="font-sans">{children}</body>
		</html>
	)
}


