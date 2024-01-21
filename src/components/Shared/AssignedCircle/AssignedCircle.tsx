interface Props {
    firstname: string;
    lastname: string;
}

const AssignedCircle = ({ firstname, lastname }: Props) => {
    return (
        <>
            <div className="flex justify-center items-center rounded-[50%] h-[28px] w-[28px] bg-[#d9d9d9] cursor-pointer text-[14px] text-primary">
                <span>
                    {firstname[0]}
                    {lastname[0]}
                </span>
            </div>
        </>
    );
};

export default AssignedCircle;
