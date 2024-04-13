import { ReactNode, useContext, useState } from "react";
import { Filters } from "../../../lib/utils";
import { ActiveSortContext } from "../../../context/ActiveSortContext";

interface Props {
    attribute: string;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    align?: "left" | "center" | "right";
    className?: string;
    children: ReactNode;
}

const textAlignment = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
};

export const TableHeadItem = ({
    attribute,
    setFilters,
    align = "left",
    className,
    children,
}: Props) => {
    const { activeSort, setActiveSort } = useContext(ActiveSortContext);
    const [orderDirection, setOrderDirection] = useState<string>("asc");

    const handleClick = () => {
        const newDirection = orderDirection === "asc" ? "desc" : "asc";
        setOrderDirection(newDirection);
        setActiveSort(attribute);
        setFilters((prev) => ({
            ...prev,
            order: `${attribute}:${newDirection}`,
        }));
    };

    return (
        <th
            onClick={handleClick}
            className={`cursor-pointer hover:opacity-80 ${className}`}
        >
            <div
                className={`flex items-center gap-x-2 ${textAlignment[align]}`}
            >
                {children}{" "}
                {activeSort === attribute && orderDirection === "asc" && (
                    <span className="text-xs">▲</span>
                )}{" "}
                {activeSort === attribute && orderDirection === "desc" && (
                    <span className="text-xs">▼</span>
                )}
            </div>
        </th>
    );
};
