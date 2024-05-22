import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    className?: string;
}

export const ChartTitle = ({ children, className = "" }: Props) => {
    return (
        <span
            className={`text-[#222] text-[20px] w-full font-semibold px-2 ${className}`}
        >
            {children}
        </span>
    );
};
