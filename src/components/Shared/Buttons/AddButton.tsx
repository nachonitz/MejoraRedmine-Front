import { MdAdd } from "react-icons/md";

interface AddButtonProps {
  onClick?: () => void;
}

const AddButton = ({ onClick }: AddButtonProps) => {
  return (
    <>
      <button
        onClick={onClick}
        className="rounded-[50%] w-[44px] h-[44px] text-[26px] bg-secondary flex items-center justify-center text-white cursor-pointer"
      >
        <MdAdd />
      </button>
    </>
  );
};

export default AddButton;
