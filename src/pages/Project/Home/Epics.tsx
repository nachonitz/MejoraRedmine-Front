import { LinearProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Epic, EpicFilter } from "../../../api/models/epic";
import { Sprint } from "../../../api/models/sprint";
import { deleteEpic, getEpics } from "../../../api/services/epicsService";
import { getMyPermissions } from "../../../api/services/membershipsService";
import { getSprintById } from "../../../api/services/sprintsService";
import CreateEpicDialog from "../../../components/Pages/Epics/CreateEpicDialog/CreateEpicDialog";
import EditEpicDialog from "../../../components/Pages/Epics/EditEpicDialog/EditEpicDialog";
import PrimaryButton from "../../../components/Shared/Buttons/PrimaryButton";
import SettingsButton from "../../../components/Shared/Buttons/SettingsButton";
import DeleteDialog from "../../../components/Shared/DeleteDialog/DeleteDialog";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import ProjectBreadcrumbs from "../../../components/Shared/ProjectBreadcrumbs/ProjectBreadcrumbs";
import { Searchbar } from "../../../components/Shared/Searchbar/Searchbar";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import { formatPercentage, getFullDate, hasAccess } from "../../../lib/utils";
import { Paginator } from "../../../components/Shared/Paginator/Paginator";
import { ListedResponseMetadata } from "../../../api/models/common";
import { DEFAULT_PAGINATION_DATA } from "../../../utilities/constants";
import { TableHeadItem } from "../../../components/Shared/Table/TableHeadItem";

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
    const [permissions, setPermissions] = useState<string[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<EpicFilter>(defaultFilters);
    const [paginationData, setPaginationData] =
        useState<ListedResponseMetadata>(DEFAULT_PAGINATION_DATA);

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
        async (filters: EpicFilter) => {
            try {
                if (sprintId) {
                    setIsLoading(true);
                    const { data } = await getEpics({
                        ...filters,
                        sprintId: +sprintId,
                    });
                    setIsLoading(false);
                    setEpics(data.items);
                    setPaginationData(data.meta);
                }
            } catch (error) {
                throw new Error("Error. Please try again.");
            }
        },
        [sprintId]
    );

    const goToEpic = (id: number) => {
        navigate(
            `/project/${projectId}/overview/release/${releaseId}/sprint/${sprintId}/epic/${id}`
        );
    };

    const handleCloseCreateEpic = (refresh?: boolean) => {
        setOpenCreateEpic(false);
        if (refresh) {
            query(defaultFilters);
        }
    };

    const handleCloseEditEpic = (refresh?: boolean) => {
        setOpenEditEpic(false);
        if (refresh) {
            query(defaultFilters);
        }
        setSelectedEpic(undefined);
    };

    const handleCloseDeleteEpic = (refresh?: boolean) => {
        setOpenDeleteEpic(false);
        if (refresh) {
            query(defaultFilters);
        }
        setSelectedEpic(undefined);
    };

    useEffect(() => {
        getSprint();
        query(defaultFilters);
        getUserPermissions();
    }, [getSprint, getUserPermissions, query]);

    useEffect(() => {
        query(filters);
    }, [query, filters]);

    console.log({ epics });

    return (
        <Sidebar>
            <Page>
                <ProjectBreadcrumbs
                    project={sprint?.project}
                    release={sprint?.release}
                    sprint={sprint}
                />
                {projectId && hasAccess(permissions, ["add_issues"]) && (
                    <CreateEpicDialog
                        projectId={projectId}
                        releaseId={releaseId}
                        sprintId={sprintId}
                        open={openCreateEpic}
                        handleClose={handleCloseCreateEpic}
                    />
                )}
                {selectedEpic &&
                    projectId &&
                    hasAccess(permissions, [
                        "edit_issues",
                        "delete_issues",
                    ]) && (
                        <>
                            <EditEpicDialog
                                open={openEditEpic}
                                epicId={selectedEpic?.id}
                                handleClose={handleCloseEditEpic}
                                projectId={parseInt(projectId)}
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
                <div className="flex flex-col">
                    {sprint && (
                        <PageTitle
                            dialogInfo={{
                                name: sprint?.name,
                                properties: [
                                    {
                                        name: "Description",
                                        value: sprint?.description,
                                    },
                                    {
                                        name: "Start Date",
                                        value: getFullDate(sprint?.startDate),
                                    },
                                    {
                                        name: "Progress",
                                        value: formatPercentage(
                                            sprint?.progress
                                        ),
                                    },
                                ],
                            }}
                            title={sprint?.name ?? ""}
                        />
                    )}
                    <div>
                        <span>Description: {sprint?.description}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2 mt-4">
                        <h3 className="text-[22px] text-primary">Epics</h3>
                        <div className="flex gap-x-6">
                            <Searchbar
                                onChange={setSearchText}
                                onSearch={() =>
                                    query({ ...filters, name: searchText })
                                }
                            />
                            {hasAccess(permissions, ["add_issues"]) && (
                                <PrimaryButton
                                    onClick={() => {
                                        setOpenCreateEpic(true);
                                    }}
                                >
                                    New Epic
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
                                <TableHeadItem
                                    attribute="name"
                                    setFilters={setFilters}
                                >
                                    Name
                                </TableHeadItem>
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
                                    <td className="text-left">
                                        {epic.progress
                                            ? formatPercentage(epic.progress)
                                            : "0%"}
                                    </td>
                                    <td className="text-right">
                                        <div className="flex justify-end">
                                            {hasAccess(permissions, [
                                                "edit_issues",
                                                "delete_issues",
                                            ]) && (
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
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Paginator
                        show={paginationData.totalPages > 1 && epics.length > 0}
                        page={filters.page ?? 1}
                        totalPages={paginationData.totalPages}
                        onPageChange={(page: number) =>
                            setFilters({ ...filters, page })
                        }
                    />
                    {epics.length === 0 && (
                        <div className="text-[18px] h-[40px] w-full text-center mt-2">
                            {isLoading ? (
                                <LinearProgress />
                            ) : (
                                <div className="flex justify-center items-center">
                                    <p className="text-gray-500">
                                        There are no epics yet
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Page>
        </Sidebar>
    );
};

export default ProjectEpics;
