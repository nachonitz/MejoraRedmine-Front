import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Epic } from "../../../api/models/epic";
import { Issue, IssueFilter } from "../../../api/models/issue";
import { Project } from "../../../api/models/project";
import { Release } from "../../../api/models/release";
import { Sprint } from "../../../api/models/sprint";
import { getEpicById } from "../../../api/services/epicsService";
import { deleteIssue, getIssues } from "../../../api/services/issuesService";
import CreateIssueDialog from "../../../components/Pages/Issues/CreateIssueDialog/CreateIssueDialog";
import EditIssueDialog from "../../../components/Pages/Issues/EditIssueDialog/EditIssueDialog";
import {
    getIssueIcon,
    getIssuePriorityColor,
} from "../../../utilities/utilities";
import AddButton from "../../../components/Shared/Buttons/AddButton";
import SettingsButton from "../../../components/Shared/Buttons/SettingsButton";
import DeleteDialog from "../../../components/Shared/DeleteDialog/DeleteDialog";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import ProjectBreadcrumbs from "../../../components/Shared/ProjectBreadcrumbs/ProjectBreadcrumbs";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import { getMyPermissions } from "../../../api/services/membershipsService";
import { getFullDate, hasAccess } from "../../../lib/utils";
import { LinearProgress } from "@mui/material";
import { Searchbar } from "../../../components/Shared/Searchbar/Searchbar";
import PrimaryButton from "../../../components/Shared/Buttons/PrimaryButton";
import { IssueFiltersModal } from "../../../components/Pages/Issues/IssueFiltersModal";
import SecondaryButton from "../../../components/Shared/Buttons/SecondaryButton";
import InfoDialog from "../../../components/Shared/InfoDialog/InfoDialog";

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
                if (sprintId) {
                    setIsLoading(true);
                    const { data } = await getIssues({
                        ...filters,
                        sprintId: +sprintId,
                    });
                    setIsLoading(false);
                    setIssues(data.items);
                }
            } catch (error) {
                throw new Error("Error. Please try again.");
            }
        },
        [sprintId]
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
                            <EditIssueDialog
                                open={openEditIssue}
                                issueId={selectedIssue.id}
                                handleClose={handleCloseEditIssue}
                            />
                            <DeleteDialog
                                open={openDeleteIssue}
                                id={selectedIssue.id}
                                handleClose={handleCloseDeleteIssue}
                                deleteFunction={deleteIssue}
                                name={selectedIssue.subject}
                            />
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
                                <th className="text-left">Name</th>
                                <th className="text-left">Priority</th>
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
                                    <td
                                        style={{
                                            color: getIssuePriorityColor(
                                                issue.priority["name"]
                                            ),
                                        }}
                                        className="text-left"
                                    >
                                        {issue.priority["name"]}
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
                    {issues.length === 0 && (
                        <div className="text-[18px] h-[40px] w-full text-center mt-2">
                            {isLoading ? (
                                <LinearProgress />
                            ) : (
                                <span className="text-center">
                                    There are no issues yet.
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </Page>
        </Sidebar>
    );
};

export default ProjectIssues;
