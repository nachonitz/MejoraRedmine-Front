import { Switch } from "@mui/material";

interface CustomSwitchProps {
    title: string;
    description?: string;
    onClick?: (e: any) => void;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ( { title, onClick, description } ) => {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onClick && onClick(event.target.checked);
    }

    return (
        <div className="flex w-full justify-between items-center">
            <div className="flex flex-col gap-[10px] justify-center">
                <p className="text-[18px] text-[#444]">{title}</p>
                {description && <p className="text-[16px] text-[#888]">{description}</p>}
            </div>
            <div>
                <Switch onChange={handleChange} />
            </div>
        </div>
    )
}

export default CustomSwitch;