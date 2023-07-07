import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { TextField } from '@mui/material';
import PrimaryButton from '../components/Shared/Buttons/PrimaryButton';

const Register = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmpassword, setConfirmpassword] = useState('');
	const [email, setEmail] = useState('');
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const [errorText, setErrorText] = useState('');
	const [serverErrors, setServerErrors] = useState<string[]>([]);
	const [errorUsername, setErrorUsername] = useState(false);
	const [errorPassword, setErrorPassword] = useState(false);
	const [errorConfirmpassword, setErrorConfirmpassword] = useState(false);
	const [errorEmail, setErrorEmail] = useState(false);
	const [errorFirstname, setErrorFirstname] = useState(false);
	const [errorLastname, setErrorLastname] = useState(false);
	const { register } = useContext(UserContext);

	const clearErrors = () => {
		setErrorText('');
		setErrorUsername(false);
		setErrorPassword(false);
		setErrorConfirmpassword(false);
		setErrorEmail(false);
		setErrorFirstname(false);
		setErrorLastname(false);
		setServerErrors([]);
	}

	const checkForFieldsErrors = () => {
		let errorFound = false;
		if (password !== confirmpassword) {
			setErrorText('Please make sure your passwords match');
			setErrorPassword(true);
			errorFound = true;
		}
		if (!lastname) {
			setErrorText('Please enter your last name');
			setErrorLastname(true);
			errorFound = true;
		}
		if (!firstname) {
			setErrorText('Please enter your first name');
			setErrorFirstname(true);
			errorFound = true;
		}
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (emailRegex.test(email) === false) {
			setErrorText('Please enter a valid email');
			setErrorEmail(true);
			errorFound = true;
		}
		if (!email) {
			setErrorText('Please enter your email');
			setErrorEmail(true);
			errorFound = true;
		}
		if (!confirmpassword) {
			setErrorText('Please confirm your password');
			setErrorConfirmpassword(true);
			errorFound = true;
		}
		if (!password) {
			setErrorText('Please enter your password');
			setErrorPassword(true);
			errorFound = true;
		}
		if (!username) {
			setErrorText('Please enter your user');
			setErrorUsername(true);
			errorFound = true;
		}
		return errorFound;
	}

	const handleRegister = async () => {
		clearErrors();
		let errorFound = checkForFieldsErrors();
		if (errorFound) {
			return;
		}
		try {
			const response = await register(username, password, email, firstname, lastname);
			if (response) {
				navigate('/login');
			} else {
				setPassword('');
				setConfirmpassword('');
			}
		} catch (error: any) {
			setPassword('');
			setConfirmpassword('');
			if (!error.messages) {
				setErrorText('Error. Please try again.');
			} else {
				setServerErrors(error.messages)
			}
		}
	};

	const handleKeyPress = (e:any) => {
		if (e.key === 'Enter') {
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
					<div onKeyPress={handleKeyPress} className='flex flex-col w-full gap-[22px]'>
						<div>
							<TextField className="w-full"  onChange={(e) => setUsername(e.target.value)} error={errorUsername} value={username} label="User" type="text"></TextField>
						</div>
						<div>
							<TextField className="w-full"  onChange={(e) => setPassword(e.target.value)} error={errorPassword} value={password} label="Password" type="password"></TextField>
						</div>
						<div>
							<TextField className="w-full"  onChange={(e) => setConfirmpassword(e.target.value)} error={errorConfirmpassword} value={confirmpassword} label="Confirm password" type="password"></TextField>
						</div>
						<div>
							<TextField className="w-full"  onChange={(e) => setEmail(e.target.value)} error={errorEmail} value={email} label="Email" type="email"></TextField>
						</div>
						<div>
							<TextField className="w-full"  onChange={(e) => setFirstname(e.target.value)} error={errorFirstname} value={firstname} label="First Name" type="text"></TextField>
						</div>
						<div>
							<TextField className="w-full"  onChange={(e) => setLastname(e.target.value)} error={errorLastname} value={lastname} label="Last Name" type="text"></TextField>
						</div>
						<div>
							<PrimaryButton width="100%" onClick={() => handleRegister()}>Create account</PrimaryButton>
							<div className='mt-2 min-h-[10px] text-left'>
								<p className='text-red-700'> { errorText }</p>
								{serverErrors.map((error, index) => (<div key={index}>
									<p className='text-red-700'> { error }</p>
								</div>))}
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