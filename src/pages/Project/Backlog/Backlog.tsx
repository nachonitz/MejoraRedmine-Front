import { useParams } from "react-router-dom";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import { useEffect, useState } from "react";
import { Issue, IssueStatus } from "../../../api/models/issue";
import {
    getIssues,
    getIssuesStatuses,
} from "../../../api/services/issuesService";
import { Tab, Tabs } from "@mui/material";
import Board from "../../../components/Pages/Backlog/Board/Board";

export type Column = {
    [name: string]: Issue[];
};

const Backlog = () => {
    const { projectId } = useParams();
    const [issues, setIssues] = useState<Issue[]>([]);
    const [statuses, setStatuses] = useState<IssueStatus[]>([]);

    const [tab, setTab] = useState<string>("kanban");

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    useEffect(() => {
        getAllIssues();
        getAllIssuesStatuses();
    }, []);

    const getAllIssuesStatuses = () => {
        getIssuesStatuses()
            .then((statuses: IssueStatus[]) => {
                setStatuses(statuses);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getAllIssues = async () => {
        try {
            if (projectId) {
                const { data: issues } = await getIssues({
                    projectId: parseInt(projectId),
                });
                setIssues(issues.items);
                return issues;
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    };

    return (
        <Sidebar>
            <Page>
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
                <div className="mt-[30px] mb-[10px]">
                    <div hidden={tab !== "kanban"}>
                        <Board
                            issues={issues}
                            statuses={statuses}
                            getIssues={getAllIssues}
                        />
                    </div>
                </div>
            </Page>
        </Sidebar>
    );
};

export default Backlog;
