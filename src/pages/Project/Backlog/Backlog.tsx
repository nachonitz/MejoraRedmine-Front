import { Box, LinearProgress, Tab, Tabs } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Epic, EpicFilter } from "../../../api/models/epic";
import { Issue, IssueFilter, IssueStatus } from "../../../api/models/issue";
import { deleteEpic, getEpics } from "../../../api/services/epicsService";
import {
    deleteIssue,
    getIssues,
    getIssuesStatuses,
} from "../../../api/services/issuesService";
import { BacklogFiltersModal } from "../../../components/Pages/Backlog/BacklogFiltersModal";
import Board from "../../../components/Pages/Backlog/Board/Board";
import List from "../../../components/Pages/Backlog/List/List";
import EditEpicDialog from "../../../components/Pages/Epics/EditEpicDialog/EditEpicDialog";
import CreateIssueDialog from "../../../components/Pages/Issues/CreateIssueDialog/CreateIssueDialog";
import EditIssueDialog from "../../../components/Pages/Issues/EditIssueDialog/EditIssueDialog";
import SecondaryButton from "../../../components/Shared/Buttons/SecondaryButton";
import DeleteDialog from "../../../components/Shared/DeleteDialog/DeleteDialog";
import InfoDialog from "../../../components/Shared/InfoDialog/InfoDialog";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import { Searchbar } from "../../../components/Shared/Searchbar/Searchbar";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import { BacklogContext } from "../../../context/BacklogContext";
import { getIssueProperties } from "../../../utilities/utilities";
import { getProjectById } from "../../../api/services/projectsService";

export type Column = {
    [name: string]: Issue[];
};

const defaultFilters: IssueFilter & EpicFilter = {
    page: 1,
    limit: 500,
};

const Backlog = () => {
    const { projectId } = useParams();
    const [statuses, setStatuses] = useState<IssueStatus[]>([]);
    const [selectedEpic, setSelectedEpic] = useState<Epic>();
    const [selectedIssue, setSelectedIssue] = useState<Issue>();

    const [openInfoIssue, setOpenInfoIssue] = useState(false);
    const [openCreateIssue, setOpenCreateIssue] = useState(false);
    const [openEditEpic, setOpenEditEpic] = useState(false);
    const [openDeleteEpic, setOpenDeleteEpic] = useState(false);
    const [openEditIssue, setOpenEditIssue] = useState(false);
    const [openDeleteIssue, setOpenDeleteIssue] = useState(false);
    const [openBacklogFiltersModal, setOpenBacklogFiltersModal] =
        useState(false);

    const [searchText, setSearchText] = useState<string>("");
    const [filters, setFilters] = useState<IssueFilter & EpicFilter>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [issuesAndEpics, setIssuesAndEpics] = useState<{
        allIssues: Issue[];
        issuesWithoutEpic: Issue[];
        epics: Epic[];
    }>({
        allIssues: [],
        issuesWithoutEpic: [],
        epics: [],
    });

    const [tab, setTab] = useState<string>("kanban");

    const handleIssueStatusChanged = (issue: Issue) => {
        setIssuesAndEpics(
            (prev: {
                allIssues: Issue[];
                issuesWithoutEpic: Issue[];
                epics: Epic[];
            }) => {
                const allIssues = prev.allIssues.map((prevIssue) =>
                    prevIssue.id === issue.id ? issue : prevIssue
                );
                const issuesWithoutEpic = prev.issuesWithoutEpic.map(
                    (prevIssue) =>
                        prevIssue.id === issue.id ? issue : prevIssue
                );
                const epics = prev.epics.map((epic) => {
                    epic.issues = epic.issues?.map((epicIssue) =>
                        epicIssue.id === issue.id ? issue : epicIssue
                    );
                    return epic;
                });
                return {
                    allIssues,
                    issuesWithoutEpic,
                    epics: epics,
                };
            }
        );
    };

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    const setIssuesAndEpicsState = (issues: Issue[], epics: Epic[]) => {
        const issuesInEpics: Issue[] = [];
        issues.forEach((issue) => {
            if (issue.epic) {
                const epic = epics.find((epic) => epic.id === issue.epic?.id);
                if (epic) {
                    epic.issues?.push(issue);
                    issuesInEpics.push(issue);
                }
            }
        });
        const issuesWithoutEpic = issues.filter(
            (issue) => !issuesInEpics.includes(issue)
        );
        setIssuesAndEpics({
            allIssues: issues,
            issuesWithoutEpic: issuesWithoutEpic,
            epics: epics,
        });
    };

    const query = useCallback(
        async (filters: IssueFilter & EpicFilter) => {
            try {
                if (projectId) {
                    setIsLoading(true);
                    const { data: issues } = await getIssues({
                        ...(filters as IssueFilter),
                        projectId: parseInt(projectId),
                    });
                    const { data: epics } = await getEpics({
                        ...(filters as EpicFilter),
                        projectId: parseInt(projectId),
                    });
                    let epicsList = epics.items.map((epic) => {
                        epic.issues = [];
                        return epic;
                    });
                    setIssuesAndEpicsState(issues.items, epicsList);
                    setIsLoading(false);
                }
            } catch (error) {
                throw new Error("Error. Please try again.");
            }
        },
        [projectId]
    );

    const getAllIssuesStatuses = () => {
        getIssuesStatuses()
            .then((statuses: IssueStatus[]) => {
                setStatuses(statuses);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const setCurrentSprintId = async (projectId: string) => {
        const project = await getProjectById(+projectId);
        const sprintId = project.currentSprint?.id || defaultFilters.sprintId;
        setFilters({
            ...defaultFilters,
            sprintId,
        });
    };

    const handleOpenCreateIssue = (epic: Epic) => {
        setSelectedEpic(epic);
        console.log(epic);
        setOpenCreateIssue(true);
    };

    const handleOpenEditEpic = (epic: Epic) => {
        setSelectedEpic(epic);
        setOpenEditEpic(true);
    };

    const handleOpenDeleteEpic = (epic: Epic) => {
        setSelectedEpic(epic);
        setOpenDeleteEpic(true);
    };

    const handleOpenInfoIssue = (issue: Issue) => {
        setSelectedIssue(issue);
        setOpenInfoIssue(true);
    };

    const handleOpenEditIssue = (issue: Issue) => {
        setSelectedIssue(issue);
        setOpenEditIssue(true);
    };

    const handleOpenDeleteIssue = (issue: Issue) => {
        setSelectedIssue(issue);
        setOpenDeleteIssue(true);
    };

    const handleCloseDialog = (refresh?: boolean) => {
        setOpenCreateIssue(false);
        setOpenInfoIssue(false);
        setOpenEditEpic(false);
        setOpenDeleteEpic(false);
        setOpenEditIssue(false);
        setOpenDeleteIssue(false);
        if (refresh) {
            query(defaultFilters);
        }
        setSelectedEpic(undefined);
        setSelectedIssue(undefined);
    };

    const refresh = () => query(defaultFilters);

    useEffect(() => {
        getAllIssuesStatuses();
        // query(defaultFilters);
    }, [query]);

    useEffect(() => {
        if (filters) {
            query(filters);
        }
    }, [filters, query]);

    useEffect(() => {
        if (projectId) {
            setCurrentSprintId(projectId);
        }
    }, [projectId]);

    return (
        <Sidebar>
            <Page>
                {openBacklogFiltersModal && projectId && (
                    <BacklogFiltersModal
                        projectId={+projectId}
                        open={openBacklogFiltersModal}
                        onClose={() => setOpenBacklogFiltersModal(false)}
                        filters={filters || defaultFilters}
                        setFilters={setFilters}
                        onClearFilters={() => setFilters(defaultFilters)}
                    />
                )}
                {selectedEpic && projectId && (
                    <>
                        {openCreateIssue && (
                            <CreateIssueDialog
                                open={openCreateIssue}
                                epicId={selectedEpic.id?.toString()}
                                projectId={projectId}
                                releaseId={
                                    selectedEpic?.release?.id?.toString() || ""
                                }
                                sprintId={
                                    selectedEpic?.sprint?.id?.toString() || ""
                                }
                                handleClose={handleCloseDialog}
                            />
                        )}
                        {openEditEpic && (
                            <EditEpicDialog
                                open={openEditEpic}
                                epicId={selectedEpic.id}
                                handleClose={handleCloseDialog}
                                projectId={parseInt(projectId)}
                            />
                        )}
                        {openDeleteEpic && (
                            <DeleteDialog
                                open={openDeleteEpic}
                                id={selectedEpic.id}
                                handleClose={handleCloseDialog}
                                deleteFunction={deleteEpic}
                                name={selectedEpic.name}
                            />
                        )}
                    </>
                )}
                {selectedIssue && (
                    <>
                        {openInfoIssue && (
                            <InfoDialog
                                name={selectedIssue?.subject}
                                properties={getIssueProperties(selectedIssue)}
                                open={openInfoIssue}
                                handleClose={handleCloseDialog}
                            />
                        )}
                        {openEditIssue && (
                            <EditIssueDialog
                                open={openEditIssue}
                                issueId={selectedIssue?.id}
                                projectId={selectedIssue?.project.id}
                                handleClose={handleCloseDialog}
                            />
                        )}
                        {openDeleteIssue && (
                            <DeleteDialog
                                open={openDeleteIssue}
                                id={selectedIssue?.id}
                                handleClose={handleCloseDialog}
                                deleteFunction={deleteIssue}
                                name={selectedIssue?.subject}
                            />
                        )}
                    </>
                )}
                <div className="flex justify-between items-center">
                    <PageTitle title="Backlog" />
                    <div className="flex gap-x-6">
                        <SecondaryButton
                            onClick={() => setOpenBacklogFiltersModal(true)}
                        >
                            Filters
                        </SecondaryButton>
                        <Searchbar
                            onChange={setSearchText}
                            onSearch={() =>
                                query({
                                    ...filters,
                                    subject: searchText,
                                    name: searchText,
                                })
                            }
                        />
                    </div>
                </div>
                <div className="mt-[20px] w-full">
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                            value={tab}
                            onChange={handleChange}
                            textColor="primary"
                            indicatorColor="primary"
                            aria-label="secondary tabs example"
                        >
                            <Tab value="kanban" label="Kanban"></Tab>
                            <Tab value="list" label="List"></Tab>
                        </Tabs>
                    </Box>
                </div>
                <BacklogContext.Provider
                    value={{
                        handleOpenInfoIssue,
                        handleOpenEditIssue,
                        handleOpenDeleteIssue,
                        handleOpenEditEpic,
                        handleOpenDeleteEpic,
                        handleOpenCreateIssue,
                    }}
                >
                    <div className="mt-[30px] mb-[10px]">
                        {isLoading && (
                            <div>
                                <LinearProgress />
                            </div>
                        )}
                        {!isLoading && (
                            <div>
                                <div hidden={tab !== "kanban"}>
                                    <Board
                                        issues={issuesAndEpics.allIssues}
                                        statuses={statuses}
                                        refresh={refresh}
                                        loading={false}
                                        handleIssueStatusChanged={
                                            handleIssueStatusChanged
                                        }
                                    />
                                </div>
                                <div hidden={tab !== "list"}>
                                    <List
                                        issues={
                                            issuesAndEpics.issuesWithoutEpic
                                        }
                                        epics={issuesAndEpics.epics}
                                        loading={false}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </BacklogContext.Provider>
            </Page>
        </Sidebar>
    );
};

export default Backlog;
