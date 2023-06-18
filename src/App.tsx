import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Header from './components/Header/Header';
import Register from './pages/Register';
import { UserContext } from './context/UserContext';
import Projects from './pages/Projects';

function App() {
	const { isLoggedIn } = useContext(UserContext);

	return (
		<>
			<Header />
			<div className="flex flex-column mt-[64px]">
				<Routes>
					{ isLoggedIn ?
						<>
							<Route path="/" element={<Home />} />
							<Route path="/projects" element={<Projects />} />
							<Route path="*" element={<Navigate to="/" />} />
						</>
						:
						<>
							<Route path="/" element={<Navigate to="/login" />} />
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
						</>
					}
				</Routes>
			</div>
		</>
	);
}



export default App
