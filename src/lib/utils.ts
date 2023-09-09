import { ProjectFilter } from "../api/models/project";

// Add all filters here
type Filters = ProjectFilter;

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
