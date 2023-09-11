import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Epic, EpicFilter } from "../../../api/models/epic";
import { Sprint } from "../../../api/models/sprint";
import { deleteEpic, getEpics } from "../../../api/services/epicsService";
import { getSprintById } from "../../../api/services/sprintsService";
import CreateEpicDialog from "../../../components/Pages/Epics/CreateEpicDialog/CreateEpicDialog";
import EditEpicDialog from "../../../components/Pages/Epics/EditEpicDialog/EditEpicDialog";
import AddButton from "../../../components/Shared/Buttons/AddButton";
import SettingsButton from "../../../components/Shared/Buttons/SettingsButton";
import DeleteDialog from "../../../components/Shared/DeleteDialog/DeleteDialog";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import ProjectBreadcrumbs from "../../../components/Shared/ProjectBreadcrumbs/ProjectBreadcrumbs";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";

const defaultFilters: EpicFilter = {
    page: 1,
    limit: 10,
};

const ProjectEpics = () => {
    const { projectId, releaseId, sprintId } = useParams();
    const navigate = useNavigate();
    const [sprint, setSprint] = useState<Sprint>();
    const [epics, setEpics] = useState<Epic[]>([]);
    const [openCreateEpic, setOpenCreateEpic] = useState(false);
    const [openEditEpic, setOpenEditEpic] = useState(false);
    const [openDeleteEpic, setOpenDeleteEpic] = useState(false);
    const [selectedEpic, setSelectedEpic] = useState<Epic>();

    const getSprint = useCallback(async () => {
        try {
            if (sprintId) {
                const sprint = await getSprintById(parseInt(sprintId));
                setSprint(sprint);
                return sprint;
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    }, [sprintId]);

    const getAllEpics = useCallback(async () => {
        try {
            if (sprintId) {
                const { data } = await getEpics({
                    ...defaultFilters,
                    sprintId: +sprintId,
                });
                setEpics(data.items);
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    }, [sprintId]);

    const goToEpic = (id: number) => {
        navigate(
            `/project/${projectId}/release/${releaseId}/sprint/${sprintId}/epic/${id}`
        );
    };

    const handleCloseCreateEpic = (refresh?: boolean) => {
        setOpenCreateEpic(false);
        if (refresh) {
            getAllEpics();
        }
    };

    const handleCloseEditEpic = (refresh?: boolean) => {
        setOpenEditEpic(false);
        if (refresh) {
            getAllEpics();
        }
        setSelectedEpic(undefined);
    };

    const handleCloseDeleteEpic = (refresh?: boolean) => {
        setOpenDeleteEpic(false);
        if (refresh) {
            getAllEpics();
        }
        setSelectedEpic(undefined);
    };

    useEffect(() => {
        getSprint();
        getAllEpics();
    }, [getSprint, getAllEpics]);

    return (
        <Sidebar>
            <Page>
                <ProjectBreadcrumbs
                    project={sprint?.project}
                    release={sprint?.release}
                    sprint={sprint}
                />
                {projectId && (
                    <CreateEpicDialog
                        projectId={projectId}
                        releaseId={releaseId}
                        sprintId={sprintId}
                        open={openCreateEpic}
                        handleClose={handleCloseCreateEpic}
                    />
                )}
                {selectedEpic && (
                    <>
                        <EditEpicDialog
                            open={openEditEpic}
                            epicId={selectedEpic?.id}
                            handleClose={handleCloseEditEpic}
                        />
                        <DeleteDialog
                            open={openDeleteEpic}
                            id={selectedEpic?.id}
                            handleClose={handleCloseDeleteEpic}
                            deleteFunction={deleteEpic}
                            name={selectedEpic?.name}
                        />
                    </>
                )}
                <div className="flex gap-[15px] items-center">
                    <PageTitle title="Epics" />
                    <AddButton
                        onClick={() => {
                            setOpenCreateEpic(true);
                        }}
                    />
                </div>
                <div>
                    <table className="w-full mt-[30px]">
                        <thead>
                            <tr className="text-[18px] border-b-[1px] border-b-[#ccc] h-[40px]">
                                <th></th>
                                <th className="text-left">Name</th>
                                <th className="text-left">Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {epics.map((epic: Epic) => (
                                <tr
                                    key={epic.id}
                                    onClick={() => {
                                        goToEpic(epic.id);
                                    }}
                                    className="text-[18px] h-[40px] cursor-pointer hover:bg-gray-50"
                                >
                                    <td className="w-[30px]">
                                        <img
                                            className="w-[24px] h-[24px]"
                                            src={
                                                "/src/assets/icons/epic-icon.png"
                                            }
                                        />
                                    </td>
                                    <td className="gap-[10px] text-left">
                                        {epic.name}
                                    </td>
                                    <td className="text-left">{"0%"}</td>
                                    <td className="text-right">
                                        <div className="flex justify-end">
                                            <SettingsButton
                                                onEdit={() => {
                                                    setSelectedEpic(epic);
                                                    setOpenEditEpic(true);
                                                }}
                                                onDelete={() => {
                                                    setSelectedEpic(epic);
                                                    setOpenDeleteEpic(true);
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {epics.length === 0 && (
                        <div className="text-[18px] h-[40px] w-full text-center mt-2">
                            <span className="text-center">
                                There are no epics yet
                            </span>
                        </div>
                    )}
                </div>
            </Page>
        </Sidebar>
    );
};

export default ProjectEpics;
