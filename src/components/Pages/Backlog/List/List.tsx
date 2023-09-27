import { Issue } from "../../../../api/models/issue";
import { Epic } from "../../../../api/models/epic";
import IssueCard from "./IssueCard/IssueCard";
import EpicCard from "./EpicCard/EpicCard";

interface ListProps {
    issues: Issue[];
    epics: Epic[];
    getIssues: () => void;
}

const List: React.FC<ListProps> = ({ issues, epics, getIssues }) => {
    return (
        <div className="w-full flex flex-col gap-[10px]">
            {epics.map((epic) => (
                <EpicCard key={epic.id} epic={epic} getEpics={getIssues} />
            ))}
            {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} getIssues={getIssues} />
            ))}
        </div>
    );
};

export default List;
