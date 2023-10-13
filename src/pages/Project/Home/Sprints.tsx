import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Release } from "../../../api/models/release";
import { Sprint, SprintFilter } from "../../../api/models/sprint";
import { getReleaseById } from "../../../api/services/releasesService";
import { deleteSprint, getSprints } from "../../../api/services/sprintsService";
import CreateSprintDialog from "../../../components/Pages/Sprints/CreateSprintDialog/CreateSprintDialog";
import EditSprintDialog from "../../../components/Pages/Sprints/EditSprintDialog/EditSprintDialog";
import AddButton from "../../../components/Shared/Buttons/AddButton";
import SettingsButton from "../../../components/Shared/Buttons/SettingsButton";
import DeleteDialog from "../../../components/Shared/DeleteDialog/DeleteDialog";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import ProjectBreadcrumbs from "../../../components/Shared/ProjectBreadcrumbs/ProjectBreadcrumbs";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import { getFullDate, hasAccess } from "../../../lib/utils";
import { getMyPermissions } from "../../../api/services/membershipsService";

const defaultFilters: SprintFilter = {
    page: 1,
    limit: 10,
};

const ProjectSprints = () => {
    const { projectId, releaseId } = useParams();
    const navigate = useNavigate();
    const [release, setRelease] = useState<Release>();
    const [sprints, setSprints] = useState<Sprint[]>([]);
    const [openCreateSprint, setOpenCreateSprint] = useState(false);
    const [openEditSprint, setOpenEditSprint] = useState(false);
    const [openDeleteSprint, setOpenDeleteSprint] = useState(false);
    const [selectedSprint, setSelectedSprint] = useState<Sprint>();
    const [permissions, setPermissions] = useState<string[]>([]);

    const getRelease = useCallback(async () => {
        try {
            if (releaseId) {
                const release = await getReleaseById(parseInt(releaseId));
                setRelease(release);
                console.log(release);
                return release;
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    }, [releaseId]);

    const getUserPermissions = useCallback(async () => {
        try {
            if (projectId) {
                const allPermissions = await getMyPermissions();
                const projectPermissions = allPermissions.find(
                    (permission) => permission.projectId === +projectId
                );
                setPermissions(projectPermissions?.roles ?? []);
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    }, [projectId]);

    const getAllSprints = useCallback(async () => {
        try {
            if (releaseId) {
                const { data } = await getSprints({
                    ...defaultFilters,
                    releaseId: +releaseId,
                });
                setSprints(data.items);
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    }, [releaseId]);

    const goToSprint = (id: number) => {
        navigate(`/project/${projectId}/release/${releaseId}/sprint/${id}`);
        console.log(id);
    };

    const handleCloseCreateSprint = (refresh?: boolean) => {
        setOpenCreateSprint(false);
        if (refresh) {
            getAllSprints();
        }
    };

    const handleCloseEditSprint = (refresh?: boolean) => {
        setOpenEditSprint(false);
        if (refresh) {
            getAllSprints();
        }
        setSelectedSprint(undefined);
    };

    const handleCloseDeleteSprint = (refresh?: boolean) => {
        setOpenDeleteSprint(false);
        if (refresh) {
            getAllSprints();
        }
        setSelectedSprint(undefined);
    };

    useEffect(() => {
        getAllSprints();
        getRelease();
        getUserPermissions();
    }, [getAllSprints, getRelease, getUserPermissions]);

    return (
        <Sidebar>
            <Page>
                <ProjectBreadcrumbs
                    project={release?.project}
                    release={release}
                />
                {releaseId &&
                    projectId &&
                    hasAccess(permissions, ["add_issues"]) && (
                        <CreateSprintDialog
                            projectId={+projectId}
                            releaseId={+releaseId}
                            open={openCreateSprint}
                            handleClose={handleCloseCreateSprint}
                        />
                    )}
                {selectedSprint &&
                    hasAccess(permissions, [
                        "edit_issues",
                        "delete_issues",
                    ]) && (
                        <>
                            <EditSprintDialog
                                open={openEditSprint}
                                sprintId={selectedSprint.id}
                                handleClose={handleCloseEditSprint}
                            />
                            <DeleteDialog
                                open={openDeleteSprint}
                                id={selectedSprint.id}
                                handleClose={handleCloseDeleteSprint}
                                deleteFunction={deleteSprint}
                                name={selectedSprint.name}
                            />
                        </>
                    )}

                <div className="flex gap-[15px] items-center">
                    <PageTitle title="Sprints" />
                    {hasAccess(permissions, ["add_issues"]) && (
                        <AddButton
                            onClick={() => {
                                setOpenCreateSprint(true);
                            }}
                        />
                    )}
                </div>
                <div>
                    <table className="w-full mt-[30px]">
                        <thead>
                            <tr className="text-[18px] border-b-[1px] border-b-[#ccc] h-[40px]">
                                <th></th>
                                <th className="text-left">Name</th>
                                <th className="text-left">Start date</th>
                                <th className="text-left">End date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sprints.map((sprint: Sprint) => (
                                <tr
                                    key={sprint.id}
                                    onClick={() => {
                                        goToSprint(sprint.id);
                                    }}
                                    className="text-[18px] h-[40px] cursor-pointer hover:bg-gray-50"
                                >
                                    <td className="w-[30px]">
                                        <img
                                            className="w-[24px] h-[24px]"
                                            src={
                                                "/src/assets/icons/sprint-icon.png"
                                            }
                                        />
                                    </td>
                                    <td className="gap-[10px] text-left">
                                        {sprint.name}
                                    </td>
                                    <td className="text-left">
                                        {getFullDate(sprint.startDate)}
                                    </td>
                                    <td className="text-left">
                                        {getFullDate(sprint.endDate)}
                                    </td>
                                    <td className="text-right">
                                        <div className="flex justify-end">
                                            {hasAccess(permissions, [
                                                "edit_issues",
                                                "delete_issues",
                                            ]) && (
                                                <SettingsButton
                                                    onEdit={() => {
                                                        setSelectedSprint(
                                                            sprint
                                                        );
                                                        setOpenEditSprint(true);
                                                    }}
                                                    onDelete={() => {
                                                        setSelectedSprint(
                                                            sprint
                                                        );
                                                        setOpenDeleteSprint(
                                                            true
                                                        );
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {sprints.length === 0 && (
                        <div className="text-[18px] h-[40px] w-full text-center mt-2">
                            <span className="text-center">
                                There are no sprints yet
                            </span>
                        </div>
                    )}
                </div>
            </Page>
        </Sidebar>
    );
};

export default ProjectSprints;
