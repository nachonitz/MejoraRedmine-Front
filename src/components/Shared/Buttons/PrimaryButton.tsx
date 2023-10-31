interface PrimaryButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    width?: string;
    className?: string;
}

const PrimaryButton = ({
    children,
    onClick,
    width,
    className = "",
}: PrimaryButtonProps) => {
    const baseClasses =
        "font-normal text-[16px] bg-primary text-white p-[12px] px-[35px] border border-primary rounded-[4px] active:shadow-card duration-150 hover:bg-primary/80 hover:border-primary/80";
    return (
        <button
            onClick={onClick}
            style={
                width
                    ? { width: width, paddingRight: 0, paddingLeft: 0 }
                    : undefined
            }
            className={`${baseClasses} ${className}`}
        >
            {children}
        </button>
    );
};

export default PrimaryButton;
