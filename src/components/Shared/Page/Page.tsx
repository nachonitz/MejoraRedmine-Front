import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

const Page = ({ children }: Props) => {
    return (
        <div className="p-page pb-[2rem] mt-10 box-border w-full">
            {children}
        </div>
    );
};

export default Page;
