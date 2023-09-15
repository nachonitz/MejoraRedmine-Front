import { EnumerationFilter } from "../api/models/enumeration";
import { EpicFilter } from "../api/models/epic";
import { IssueFilter } from "../api/models/issue";
import { ProjectMembershipFilter } from "../api/models/membership";
import { ProjectFilter } from "../api/models/project";
import { ReleaseFilter } from "../api/models/release";
import { RiskFilter } from "../api/models/risk";
import { SprintFilter } from "../api/models/sprint";
import { UserFilter } from "../api/models/user";

// Add all filters here
type Filters =
    | ProjectFilter
    | ReleaseFilter
    | SprintFilter
    | EpicFilter
    | RiskFilter
    | UserFilter
    | EnumerationFilter
    | ProjectMembershipFilter
    | IssueFilter;

export function filterToQueryParams(filter: Filters): string {
    const obj = {} as Record<keyof Filters, string>;

    Object.keys(filter).forEach(
        (k) =>
            (obj[k as keyof Filters] =
                filter[k as keyof Filters]?.toString() ?? "")
    );

    return new URLSearchParams(obj).toString();
}

export const getFullDate = (date: Date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};
