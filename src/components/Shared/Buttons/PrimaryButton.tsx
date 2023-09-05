interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  width?: string;
}

const PrimaryButton = ({ children, onClick, width }: PrimaryButtonProps) => {
  return (
    <button
      onClick={onClick}
      style={
        width ? { width: width, paddingRight: 0, paddingLeft: 0 } : undefined
      }
      className="font-normal text-[16px] bg-primary text-white p-[12px] px-[35px] border border-primary rounded-[4px] active:shadow-card duration-150"
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
