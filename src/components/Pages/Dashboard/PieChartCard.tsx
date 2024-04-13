import { PieChart } from "@mui/x-charts";

interface Props {
    title: string;
    data: { id: number; value: number; label: string }[];
}

export const PieChartCard = ({ title, data }: Props) => {
    return (
        <div className="relative overflow-hidden shadow-card rounded-md flex flex-col items-center justify-center p-3 box-border gap-3">
            <div>
                <span className="text-[#888] text-[20px]">{title}</span>
            </div>
            <div className="flex flex-grow">
                <PieChart series={[{ data }]} width={400} height={200} />
            </div>
        </div>
    );
};
