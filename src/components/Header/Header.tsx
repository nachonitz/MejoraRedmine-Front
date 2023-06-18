import {  useContext } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useContext( UserContext );

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="h-header top-0 fixed w-full bg-primary flex flex-row p-page box-border">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center flex-row gap-24">
                    <div>
                        <Link className="text-white text-2xl font-bold" to="/">Redmine</Link>
                    </div>
                    {   
                        isLoggedIn && 
                        <div className="flex flex-row gap-5 text-white">
                            <Link to="/projects">Projects</Link>
                            <p>Admin</p>
                        </div>
                    }
                </div>
                <div>
                    <div className="flex gap-5 text-white">
                        {
                            !isLoggedIn && 
                            <Link to="/login">Login</Link>
                        }
                        {
                            isLoggedIn && 
                            <a href='#' className="cursor-pointer" onClick={()=> handleLogout()}>Logout</a>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;