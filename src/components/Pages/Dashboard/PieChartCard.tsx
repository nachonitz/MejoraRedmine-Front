import { PieChart } from "@mui/x-charts";
import { ChartTitle } from "./ChartTitle";
import { useMemo } from "react";

interface Props {
    title: string;
    data: { id: number; value: number; label: string }[];
    className?: string;
}

export const PieChartCard = ({ title, data, className = "" }: Props) => {
    const chartData = useMemo(() => {
        if (data.length === 1) {
            return [...data, { id: -1, value: 0, label: undefined }];
        }
        return data;
    }, [data]);
    return (
        <div
            className={`relative overflow-hidden bg-white rounded-md flex flex-col w-full
            items-center justify-center p-4 box-border gap-3 ${className}`}
        >
            <ChartTitle>{title}</ChartTitle>
            {data && data.length !== 0 ? (
                <div className="flex flex-grow w-full">
                    <PieChart
                        series={[
                            {
                                data: chartData,
                                paddingAngle: 2,
                                cornerRadius: 5,
                                innerRadius: 60,
                            },
                        ]}
                        height={300}
                    />
                </div>
            ) : (
                <p className="text-[#888] text-[14px] min-h-[200px] flex items-center">
                    No data available yet.
                </p>
            )}
        </div>
    );
};
