import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { ChartTitle } from "./ChartTitle";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
    },
};

interface Props {
    title: string;
    data: { label: string; velocity: number }[];
    condition?: boolean;
}
export const SprintsVelocityChartCard = ({ title, data, condition }: Props) => {
    return (
        <div className="relative w-full overflow-hidden bg-white rounded-md flex flex-col items-center justify-center p-4 box-border gap-3">
            <ChartTitle>{title}</ChartTitle>
            {condition ? (
                <div className="flex flex-grow w-full">
                    {data && (
                        <Bar
                            updateMode="resize"
                            options={options}
                            data={{
                                labels: data.map((item: any) => item.label),
                                datasets: [
                                    {
                                        data: data.map(
                                            (item: any) => item.velocity
                                        ),
                                        backgroundColor: "rgba(53, 162, 235)",
                                    },
                                ],
                            }}
                        />
                    )}
                </div>
            ) : (
                <p className="text-[#888] text-[14px] min-h-[150px] flex items-center">
                    No data available yet.
                </p>
            )}
        </div>
    );
};
