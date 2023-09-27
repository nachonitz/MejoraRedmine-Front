import { useContext, useEffect, useRef, useState } from "react";
import { IoApps } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import { menu } from "./menu";
import { hasAdminAccess } from "../../../lib/utils";

const Header = () => {
    const navigate = useNavigate();
    const { user, isLoggedIn, logout } = useContext(UserContext);
    const [profileMenuOpened, setProfileMenuOpened] = useState(false);
    const [appsMenuOpened, setAppsMenuOpened] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const appsDropdownRef = useRef<HTMLDivElement>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOutsideClick = (event: any) => {
        if (
            profileDropdownRef.current &&
            !profileDropdownRef.current.contains(event.target)
        ) {
            setProfileMenuOpened(false);
        }
        if (
            appsDropdownRef.current &&
            !appsDropdownRef.current.contains(event.target)
        ) {
            setAppsMenuOpened(false);
        }
    };

    const goToProfile = () => {
        setProfileMenuOpened(false);
        setAppsMenuOpened(false);
        navigate("/profile");
    };

    const handleLogout = () => {
        setProfileMenuOpened(false);
        logout();
    };

    const toggleProfileMenu = () => {
        setProfileMenuOpened(!profileMenuOpened);
    };

    const toggleAppsMenu = () => {
        setAppsMenuOpened(!appsMenuOpened);
    };

    useEffect(() => {
        document.addEventListener("click", handleOutsideClick, true);
        return () => {
            document.removeEventListener("click", handleOutsideClick, true);
        };
    }, []);

    return (
        <div
            className="h-header top-0 fixed w-full bg-primary flex 
        flex-row p-page box-border z-50"
        >
            <div className="flex items-center justify-between w-full h-full">
                <div className="flex items-center flex-row gap-24 h-full">
                    <Link className="flex items-center h-full" to="/">
                        <button
                            className="text-white text-2xl hover:bg-white/10 
                        font-bold h-full px-4 -translate-x-4"
                        >
                            Redmine
                        </button>
                    </Link>
                    {isLoggedIn && (
                        <div className="flex flex-row h-full text-white items-center">
                            {menu.map((item) =>
                                item.requiresAdmin ? (
                                    hasAdminAccess() && (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            className="h-full"
                                        >
                                            <button className="hover:bg-white/10 h-full px-4">
                                                {item.name}
                                            </button>
                                        </Link>
                                    )
                                ) : (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className="h-full"
                                    >
                                        <button className="hover:bg-white/10 h-full px-4">
                                            {item.name}
                                        </button>
                                    </Link>
                                )
                            )}
                        </div>
                    )}
                </div>
                <div>
                    <div className="flex gap-5 text-white items-center">
                        {!isLoggedIn && <Link to="/login">Login</Link>}
                        {isLoggedIn && (
                            <>
                                <div ref={appsDropdownRef} className="relative">
                                    <button
                                        className="flex justify-center items-center rounded-[50%] h-[35px] w-[35px] hover:bg-[#005eb6] cursor-pointer text-[20px] text-white"
                                        onClick={() => toggleAppsMenu()}
                                    >
                                        <IoApps />
                                    </button>
                                    {appsMenuOpened && (
                                        <div className="flex flex-col absolute top-[110%] right-[0] bg-white shadow-card text-[#444] py-[8px] w-[200px] h-[150px] rounded-[10px] items-center text-[18px]">
                                            <span>Applications</span>
                                        </div>
                                    )}
                                </div>
                                <div
                                    ref={profileDropdownRef}
                                    className="relative"
                                >
                                    <button
                                        className="flex justify-center items-center rounded-[50%] h-[35px] w-[35px] bg-[#d9d9d9] cursor-pointer text-[16px] text-primary"
                                        onClick={() => toggleProfileMenu()}
                                    >
                                        <span>
                                            {user?.firstname[0]}
                                            {user?.lastname[0]}
                                        </span>
                                    </button>

                                    {profileMenuOpened && (
                                        <div className="flex flex-col absolute top-[110%] right-0 bg-white shadow-card text-[#444] py-[8px] w-[200px] rounded-[10px] items-center text-[18px]">
                                            <a
                                                className="w-full text-left hover:bg-[#efefef] px-[20px] py-[5px]"
                                                href=""
                                                onClick={() => goToProfile()}
                                            >
                                                Profile
                                            </a>
                                            <a
                                                className="w-full text-left hover:bg-[#efefef] px-[20px] py-[5px]"
                                                href=""
                                                onClick={() => handleLogout()}
                                            >
                                                Logout
                                            </a>
                                        </div>
                                    )}
                                </div>
                                {/* <a href='#' className="cursor-pointer" onClick={()=> handleLogout()}>Logout</a> */}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
