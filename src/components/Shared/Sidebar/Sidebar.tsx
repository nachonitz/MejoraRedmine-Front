import { useNavigate, useParams } from "react-router-dom";
import Item from "./Item/Item";

const Sidebar = ( { children }: any ) => {
    const navigate = useNavigate();
    const { projectId } = useParams();

    return (
        <>
            <div className="flex h-screen fixed top-header mt-header bg-lightblue w-56">
                <div className="flex flex-col mt-5 w-full px-[2px] box-border">
                    <Item name="Home" icon="home-icon.png" onClick={()=>{ navigate(`/project/${projectId}`) }} />
                    <Item name="Dashboard" icon="dashboard-icon.png" onClick={()=>{ console.log("Click!") }} />
                    <Item name="Backlog" icon="backlog-icon.png" onClick={()=>{ console.log("Click!") }} />
                    <Item name="Documents" icon="documents-icon.png" onClick={()=>{ console.log("Click!") }} />
                    <Item name="Risks" icon="risks-icon.png" onClick={()=>{ navigate(`/project/${projectId}/risks`) }} />
                    <Item name="Settings" icon="settings-icon.png" onClick={()=>{ console.log("Click!") }} />
                </div>
            </div>
            <div className="ml-56 w-full">
                { children }
            </div>
        </>
    )
}

export default Sidebar;