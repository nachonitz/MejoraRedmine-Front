import { Issue } from "../../../../api/models/issue";
import { Epic } from "../../../../api/models/epic";
import IssueCard from "./IssueCard/IssueCard";
import EpicCard from "./EpicCard/EpicCard";
import { LinearProgress } from "@mui/material";

interface ListProps {
    issues: Issue[];
    epics: Epic[];
    loading: boolean;
}

const List = ({ issues, epics, loading }: ListProps) => {
    return (
        <div className="w-full flex flex-col gap-[10px]">
            {loading ? (
                <LinearProgress />
            ) : (
                <>
                    {epics.map((epic) => (
                        <EpicCard key={epic.id} epic={epic} />
                    ))}
                    {issues.map((issue) => (
                        <IssueCard key={issue.id} issue={issue} />
                    ))}
                </>
            )}
        </div>
    );
};

export default List;
