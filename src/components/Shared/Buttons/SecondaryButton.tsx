interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  width?: string;
}

const SecondaryButton = ({
  children,
  onClick,
  width,
}: SecondaryButtonProps) => {
  return (
    <button
      onClick={onClick}
      style={
        width ? { width: width, paddingRight: 0, paddingLeft: 0 } : undefined
      }
      className="font-normal text-[16px] bg-white text-primary p-[12px] px-[35px] border border-primary rounded-[4px] active:shadow-card duration-150"
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
