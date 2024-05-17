import { useEffect, useRef, useState } from "react";
import { SlOptions } from "react-icons/sl";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import ReactDOM from "react-dom";

interface SettingsButtonProps {
    onEdit?: () => void;
    onDelete?: () => void;
}

const SettingsButton = ({ onEdit, onDelete }: SettingsButtonProps) => {
    const [settingsOpened, setSettingsOpened] = useState(false);
    const settingsDropdownRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleSettings = (event: Event) => {
        event?.stopPropagation();
        setSettingsOpened(!settingsOpened);
    };

    const handleOutsideClick = (event: any) => {
        if (
            settingsDropdownRef.current &&
            !settingsDropdownRef.current.contains(event.target) &&
            menuRef.current &&
            !menuRef.current.contains(event.target)
        ) {
            setSettingsOpened(false);
        }
    };

    const updateMenuPosition = () => {
        if (settingsDropdownRef.current) {
            const menuRect =
                settingsDropdownRef.current.getBoundingClientRect();

            let top = menuRect.top + window.scrollY;
            let left = menuRect.left + window.scrollX;
            if (top !== menuPosition.top || left !== menuPosition.left) {
                console.log("updateMenuPosition", top, menuPosition.top);
                setMenuPosition({
                    top: top,
                    left: left,
                });
            }
        }
    };

    const handleScroll = (_event: any) => {
        setSettingsOpened(false);
    };

    const handleEdit = (event: any) => {
        event?.stopPropagation();
        setSettingsOpened(false);
        onEdit && onEdit();
    };

    const handleDelete = (event: any) => {
        event?.stopPropagation();
        setSettingsOpened(false);
        onDelete && onDelete();
    };

    useEffect(() => {
        updateMenuPosition();

        document.addEventListener("click", handleOutsideClick, true);
        window.addEventListener("scroll", handleScroll);

        return () => {
            document.removeEventListener("click", handleOutsideClick, true);
            window.removeEventListener("scroll", handleScroll);
        };
    });

    return (
        <div className="relative" ref={settingsDropdownRef}>
            <div>
                <button
                    className="flex justify-center items-center rounded-[50%] h-[35px] w-[35px] hover:bg-[#eee] duration-150 cursor-pointer text-[20px] text-[#888]"
                    onClick={(event: any) => toggleSettings(event)}
                >
                    <SlOptions />
                </button>
            </div>
            {settingsOpened &&
                ReactDOM.createPortal(
                    <div
                        ref={menuRef}
                        style={{
                            top: menuPosition.top + 40,
                            left: menuPosition.left - 113,
                        }}
                        className="flex flex-col z-10 absolute
                  bg-white shadow-card text-[#444] w-[150px] rounded-[0px] 
                  items-start text-[16px]"
                    >
                        {onEdit && (
                            <div
                                onClick={(event) => {
                                    handleEdit(event);
                                }}
                                className="flex gap-[10px] px-4 py-[6px] items-center justify-start 
                            hover:bg-[#eee] w-full cursor-pointer"
                            >
                                <div>
                                    <MdOutlineModeEditOutline className="text-[18px]" />
                                </div>
                                <div>
                                    <span>Edit</span>
                                </div>
                            </div>
                        )}
                        {onDelete && (
                            <div
                                onClick={handleDelete}
                                className="flex gap-[10px] px-4 py-[6px] items-center justify-start 
                          hover:bg-[#eee] w-full cursor-pointer"
                            >
                                <div>
                                    <RiDeleteBin6Line className="text-[18px]" />
                                </div>
                                <div>
                                    <span>Delete</span>
                                </div>
                            </div>
                        )}
                        <div className="absolute top-[-6px] right-[8%] border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white"></div>
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default SettingsButton;
