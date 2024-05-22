import { ChartTitle } from "./ChartTitle";

interface Props {
    title: string;
    properties: { name: string; value: number }[];
    color: string;
    icon?: string;
}

export const ComparativeCard = ({ title, properties, color, icon }: Props) => {
    return (
        <div
            className="relative overflow-hidden bg-white rounded-md flex flex-col 
        items-center w-full p-4 box-border"
        >
            <div
                className="absolute left-0 top-0 w-[10px] h-full"
                style={{
                    backgroundColor: color,
                }}
            ></div>
            <ChartTitle className="ml-2 flex items-center gap-x-2">
                {icon && <img className="w-[24px] h-[24px]" src={icon} />}
                {title}
            </ChartTitle>
            {properties && properties.length === 2 && (
                <div className="flex flex-row justify-center items-center h-full gap-3">
                    <div className="flex flex-col text-right">
                        <span className="text-primary text-[20px] font-semibold">
                            {properties[0].value}
                        </span>
                        <span className="text-[#888] text-[14px]">
                            {properties[0].name}
                        </span>
                    </div>
                    <div
                        className="w-[2px] h-10"
                        style={{
                            backgroundColor: color,
                        }}
                    ></div>
                    <div className="flex flex-col text-left">
                        <span className="text-primary text-[20px] font-semibold">
                            {properties[1].value}
                        </span>
                        <span className="text-[#888] text-[14px]">
                            {properties[1].name}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
