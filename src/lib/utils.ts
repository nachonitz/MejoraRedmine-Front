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

/**
 * Returns true if the user has access to all of the required permissions or if the
 * user is an admin. Gets the current user from local storage.
 */
export const hasAccess = (
    userPermissions: string[],
    requiredPermissions: string[]
) => {
    const currentUser = JSON.parse(localStorage.getItem("user") ?? "");
    if (!currentUser) return false;
    if (currentUser.admin) return true;
    return requiredPermissions.every((permission) =>
        userPermissions.includes(permission)
    );
};

export const hasAdminAccess = () => {
    const currentUser = JSON.parse(localStorage.getItem("user") ?? "");
    if (!currentUser) return false;
    return currentUser.admin;
};
