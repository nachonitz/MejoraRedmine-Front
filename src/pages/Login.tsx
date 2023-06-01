import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../api/services/authService';

const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = async () => {
		try {
			const response = await login(username, password);
			console.log(response.data);
		} catch (error: any) {
			console.log(error.message);
		}
	};

	return(
		<div className='flex justify-center w-full m-page-vertical'>
			<div className='w-[420px] shadow-login py-[36px] px-[50px] box-border'>
				<div className='flex flex-col items-center gap-[60px]'>
					<div>
						<p className='text-primary text-3xl text-center'>REDMINE</p>
					</div>
					<div className='flex flex-col w-full gap-[22px]'>
						<div>
							<input onChange={(e) => setUsername(e.target.value)} id="email" name="email" type="email" autoComplete="email" placeholder="Enter your email" required className="w-full p-3 border border-gray-300 rounded"></input>
						</div>
						<div>
							<input onChange={(e) => setPassword(e.target.value)} id="password" name="password" type="password" placeholder="Enter your password" required className="w-full p-3 border border-gray-300 rounded"></input>
						</div>
						<div>
							<button onClick={() => handleLogin()} className="w-full font-bold bg-primary text-white p-3 border border-gray-300 rounded active:bg-blue-900">Login</button>
						</div>
						<div className='flex flex-row justify-center items-center gap-3'>
							<div className='flex items-center'>
								<Link to="/login" className="w-full text-sm text-primary hover:underline">Forgot your password?</Link>
							</div>
							<div className="w-[3px] h-[3px] bg-[#444] rounded-[100%]"></div>
							<div className='flex items-center'>
								<Link to="/login" className="w-full text-sm text-primary hover:underline">Create an account</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;