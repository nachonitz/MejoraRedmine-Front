import { createContext, useState } from "react";

interface ActiveSortContextProps {
    activeSort: string;
    setActiveSort: (sort: string) => void;
}

export const ActiveSortContext = createContext({} as ActiveSortContextProps);

export const ActiveSortProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [activeSort, setActiveSort] = useState<string>("");

    return (
        <ActiveSortContext.Provider value={{ activeSort, setActiveSort }}>
            {children}
        </ActiveSortContext.Provider>
    );
};
