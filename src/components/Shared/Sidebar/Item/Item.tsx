
interface ItemProps {
    name: string;
    icon: string;
    onClick: (e: any) => void;
}

const Item: React.FC<ItemProps> = ({ name, icon, onClick }) => {

    return (
        <div>
            <div className="flex flex-row items-center w-full py-[6px] px-4 gap-[14px] duration-200 text-primary rounded cursor-pointer bg-lightblue hover:bg-itemhover" onClick={onClick}>
                <img className="w-[24px]" src={'/src/assets/icons/' + icon} />
                <span className="text-[18px] text-primary">{name}</span>
            </div>
        </div>
    )
}

export default Item;