import { useLocation, Link, useNavigate } from 'react-router-dom';
import { logout } from '../../api/services/authService';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isLoggedIn = () => {
        return (location.pathname !== '/login' && location.pathname !== '/register')
    }

    const handleLogout = () => {
        logout(navigate);
    };

    return (
        <div className="h-16 bg-primary flex flex-row p-page box-border">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center flex-row gap-24">
                    <div>
                        <Link className="text-white text-2xl font-bold" to="/">Redmine</Link>
                    </div>
                    {   
                        isLoggedIn() && 
                        <div className="flex flex-row gap-5 text-white">
                            <p>Projects</p>
                            <p>Admin</p>
                        </div>
                    }
                </div>
                <div>
                    <div className="flex gap-5 text-white">
                        {
                            !isLoggedIn() && 
                            <Link to="/login">Login</Link>
                        }
                        {
                            isLoggedIn() && 
                            <a href='#' className="cursor-pointer" onClick={()=> handleLogout()}>Logout</a>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;