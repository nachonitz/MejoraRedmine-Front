import { Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Epic } from "../../../api/models/epic";
import { Issue, IssueStatus } from "../../../api/models/issue";
import { deleteEpic, getEpics } from "../../../api/services/epicsService";
import {
    deleteIssue,
    getIssues,
    getIssuesStatuses,
} from "../../../api/services/issuesService";
import Board from "../../../components/Pages/Backlog/Board/Board";
import List from "../../../components/Pages/Backlog/List/List";
import EditEpicDialog from "../../../components/Pages/Epics/EditEpicDialog/EditEpicDialog";
import EditIssueDialog from "../../../components/Pages/Issues/EditIssueDialog/EditIssueDialog";
import DeleteDialog from "../../../components/Shared/DeleteDialog/DeleteDialog";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import { BacklogContext } from "../../../context/BacklogContext";
import InfoDialog from "../../../components/Shared/InfoDialog/InfoDialog";
import { getFullDate } from "../../../lib/utils";
import { getIssueProperties } from "../../../utilities/utilities";

export type Column = {
    [name: string]: Issue[];
};

const Backlog = () => {
    const { projectId } = useParams();
    const [statuses, setStatuses] = useState<IssueStatus[]>([]);
    const [selectedEpic, setSelectedEpic] = useState<Epic>();
    const [selectedIssue, setSelectedIssue] = useState<Issue>();

    const [openInfoIssue, setOpenInfoIssue] = useState(false);
    const [openEditEpic, setOpenEditEpic] = useState(false);
    const [openDeleteEpic, setOpenDeleteEpic] = useState(false);
    const [openEditIssue, setOpenEditIssue] = useState(false);
    const [openDeleteIssue, setOpenDeleteIssue] = useState(false);

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

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    useEffect(() => {
        getAllIssuesStatuses();
        getIssuesAndEpics();
    }, []);

    const getIssuesAndEpics = async () => {
        try {
            if (projectId) {
                const { data: issues } = await getIssues({
                    projectId: parseInt(projectId),
                });
                const { data: epics } = await getEpics({
                    projectId: parseInt(projectId),
                });

                const issuesInEpics: Issue[] = [];

                issues.items.forEach((issue) => {
                    if (issue.epic) {
                        const epic = epics.items.find(
                            (epic) => epic.id === issue.epic?.id
                        );
                        if (epic) {
                            epic.issues?.push(issue);
                            issuesInEpics.push(issue);
                        }
                    }
                });

                const issuesWithoutEpic = issues.items.filter(
                    (issue) => !issuesInEpics.includes(issue)
                );

                setIssuesAndEpics({
                    allIssues: issues.items,
                    issuesWithoutEpic: issuesWithoutEpic,
                    epics: epics.items,
                });
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    };

    const getAllIssuesStatuses = () => {
        getIssuesStatuses()
            .then((statuses: IssueStatus[]) => {
                setStatuses(statuses);
            })
            .catch((error) => {
                console.log(error);
            });
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
        setOpenInfoIssue(false);
        setOpenEditEpic(false);
        setOpenDeleteEpic(false);
        setOpenEditIssue(false);
        setOpenDeleteIssue(false);
        if (refresh) {
            getIssuesAndEpics();
        }
        setSelectedEpic(undefined);
        setSelectedIssue(undefined);
    };

    return (
        <Sidebar>
            <Page>
                {selectedEpic && (
                    <>
                        <EditEpicDialog
                            open={openEditEpic}
                            epicId={selectedEpic.id}
                            handleClose={handleCloseDialog}
                        />
                        <DeleteDialog
                            open={openDeleteEpic}
                            id={selectedEpic.id}
                            handleClose={handleCloseDialog}
                            deleteFunction={deleteEpic}
                            name={selectedEpic.name}
                        />
                    </>
                )}
                {selectedIssue && (
                    <>
                        <InfoDialog
                            name={selectedIssue?.subject}
                            properties={getIssueProperties(selectedIssue)}
                            open={openInfoIssue}
                            handleClose={handleCloseDialog}
                        />
                        <EditIssueDialog
                            open={openEditIssue}
                            issueId={selectedIssue?.id}
                            handleClose={handleCloseDialog}
                        />
                        <DeleteDialog
                            open={openDeleteIssue}
                            id={selectedIssue?.id}
                            handleClose={handleCloseDialog}
                            deleteFunction={deleteIssue}
                            name={selectedIssue?.subject}
                        />
                    </>
                )}
                <PageTitle title="Backlog" />
                <div className="mt-[30px]">
                    <Tabs
                        value={tab}
                        onChange={handleChange}
                        textColor="primary"
                        indicatorColor="primary"
                        aria-label="secondary tabs example"
                    >
                        <Tab disableRipple value="kanban" label="Kanban"></Tab>
                        <Tab disableRipple value="list" label="List"></Tab>
                    </Tabs>
                </div>
                <BacklogContext.Provider
                    value={{
                        handleOpenInfoIssue,
                        handleOpenEditIssue,
                        handleOpenDeleteIssue,
                        handleOpenEditEpic,
                        handleOpenDeleteEpic,
                    }}
                >
                    <div className="mt-[30px] mb-[10px]">
                        <div hidden={tab !== "kanban"}>
                            <Board
                                issues={issuesAndEpics.allIssues}
                                statuses={statuses}
                                getIssues={getIssuesAndEpics}
                            />
                        </div>
                        <div hidden={tab !== "list"}>
                            <List
                                issues={issuesAndEpics.issuesWithoutEpic}
                                epics={issuesAndEpics.epics}
                            />
                        </div>
                    </div>
                </BacklogContext.Provider>
            </Page>
        </Sidebar>
    );
};

export default Backlog;
