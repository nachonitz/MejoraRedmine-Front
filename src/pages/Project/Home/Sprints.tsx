import { LinearProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Release } from "../../../api/models/release";
import { Sprint, SprintFilter } from "../../../api/models/sprint";
import { getMyPermissions } from "../../../api/services/membershipsService";
import { getReleaseById } from "../../../api/services/releasesService";
import { deleteSprint, getSprints } from "../../../api/services/sprintsService";
import CreateSprintDialog from "../../../components/Pages/Sprints/CreateSprintDialog/CreateSprintDialog";
import EditSprintDialog from "../../../components/Pages/Sprints/EditSprintDialog/EditSprintDialog";
import PrimaryButton from "../../../components/Shared/Buttons/PrimaryButton";
import SettingsButton from "../../../components/Shared/Buttons/SettingsButton";
import DeleteDialog from "../../../components/Shared/DeleteDialog/DeleteDialog";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import ProjectBreadcrumbs from "../../../components/Shared/ProjectBreadcrumbs/ProjectBreadcrumbs";
import { Searchbar } from "../../../components/Shared/Searchbar/Searchbar";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import { getFullDate, hasAccess } from "../../../lib/utils";
import SecondaryButton from "../../../components/Shared/Buttons/SecondaryButton";
import { SprintFiltersModal } from "../../../components/Pages/Sprints/SprintFiltersModal";

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
    const [openSprintFiltersModal, setOpenSprintFiltersModal] = useState(false);
    const [selectedSprint, setSelectedSprint] = useState<Sprint>();
    const [permissions, setPermissions] = useState<string[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<SprintFilter>(defaultFilters);

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

    const query = useCallback(
        async (filters: SprintFilter) => {
            try {
                if (releaseId) {
                    setIsLoading(true);
                    const { data } = await getSprints({
                        ...filters,
                        releaseId: +releaseId,
                    });
                    setIsLoading(false);
                    setSprints(data.items);
                }
            } catch (error) {
                throw new Error("Error. Please try again.");
            }
        },
        [releaseId]
    );

    const goToSprint = (id: number) => {
        navigate(`/project/${projectId}/release/${releaseId}/sprint/${id}`);
        console.log(id);
    };

    const handleCloseCreateSprint = (refresh?: boolean) => {
        setOpenCreateSprint(false);
        if (refresh) {
            query(defaultFilters);
        }
    };

    const handleCloseEditSprint = (refresh?: boolean) => {
        setOpenEditSprint(false);
        if (refresh) {
            query(defaultFilters);
        }
        setSelectedSprint(undefined);
    };

    const handleCloseDeleteSprint = (refresh?: boolean) => {
        setOpenDeleteSprint(false);
        if (refresh) {
            query(defaultFilters);
        }
        setSelectedSprint(undefined);
    };

    useEffect(() => {
        query(filters);
    }, [query, filters]);

    useEffect(() => {
        query(defaultFilters);
        getRelease();
        getUserPermissions();
    }, [query, getRelease, getUserPermissions]);

    return (
        <Sidebar>
            <Page>
                <ProjectBreadcrumbs
                    project={release?.project}
                    release={release}
                />
                {openSprintFiltersModal && (
                    <SprintFiltersModal
                        open={openSprintFiltersModal}
                        onClose={() => setOpenSprintFiltersModal(false)}
                        filters={filters}
                        setFilters={setFilters}
                        onClearFilters={() => setFilters(defaultFilters)}
                    />
                )}
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

                <div className="flex flex-col">
                    <PageTitle title={release?.name ?? ""} />
                    <div>release info here</div>
                    <div className="flex justify-between items-center mb-2 mt-4">
                        <h3 className="text-[22px] text-primary">Sprints</h3>
                        <div className="flex gap-x-6">
                            <SecondaryButton
                                onClick={() => setOpenSprintFiltersModal(true)}
                            >
                                Filters
                            </SecondaryButton>
                            <Searchbar
                                onChange={setSearchText}
                                onSearch={() =>
                                    query({
                                        ...filters,
                                        name: searchText,
                                    })
                                }
                            />
                            {hasAccess(permissions, ["add_issues"]) && (
                                <PrimaryButton
                                    onClick={() => {
                                        setOpenCreateSprint(true);
                                    }}
                                >
                                    New Sprint
                                </PrimaryButton>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <table className="w-full mt-[10px]">
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
                            {isLoading ? (
                                <LinearProgress />
                            ) : (
                                <span className="text-center">
                                    There are no sprints yet.
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </Page>
        </Sidebar>
    );
};

export default ProjectSprints;
