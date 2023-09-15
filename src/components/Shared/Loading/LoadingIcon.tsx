import { SVGProps } from "react";

export const LoadingIcon = (props: SVGProps<SVGSVGElement>) => {
    const baseClasses = "mx-3 inline h-6 w-6 animate-spin stroke-white";
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 48 48"
            {...props}
            className={`${baseClasses} ${props.className}`}
        >
            <path
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                d="M4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4"
            />
        </svg>
    );
};
