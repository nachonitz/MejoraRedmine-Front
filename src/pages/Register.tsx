import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, register } from '../api/services/authService';
import Input from '../components/Auth/Input';

const Register = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmpassword, setConfirmpassword] = useState('');
	const [email, setEmail] = useState('');
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const [errorText, setErrorText] = useState('');
	const [errorPassword, setErrorPassword] = useState(false);
	const [wrongCredentials, setWrongCredentials] = useState(false);

	const handleRegister = async () => {
		if (password !== confirmpassword) {
			setErrorText('Please make sure your passwords match');
			setErrorPassword(true);
			return;
		}
		try {
			const response = await register(username, password, email, firstname, lastname);
			if (response) {
				navigate('/login');
			} else {
				setPassword('');
				setConfirmpassword('');
				setErrorText('Error. Please try again.');
				setWrongCredentials(true);
			}
		} catch (error: any) {
			setPassword('');
			setConfirmpassword('');
			setErrorText('Error. Please try again.');
			setWrongCredentials(true);
		}
	};

	const handleKeyPress = (e:any) => {
		if (e.key === 'Enter' && username && password && email && firstname && lastname) {
			handleRegister();
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
							<Input onKeyPress={handleKeyPress} onChange={(e) => setUsername(e.target.value)} value={username} name="user" type="text" placeholder="Enter your user"></Input>
						</div>
						<div>
							<Input onKeyPress={handleKeyPress} onChange={(e) => setPassword(e.target.value)} value={password} name="password" type="password" placeholder="Enter your password"></Input>
						</div>
						<div>
							<Input onKeyPress={handleKeyPress} onChange={(e) => setConfirmpassword(e.target.value)} error={errorPassword} value={confirmpassword} name="confirmPassword" type="password" placeholder="Confirm your password"></Input>
						</div>
						<div>
							<Input onKeyPress={handleKeyPress} onChange={(e) => setEmail(e.target.value)} value={email} name="email" type="email" placeholder="Enter your email"></Input>
						</div>
						<div>
							<Input onKeyPress={handleKeyPress} onChange={(e) => setFirstname(e.target.value)} value={firstname} name="firstname" type="text" placeholder="Enter your first name"></Input>
						</div>
						<div>
							<Input onKeyPress={handleKeyPress} onChange={(e) => setLastname(e.target.value)} value={lastname} name="lastname" type="text" placeholder="Enter your last name"></Input>
						</div>
						<div>
							<button onClick={() => handleRegister()} className="w-full font-bold bg-primary text-white p-3 border border-gray-300 rounded active:bg-blue-900">Create account</button>
							<div className='mt-2 h-[10px] text-left'>
								{/* <p className='text-red-700'> {wrongCredentials && 'Please make sure your passwords match' }</p> */}
								<p className='text-red-700'> {errorText }</p>
							</div>
						</div>
						<div className='flex flex-row justify-center items-center gap-3'>
							<div className='flex items-center'>
								<span>Already have an account?</span>
							</div>
							<div className='flex items-center'>
								<Link to="/login" className="w-full text-sm text-primary hover:underline">Sign in</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;