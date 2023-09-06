import { Switch } from "@mui/material";

interface CustomSwitchProps {
    title: string;
    value?: boolean;
    description?: string;
    onClick?: (e: boolean) => void;
}

const CustomSwitch = ({
    title,
    value,
    onClick,
    description,
}: CustomSwitchProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onClick && onClick(event.target.checked);
    };

    return (
        <div className="flex w-full justify-between items-center">
            <div className="flex flex-col gap-[5px] justify-center">
                <p className="text-[18px] text-[#444]">{title}</p>
                {description && (
                    <p className="text-[16px] text-[#888]">{description}</p>
                )}
            </div>
            <div>
                <Switch checked={value} onChange={handleChange} />
            </div>
        </div>
    );
};

export default CustomSwitch;
