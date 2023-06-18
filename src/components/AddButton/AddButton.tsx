import { MdAdd } from 'react-icons/md';

const AddButton = () => {

    return (
        <>
            <button className="rounded-[50%] w-[44px] h-[44px] bg-secondary flex items-center justify-center text-white cursor-pointer">
                <MdAdd />
            </button>
        </>
    )
}

export default AddButton;