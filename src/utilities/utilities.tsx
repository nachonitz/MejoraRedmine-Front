export const getIssueIcon = (issueType: string) => {
    switch (issueType) {
        case "Bug":
            return "/src/assets/icons/bug-icon.png";
        case "Feature":
            return "/src/assets/icons/user-story-icon.png";
        case "Task":
            return "/src/assets/icons/user-story-icon.png";
    }
};

export const getIssuePriorityColor = (issuePriority: string) => {
    switch (issuePriority) {
        case "Low":
            return "#43B000";
        case "Normal":
            return "#FFAA04";
        case "High":
            return "#E80000";
        case "Urgent":
            return "#B90000";
        case "Immediate":
            return "#890000";
    }
}