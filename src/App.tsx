import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Header from './components/Header/Header';
import Register from './pages/Register';

interface PrivateRouteProps {
	children: any;
  }

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
	const isAuthenticated = localStorage.getItem('api_key');
		
	if (isAuthenticated ) {
	  return children
	}
	  
	return <Navigate to="/login" />
}

function App() {

	return (
		<Router>
			<Header />
			<Routes>
				<Route
					path="/"
					element={ <PrivateRoute> <Home /> </PrivateRoute> }
				/>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
			</Routes>
		</Router>
	);
}



export default App
