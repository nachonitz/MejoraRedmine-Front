import { createContext } from "react";
import { Issue } from "../api/models/issue";
import { Epic } from "../api/models/epic";

interface BacklogContextProps {
    handleOpenInfoIssue: (issue: Issue) => void;
    handleOpenEditIssue: (issue: Issue) => void;
    handleOpenDeleteIssue: (issue: Issue) => void;
    handleOpenEditEpic: (epic: Epic) => void;
    handleOpenDeleteEpic: (epic: Epic) => void;
}

export const BacklogContext = createContext({} as BacklogContextProps);
