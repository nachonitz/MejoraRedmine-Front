import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UserProvider } from './context/UserProvider'
import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
<React.StrictMode>
	<Router>
		<UserProvider>
			<App />
		</UserProvider>
	</Router>
</React.StrictMode>,
)