interface ItemProps {
    selected?: boolean;
    name: string;
    icon: string;
    onClick: () => void;
}

const Item: React.FC<ItemProps> = ({ name, icon, onClick, selected }) => {
    return (
        <div>
            <div
                className={
                    `${
                        selected ? "bg-itemhover font-[500] " : "bg-lightblue "
                    } ` +
                    "flex relative flex-row items-center w-full py-[6px] px-4 gap-[14px] duration-200 text-primary rounded overflow-hidden cursor-pointer bg-lightblue hover:bg-itemhover"
                }
                onClick={onClick}
            >
                {selected && (
                    <div className="bg-primary absolute left-0 w-1 h-full"></div>
                )}
                <img className="w-[24px]" src={"/src/assets/icons/" + icon} />
                <span className="text-[18px] text-primary">{name}</span>
            </div>
        </div>
    );
};

export default Item;
