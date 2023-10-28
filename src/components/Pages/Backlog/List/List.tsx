import { Issue } from "../../../../api/models/issue";
import { Epic } from "../../../../api/models/epic";
import IssueCard from "./IssueCard/IssueCard";
import EpicCard from "./EpicCard/EpicCard";

interface ListProps {
    issues: Issue[];
    epics: Epic[];
}

const List: React.FC<ListProps> = ({ issues, epics }) => {
    return (
        <div className="w-full flex flex-col gap-[10px]">
            {epics.map((epic) => (
                <EpicCard key={epic.id} epic={epic} />
            ))}
            {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
            ))}
        </div>
    );
};

export default List;
