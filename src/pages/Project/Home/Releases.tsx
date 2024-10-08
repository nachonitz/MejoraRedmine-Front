import { LinearProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Project } from "../../../api/models/project";
import { Release, ReleaseFilter } from "../../../api/models/release";
import { getMyPermissions } from "../../../api/services/membershipsService";
import { getProjectById } from "../../../api/services/projectsService";
import {
    deleteRelease,
    getReleases,
} from "../../../api/services/releasesService";
import CreateReleaseDialog from "../../../components/Pages/Releases/CreateReleaseDialog/CreateReleaseDialog";
import EditReleaseDialog from "../../../components/Pages/Releases/EditReleaseDialog/EditReleaseDialog";
import PrimaryButton from "../../../components/Shared/Buttons/PrimaryButton";
import SettingsButton from "../../../components/Shared/Buttons/SettingsButton";
import DeleteDialog from "../../../components/Shared/DeleteDialog/DeleteDialog";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import ProjectBreadcrumbs from "../../../components/Shared/ProjectBreadcrumbs/ProjectBreadcrumbs";
import { Searchbar } from "../../../components/Shared/Searchbar/Searchbar";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import { formatPercentage, getFullDate, hasAccess } from "../../../lib/utils";
import { ReleaseFiltersModal } from "../../../components/Pages/Releases/ReleaseFiltersModal";
import SecondaryButton from "../../../components/Shared/Buttons/SecondaryButton";
import { Paginator } from "../../../components/Shared/Paginator/Paginator";
import { DEFAULT_PAGINATION_DATA } from "../../../utilities/constants";
import { ListedResponseMetadata } from "../../../api/models/common";
import { TableHeadItem } from "../../../components/Shared/Table/TableHeadItem";

const defaultFilters: ReleaseFilter = {
    page: 1,
    limit: 10,
};

const ProjectReleases = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project>();
    const [releases, setReleases] = useState<Release[]>([]);
    const [openCreateRelease, setOpenCreateRelease] = useState(false);
    const [openEditRelease, setOpenEditRelease] = useState(false);
    const [openDeleteRelease, setOpenDeleteRelease] = useState(false);
    const [openReleaseFiltersModal, setOpenReleaseFiltersModal] =
        useState(false);
    const [selectedRelease, setSelectedRelease] = useState<Release>();
    const [permissions, setPermissions] = useState<string[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<ReleaseFilter>(defaultFilters);
    const [paginationData, setPaginationData] =
        useState<ListedResponseMetadata>(DEFAULT_PAGINATION_DATA);

    const getProject = useCallback(async () => {
        try {
            if (projectId) {
                const project = await getProjectById(+projectId);
                setProject(project);
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    }, [projectId]);

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
        async (filters: ReleaseFilter) => {
            try {
                if (projectId) {
                    setIsLoading(true);
                    const { data } = await getReleases({
                        ...filters,
                        projectId: +projectId,
                    });
                    setIsLoading(false);
                    setReleases(data.items);
                    setPaginationData(data.meta);
                }
            } catch (error) {
                throw new Error("Error. Please try again.");
            }
        },
        [projectId]
    );

    const goToRelease = (releaseId: number) => {
        navigate(`/project/${projectId}/overview/release/${releaseId}`);
    };

    const handleCloseCreateRelease = (refresh?: boolean) => {
        setOpenCreateRelease(false);
        if (refresh) {
            query(defaultFilters);
        }
    };

    const handleCloseEditRelease = (refresh?: boolean) => {
        setOpenEditRelease(false);
        if (refresh) {
            query(defaultFilters);
        }
        setSelectedRelease(undefined);
    };

    const handleCloseDeleteRelease = (refresh?: boolean) => {
        setOpenDeleteRelease(false);
        if (refresh) {
            query(defaultFilters);
        }
        setSelectedRelease(undefined);
    };

    useEffect(() => {
        query(defaultFilters);
        getProject();
        getUserPermissions();
    }, [getProject, getUserPermissions, query]);

    useEffect(() => {
        query(filters);
    }, [filters, query]);

    return (
        <Sidebar>
            <Page>
                <ProjectBreadcrumbs project={project} />
                {openReleaseFiltersModal && (
                    <ReleaseFiltersModal
                        open={openReleaseFiltersModal}
                        onClose={() => setOpenReleaseFiltersModal(false)}
                        filters={filters}
                        setFilters={setFilters}
                        onClearFilters={() => setFilters(defaultFilters)}
                    />
                )}
                {projectId && (
                    <>
                        {hasAccess(permissions, ["add_issues"]) && (
                            <CreateReleaseDialog
                                projectId={+projectId}
                                open={openCreateRelease}
                                handleClose={handleCloseCreateRelease}
                            />
                        )}
                        {selectedRelease &&
                            hasAccess(permissions, [
                                "edit_issues",
                                "delete_issues",
                            ]) && (
                                <>
                                    <EditReleaseDialog
                                        open={openEditRelease}
                                        releaseId={selectedRelease?.id}
                                        handleClose={handleCloseEditRelease}
                                    />
                                    <DeleteDialog
                                        open={openDeleteRelease}
                                        id={selectedRelease?.id}
                                        handleClose={handleCloseDeleteRelease}
                                        deleteFunction={deleteRelease}
                                        name={selectedRelease?.name}
                                    />
                                </>
                            )}
                    </>
                )}
                <div className="flex flex-col">
                    {project && (
                        <PageTitle
                            dialogInfo={{
                                name: project?.name,
                                properties: [
                                    {
                                        name: "Description",
                                        value: project?.description,
                                    },
                                    {
                                        name: "Identifier",
                                        value: project?.identifier,
                                    },
                                    project?.createdAt && {
                                        name: "Created",
                                        value: getFullDate(project?.createdAt),
                                    },
                                ],
                            }}
                            title={project?.name ?? ""}
                        />
                    )}
                    <div>
                        <span className="text-description">
                            {project?.description &&
                                "Description: " + project?.description}
                        </span>
                    </div>
                    <div className="flex justify-between items-center mb-2 mt-4">
                        <h3 className="text-[22px] text-primary">Releases</h3>
                        <div className="flex gap-x-6">
                            <SecondaryButton
                                onClick={() => setOpenReleaseFiltersModal(true)}
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
                                        setOpenCreateRelease(true);
                                    }}
                                >
                                    New Release
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
                                <TableHeadItem
                                    attribute="startDate"
                                    setFilters={setFilters}
                                >
                                    Start date
                                </TableHeadItem>
                                <TableHeadItem
                                    attribute="endDate"
                                    setFilters={setFilters}
                                >
                                    End date
                                </TableHeadItem>
                                <th className="text-left">Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {releases.map((release: Release) => (
                                <tr
                                    key={release.id}
                                    onClick={() => {
                                        goToRelease(release.id);
                                    }}
                                    className="text-[18px] h-[40px] cursor-pointer hover:bg-gray-50"
                                >
                                    <td className="w-[30px]">
                                        <img
                                            className="w-[24px] h-[24px]"
                                            src={
                                                "/assets/icons/release-icon.png"
                                            }
                                        />
                                    </td>
                                    <td className="gap-[10px] text-left">
                                        {release.name}
                                    </td>
                                    <td className="text-left">
                                        {getFullDate(release.startDate)}
                                    </td>
                                    <td className="text-left">
                                        {getFullDate(release.endDate)}
                                    </td>
                                    <td className="text-left">
                                        {formatPercentage(release.progress)}
                                    </td>
                                    <td className="text-right">
                                        <div className="flex justify-end">
                                            {hasAccess(permissions, [
                                                "edit_issues",
                                                "delete_issues",
                                            ]) && (
                                                <SettingsButton
                                                    onEdit={() => {
                                                        setSelectedRelease(
                                                            release
                                                        );
                                                        setOpenEditRelease(
                                                            true
                                                        );
                                                    }}
                                                    onDelete={() => {
                                                        setSelectedRelease(
                                                            release
                                                        );
                                                        setOpenDeleteRelease(
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
                    <Paginator
                        show={
                            paginationData.totalPages > 1 && releases.length > 0
                        }
                        page={filters.page ?? 1}
                        totalPages={paginationData.totalPages}
                        onPageChange={(page: number) =>
                            setFilters({ ...filters, page })
                        }
                    />
                    {releases.length === 0 && (
                        <div className="text-[18px] h-[40px] w-full text-center mt-2">
                            {isLoading ? (
                                <LinearProgress />
                            ) : (
                                <div className="flex justify-center items-center">
                                    <p className="text-gray-500">
                                        There are no releases yet
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

export default ProjectReleases;
