import { useEffect, useState } from "react";
import { Release } from "../../../api/models/release";
import { ChartTitle } from "./ChartTitle";

interface Props {
    releases: Release[];
}

export const Timeline = ({ releases }: Props) => {
    const [minStartDate, setMinStartDate] = useState<Date>();
    const [maxEndDate, setMaxEndDate] = useState<Date>();
    const [currentDatePercentage, setCurrentDatePercentage] = useState(0);

    useEffect(() => {
        if (releases.length === 0) return;
        const startDates = releases.map((release) => release.startDate);
        const endDates = releases.map((release) => release.endDate);
        const minStartDate = new Date(
            startDates.reduce((a, b) => (a < b ? a : b))
        );
        const maxEndDate = new Date(endDates.reduce((a, b) => (a > b ? a : b)));
        setMinStartDate(minStartDate);
        setMaxEndDate(maxEndDate);
        setCurrentDatePercentage(
            getDatePercentage(new Date(), minStartDate, maxEndDate)
        );
    }, [releases]);

    const getDatePercentage = (
        date: Date,
        minStartDate: Date | undefined,
        maxEndDate: Date | undefined
    ) => {
        if (!minStartDate || !maxEndDate) return 0;
        const startDate = minStartDate.getTime();
        const endDate = maxEndDate.getTime();
        let currentDatePercentage =
            ((date.getTime() - startDate) / (endDate - startDate)) * 100;
        if (currentDatePercentage < 0) currentDatePercentage = 0;
        if (currentDatePercentage > 100) currentDatePercentage = 100;
        return currentDatePercentage;
    };

    const getDate = (date: Date | undefined) => {
        if (!date) return "";
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };
    return (
        <div className="w-full bg-white rounded-md flex flex-col items-center p-4 gap-5">
            <ChartTitle>Timeline</ChartTitle>
            <div className="w-full h-full flex items-center gap-3 p-4">
                <div>
                    <span className="text-secondary">
                        {minStartDate && getDate(minStartDate)}
                    </span>
                </div>
                <div className="w-full flex flex-col">
                    <div className="w-full flex"></div>
                    <div className="relative">
                        <div className="flex items-center">
                            <div
                                style={{ width: `${currentDatePercentage}%` }}
                                className="h-[3px] rounded-full bg-primary"
                            ></div>
                            <div
                                style={{
                                    width: `${100 - currentDatePercentage}%`,
                                }}
                                className="rounded-full border-t-[3px] border-primary border-dashed"
                            ></div>
                            <div
                                style={{ left: `${currentDatePercentage}%` }}
                                className="w-3 h-3 rounded-full bg-secondary absolute"
                            ></div>
                        </div>
                        <div>
                            {releases &&
                                releases.map((release, i) => {
                                    if (i === releases.length - 1) return;
                                    return (
                                        <div
                                            key={release.id}
                                            style={{
                                                left: `${getDatePercentage(
                                                    new Date(release.endDate),
                                                    minStartDate,
                                                    maxEndDate
                                                )}%`,
                                            }}
                                            className="absolute flex justify-center"
                                        >
                                            <div className="absolute top-[-64px] flex flex-col items-center">
                                                <div>
                                                    <span className="text-[#888] whitespace-nowrap">
                                                        {release.name}
                                                    </span>
                                                </div>
                                                <div className="relative left-[10px]">
                                                    <div className="h-2 w-1 bg-secondary"></div>
                                                    <div className="w-5 h-3 border-4 border-secondary"></div>
                                                    <div className="h-3 w-1 bg-secondary"></div>
                                                </div>
                                            </div>
                                            <div className="absolute top-[5px]">
                                                <span className="text-[#888] whitespace-nowrap">
                                                    {getDate(
                                                        new Date(
                                                            release.endDate
                                                        )
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
                <div>
                    <span className="text-secondary">
                        {maxEndDate && getDate(maxEndDate)}
                    </span>
                </div>
            </div>
        </div>
    );
};
