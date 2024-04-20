import { useContext, useEffect, useRef, useState } from "react";
import { IoApps, IoRefreshCircle } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import { menu } from "./menu";
import { hasAdminAccess } from "../../../lib/utils";
import { syncWithRedmine } from "../../../api/services/redmineService";
import { infoToast, successToast } from "../Toast";
import { CgProfile } from "react-icons/cg";
import { IoMdLogOut } from "react-icons/io";
import { ExternalAppList } from "./ExternalAppList";
import { AppInfoContext } from "../../../context/AppInfoContext";

const Header = () => {
    const navigate = useNavigate();
    const { title } = useContext(AppInfoContext);
    const { user, isLoggedIn, logout } = useContext(UserContext);
    const [profileMenuOpened, setProfileMenuOpened] = useState(false);
    const [appsMenuOpened, setAppsMenuOpened] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const appsDropdownRef = useRef<HTMLDivElement>(null);

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

    const sync = async () => {
        try {
            infoToast("Syncing with Redmine...");
            await syncWithRedmine();
            successToast("Synced with Redmine successfully");
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
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
                            {title}
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
                                <div>
                                    <span className="uppercase pointer-events-none text-[14px]">
                                        {`${user?.lastname} ${user?.firstname}`}
                                    </span>
                                </div>
                                {hasAdminAccess() && (
                                    <button
                                        className="flex justify-center items-center h-[35px] w-[35px] text-[32px] hover:opacity-75"
                                        title="Sync with Redmine"
                                        onClick={sync}
                                    >
                                        <IoRefreshCircle />
                                    </button>
                                )}
                                <div ref={appsDropdownRef} className="relative">
                                    <button
                                        className="flex justify-center items-center rounded-[50%] h-[35px] w-[35px] hover:bg-[#005eb6] cursor-pointer text-[20px] text-white"
                                        onClick={() => toggleAppsMenu()}
                                    >
                                        <IoApps />
                                    </button>
                                    {appsMenuOpened && (
                                        <div className="flex flex-col absolute top-[130%] right-[0] bg-white shadow-card text-[#444] py-[8px] min-w-[300px] max-w-[600px] rounded-[0.25rem] items-center text-[18px]">
                                            <span className="font-bold">
                                                Applications
                                            </span>
                                            <div className="absolute top-[-6px] right-[4%] border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white"></div>
                                            <ExternalAppList
                                                isLoggedIn={isLoggedIn}
                                            />
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
                                        <div className="flex flex-col absolute top-[130%] right-0 bg-white shadow-card py-[8px] w-[200px] rounded-[0.25rem] items-center text-[16px] text-primary">
                                            <ProfileMenuItem
                                                icon={<CgProfile />}
                                                onClick={goToProfile}
                                                text="Profile"
                                            />
                                            <ProfileMenuItem
                                                icon={<IoMdLogOut />}
                                                onClick={handleLogout}
                                                text="Logout"
                                            />
                                            <div className="absolute top-[-6px] right-[6%] border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white"></div>
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

const ProfileMenuItem = ({
    icon,
    text,
    onClick,
}: {
    icon: JSX.Element;
    text: string;
    onClick: () => void;
}) => {
    return (
        <a
            className="flex items-center gap-2 w-full text-left hover:bg-[#efefef] px-[16px] py-[5px]"
            href=""
            onClick={onClick}
        >
            <div className="text-[18px]">{icon}</div>
            <span>{text}</span>
        </a>
    );
};
