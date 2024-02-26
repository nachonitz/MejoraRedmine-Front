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
}
export const SprintsVelocityChartCard = ({ title, data }: Props) => {
    return (
        <div className="relative overflow-hidden shadow-card rounded-md flex flex-col items-center justify-center p-3 box-border gap-3">
            <div>
                <span className="text-[#888] text-[20px]">{title}</span>
            </div>
            <div className="flex flex-grow w-[400px]">
                {data && (
                    <Bar
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
        </div>
    );
};
