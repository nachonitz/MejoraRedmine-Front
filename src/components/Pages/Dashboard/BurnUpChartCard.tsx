import { Line } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    interaction: {
        mode: "index" as const,
        intersect: true,
    },
    // stacked: false,
    scales: {
        y: {
            type: "linear" as const,
            display: true,
            position: "left" as const,
        },
    },
};

interface Props {
    title: string;
    data: { label: string; completed: number | null; trend: number }[];
}
export const BurnUpChartCard = ({ title, data }: Props) => {
    return (
        <div className="relative overflow-hidden shadow-card rounded-md flex flex-col items-center justify-center p-3 box-border gap-3">
            <div>
                <span className="text-[#888] text-[20px]">{title}</span>
            </div>
            <div className="flex flex-grow w-[400px]">
                {data && (
                    <Line
                        options={options}
                        data={{
                            labels: data.map((item: any) => item.label),
                            datasets: [
                                {
                                    label: "Story points done",
                                    data: data.map(
                                        (item: any) => item.completed
                                    ),
                                    borderColor: "rgb(53, 162, 235)",
                                    backgroundColor: "rgba(53, 162, 235, 0.5)",
                                    yAxisID: "y",
                                },
                                {
                                    label: "Trend",
                                    data: data.map((item: any) => item.trend),
                                    borderColor: "#ccc",
                                    backgroundColor: "#ccc",
                                    yAxisID: "y",
                                    borderDash: [3, 3],
                                },
                            ],
                        }}
                    />
                )}
            </div>
        </div>
    );
};
