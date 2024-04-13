interface Props {
    title: string;
    properties: { name: string; value: number }[];
}

export const ComparativeCard = ({ title, properties }: Props) => {
    return (
        <div className="relative overflow-hidden w-[270px] shadow-card rounded-md flex flex-col items-center justify-center p-3 box-border gap-3">
            <div className="absolute left-0 bg-secondary w-[20px] h-full"></div>
            <div>
                <span className="text-[#888] text-[20px]">{title}</span>
            </div>
            {properties && properties.length === 2 && (
                <div className="flex flex-row justify-center gap-3">
                    <div className="flex flex-col text-right">
                        <span className="text-primary text-[20px]">
                            {properties[0].value}
                        </span>
                        <span className="text-[#bbb] text-[14px]">
                            {properties[0].name}
                        </span>
                    </div>
                    <div className="w-[2px] h-6 bg-secondary"></div>
                    <div className="flex flex-col text-left">
                        <span className="text-primary text-[20px]">
                            {properties[1].value}
                        </span>
                        <span className="text-[#bbb] text-[14px]">
                            {properties[1].name}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
