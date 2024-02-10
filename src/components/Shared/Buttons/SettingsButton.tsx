import { useEffect, useRef, useState } from "react";
import { SlOptions } from "react-icons/sl";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";

interface SettingsButtonProps {
    onEdit?: () => void;
    onDelete?: () => void;
}

const SettingsButton = ({ onEdit, onDelete }: SettingsButtonProps) => {
    const [settingsOpened, setSettingsOpened] = useState(false);
    const settingsDropdownRef = useRef<HTMLDivElement>(null);

    const toggleSettings = (event: Event) => {
        event?.stopPropagation();
        setSettingsOpened(!settingsOpened);
    };

    const handleOutsideClick = (event: any) => {
        if (
            settingsDropdownRef.current &&
            !settingsDropdownRef.current.contains(event.target)
        ) {
            setSettingsOpened(false);
        }
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
        document.addEventListener("click", handleOutsideClick, true);
        return () => {
            document.removeEventListener("click", handleOutsideClick, true);
        };
    }, []);

    return (
        <div className="relative" ref={settingsDropdownRef}>
            <button
                className="flex justify-center items-center rounded-[50%] h-[35px] w-[35px] hover:bg-[#eee] duration-150 cursor-pointer text-[20px] text-[#888]"
                onClick={(event: any) => toggleSettings(event)}
            >
                <SlOptions />
            </button>
            {settingsOpened && (
                <div
                    className="flex flex-col z-10 absolute top-[100%] right-[0%] 
                  bg-white shadow-card text-[#444] w-[150px] rounded-[0px] 
                  items-start text-[16px]"
                >
                    {onEdit && (
                        <div
                            onClick={handleEdit}
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
                </div>
            )}
        </div>
    );
};

export default SettingsButton;
