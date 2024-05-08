import { LinearProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ListedResponseMetadata } from "../../../api/models/common";
import { Epic } from "../../../api/models/epic";
import { Issue, IssueFilter } from "../../../api/models/issue";
import { getEpicById } from "../../../api/services/epicsService";
import { deleteIssue, getIssues } from "../../../api/services/issuesService";
import { getMyPermissions } from "../../../api/services/membershipsService";
import CreateIssueDialog from "../../../components/Pages/Issues/CreateIssueDialog/CreateIssueDialog";
import EditIssueDialog from "../../../components/Pages/Issues/EditIssueDialog/EditIssueDialog";
import { IssueFiltersModal } from "../../../components/Pages/Issues/IssueFiltersModal";
import AssignedCircle from "../../../components/Shared/AssignedCircle/AssignedCircle";
import PrimaryButton from "../../../components/Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Shared/Buttons/SecondaryButton";
import SettingsButton from "../../../components/Shared/Buttons/SettingsButton";
import DeleteDialog from "../../../components/Shared/DeleteDialog/DeleteDialog";
import InfoDialog from "../../../components/Shared/InfoDialog/InfoDialog";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import { Paginator } from "../../../components/Shared/Paginator/Paginator";
import ProjectBreadcrumbs from "../../../components/Shared/ProjectBreadcrumbs/ProjectBreadcrumbs";
import { Searchbar } from "../../../components/Shared/Searchbar/Searchbar";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import { TableHeadItem } from "../../../components/Shared/Table/TableHeadItem";
import { formatPercentage, getFullDate, hasAccess } from "../../../lib/utils";
import { DEFAULT_PAGINATION_DATA } from "../../../utilities/constants";
import { getIssueIcon } from "../../../utilities/utilities";

const defaultFilters: IssueFilter = {
    page: 1,
    limit: 10,
};

const ProjectIssues = () => {
    const { projectId, releaseId, sprintId, epicId } = useParams();
    const [epic, setEpic] = useState<Epic>();
    const [issues, setIssues] = useState<Issue[]>([]);
    const [openInfoIssue, setOpenInfoIssue] = useState(false);
    const [openCreateIssue, setOpenCreateIssue] = useState(false);
    const [openEditIssue, setOpenEditIssue] = useState(false);
    const [openDeleteIssue, setOpenDeleteIssue] = useState(false);
    const [openIssueFiltersModal, setOpenIssueFiltersModal] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<Issue>();
    const [permissions, setPermissions] = useState<string[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<IssueFilter>(defaultFilters);
    const [paginationData, setPaginationData] =
        useState<ListedResponseMetadata>(DEFAULT_PAGINATION_DATA);

    const getEpic = async () => {
        try {
            if (epicId) {
                const epic = await getEpicById(parseInt(epicId));
                setEpic(epic);
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    };

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
        async (filters: IssueFilter) => {
            try {
                if (epicId) {
                    setIsLoading(true);
                    const { data } = await getIssues({
                        ...filters,
                        epicId: +epicId,
                    });
                    setIsLoading(false);
                    setIssues(data.items);
                    setPaginationData(data.meta);
                }
            } catch (error) {
                throw new Error("Error. Please try again.");
            }
        },
        [epicId]
    );

    const goToIssue = (issue: Issue) => {
        setSelectedIssue(issue);
        setOpenInfoIssue(true);
    };

    const handleCloseInfoIssue = () => {
        setOpenInfoIssue(false);
        setSelectedIssue(undefined);
    };

    const handleCloseCreateIssue = (refresh?: boolean) => {
        setOpenCreateIssue(false);
        if (refresh) {
            query(defaultFilters);
        }
    };

    const handleCloseEditIssue = (refresh?: boolean) => {
        setOpenEditIssue(false);
        if (refresh) {
            query(defaultFilters);
        }
        setSelectedIssue(undefined);
    };

    const handleCloseDeleteIssue = (refresh?: boolean) => {
        setOpenDeleteIssue(false);
        if (refresh) {
            query(defaultFilters);
        }
        setSelectedIssue(undefined);
    };

    useEffect(() => {
        query(filters);
    }, [filters, query]);

    useEffect(() => {
        getEpic();
        query(defaultFilters);
        getUserPermissions();
    }, [getUserPermissions, defaultFilters, query]);

    return (
        <Sidebar>
            <Page>
                <ProjectBreadcrumbs
                    project={epic?.project}
                    release={epic?.release}
                    sprint={epic?.sprint}
                    epic={epic}
                />
                {openIssueFiltersModal && (
                    <IssueFiltersModal
                        open={openIssueFiltersModal}
                        onClose={() => setOpenIssueFiltersModal(false)}
                        filters={filters}
                        setFilters={setFilters}
                        onClearFilters={() => setFilters(defaultFilters)}
                    />
                )}
                {epicId &&
                    projectId &&
                    releaseId &&
                    sprintId &&
                    hasAccess(permissions, ["add_issues"]) && (
                        <CreateIssueDialog
                            projectId={projectId}
                            releaseId={releaseId}
                            sprintId={sprintId}
                            epicId={epicId}
                            open={openCreateIssue}
                            handleClose={handleCloseCreateIssue}
                        />
                    )}
                {selectedIssue && openInfoIssue && (
                    <InfoDialog
                        name={selectedIssue?.subject}
                        properties={[
                            {
                                name: "Description",
                                value: selectedIssue?.description,
                            },
                            {
                                name: "Priority",
                                value: selectedIssue?.priority?.name,
                            },
                            {
                                name: "Status",
                                value: selectedIssue?.status?.name,
                            },
                            {
                                name: "Tracker",
                                value: selectedIssue?.tracker?.name,
                            },
                            {
                                name: "Assignee",
                                value: `${selectedIssue?.assignee?.firstname} ${selectedIssue?.assignee?.lastname}`,
                            },
                            {
                                name: "Estimation",
                                value: selectedIssue?.estimation,
                            },
                            {
                                name: "Created",
                                value: getFullDate(selectedIssue?.createdAt),
                            },
                        ]}
                        open={openInfoIssue}
                        handleClose={handleCloseInfoIssue}
                    />
                )}
                {selectedIssue &&
                    hasAccess(permissions, [
                        "edit_issues",
                        "delete_issues",
                    ]) && (
                        <>
                            {openEditIssue && (
                                <EditIssueDialog
                                    open={openEditIssue}
                                    issueId={selectedIssue.id}
                                    projectId={selectedIssue.project.id}
                                    handleClose={handleCloseEditIssue}
                                />
                            )}
                            {openDeleteIssue && (
                                <DeleteDialog
                                    open={openDeleteIssue}
                                    id={selectedIssue.id}
                                    handleClose={handleCloseDeleteIssue}
                                    deleteFunction={deleteIssue}
                                    name={selectedIssue.subject}
                                />
                            )}
                        </>
                    )}
                <div className="flex flex-col">
                    {epic && (
                        <PageTitle
                            dialogInfo={{
                                name: epic?.name,
                                properties: [
                                    {
                                        name: "Description",
                                        value: epic?.description,
                                    },
                                    {
                                        name: "Priority",
                                        value: epic?.priority.name,
                                    },
                                    {
                                        name: "Progress",
                                        value: epic?.progress
                                            ? formatPercentage(epic?.progress)
                                            : "0%",
                                    },
                                ],
                            }}
                            title={epic?.name ?? ""}
                        />
                    )}
                    <div>
                        <span>Description: {epic?.description}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2 mt-4">
                        <h3 className="text-[22px] text-primary">Issues</h3>
                        <div className="flex gap-x-6">
                            <SecondaryButton
                                onClick={() => setOpenIssueFiltersModal(true)}
                            >
                                Filters
                            </SecondaryButton>
                            <Searchbar
                                onChange={setSearchText}
                                onSearch={() =>
                                    query({
                                        ...filters,
                                        subject: searchText,
                                    })
                                }
                            />
                            {hasAccess(permissions, ["add_issues"]) && (
                                <PrimaryButton
                                    onClick={() => {
                                        setOpenCreateIssue(true);
                                    }}
                                >
                                    New Issue
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
                                    attribute="subject"
                                    setFilters={setFilters}
                                >
                                    Name
                                </TableHeadItem>
                                <th className="text-left">Status</th>
                                <th className="text-left">Priority</th>
                                <th className="text-left">Assigned to</th>
                            </tr>
                        </thead>
                        <tbody>
                            {issues.map((issue: Issue) => (
                                <tr
                                    key={issue.id}
                                    onClick={() => {
                                        goToIssue(issue);
                                    }}
                                    className="text-[18px] h-[40px] cursor-pointer hover:bg-gray-50"
                                >
                                    <td className="w-[30px]">
                                        <img
                                            className="w-[24px] h-[24px]"
                                            src={getIssueIcon(
                                                issue.tracker.name
                                            )}
                                        />
                                    </td>
                                    <td className="gap-[10px] text-left">
                                        {issue.subject}
                                    </td>
                                    <td>{issue.status.name}</td>
                                    <td className="text-left">
                                        {issue.priority["name"]}
                                    </td>
                                    <td>
                                        {issue.assignee && (
                                            <AssignedCircle
                                                firstname={
                                                    issue.assignee?.firstname
                                                }
                                                lastname={
                                                    issue.assignee?.lastname
                                                }
                                            />
                                        )}
                                    </td>
                                    <td className="text-right">
                                        <div className="flex justify-end">
                                            {hasAccess(permissions, [
                                                "edit_issues",
                                                "delete_issues",
                                            ]) && (
                                                <SettingsButton
                                                    onEdit={() => {
                                                        setSelectedIssue(issue);
                                                        setOpenEditIssue(true);
                                                    }}
                                                    onDelete={() => {
                                                        setSelectedIssue(issue);
                                                        setOpenDeleteIssue(
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
                            paginationData.totalPages > 1 && issues.length > 0
                        }
                        page={filters.page ?? 1}
                        totalPages={paginationData.totalPages}
                        onPageChange={(page: number) =>
                            setFilters({ ...filters, page })
                        }
                    />
                    {issues.length === 0 && (
                        <div className="text-[18px] h-[40px] w-full text-center mt-2">
                            {isLoading ? (
                                <LinearProgress />
                            ) : (
                                <div className="flex justify-center items-center">
                                    <p className="text-gray-500">
                                        There are no issues yet
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

export default ProjectIssues;
