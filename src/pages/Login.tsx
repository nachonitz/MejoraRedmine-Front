import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { TextField } from '@mui/material';
import PrimaryButton from '../components/Shared/Buttons/PrimaryButton';

const Login = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [wrongCredentials, setWrongCredentials] = useState(false);
	const { login } = useContext(UserContext);

	const handleLogin = async () => {
		if (!username || !password) return;
		try {
			const response = await login(username, password);
			if (response) {
				navigate('/projects');
			} else {
				setPassword('')
				setWrongCredentials(true);
			}
		} catch (error: any) {
			setPassword('')
			setWrongCredentials(true);
		}
	};

	const handleKeyPress = (e:any) => {
		if (e.key === 'Enter') {
			handleLogin();
		}
	};

	return(
		<div className='flex justify-center w-full m-page-vertical'>
			<div className='w-[420px] shadow-login py-[36px] px-[50px] box-border'>
				<div className='flex flex-col items-center gap-[60px]'>
					<div>
						<p className='text-primary text-3xl text-center'>REDMINE</p>
					</div>
					<div onKeyPress={handleKeyPress} className='flex flex-col w-full gap-[22px]'>
						<div>
							<TextField className="w-full"  onChange={(e) => setUsername(e.target.value)} value={username} label="User" type="text"></TextField>
						</div>
						<div>
							<TextField className="w-full" onChange={(e) => setPassword(e.target.value)} value={password} label="Password" type="password"></TextField>
						</div>
						<div>
							<PrimaryButton width="100%" onClick={() => handleLogin()}>Login</PrimaryButton>
							<div className='mt-2 h-[10px] text-left'>
								<p className='text-red-700'> {wrongCredentials && 'Invalid user or password' }</p>
							</div>
						</div>
						<div className='flex flex-row justify-center items-center gap-3'>
							<div className='flex items-center'>
								<Link to="/login" className="w-full text-sm text-primary hover:underline">Forgot your password?</Link>
							</div>
							<div className="w-[3px] h-[3px] bg-[#444] rounded-[100%]"></div>
							<div className='flex items-center'>
								<Link to="/register" className="w-full text-sm text-primary hover:underline">Create an account</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;