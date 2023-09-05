import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Page = ({ children }: Props) => {
  return <div className="p-page mt-10 box-border w-full">{children}</div>;
};

export default Page;
