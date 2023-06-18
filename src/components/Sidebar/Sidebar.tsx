import Item from "./Item/Item";

const Sidebar = ( { children }: any ) => {

    return (
        <>
            <div className="flex h-screen fixed top-header mt-header bg-lightblue w-56">
                <div className="flex flex-col mt-5 w-full px-[2px] box-border">
                    <Item name="Home" icon="home-icon.png" onClick={()=>{ console.log("Click!") }} />
                    <Item name="Dashboard" icon="dashboard-icon.png" onClick={()=>{ console.log("Click!") }} />
                    <Item name="Backlog" icon="backlog-icon.png" onClick={()=>{ console.log("Click!") }} />
                    <Item name="Documents" icon="documents-icon.png" onClick={()=>{ console.log("Click!") }} />
                    <Item name="Risks" icon="risks-icon.png" onClick={()=>{ console.log("Click!") }} />
                    <Item name="Settings" icon="settings-icon.png" onClick={()=>{ console.log("Click!") }} />
                </div>
            </div>
            <div className="ml-56">
                { children }
            </div>
        </>
    )
}

export default Sidebar;