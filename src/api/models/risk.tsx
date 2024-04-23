import { PaginationFilters } from "./common";
import { Project } from "./project";

export enum RiskStatus {
    OPEN = "Open",
    CLOSED = "Closed",
}

export enum RiskEnumeration {
    LOW = "Low",
    MEDIUM = "Medium",
    HIGH = "High",
}

export enum RiskLevel {
    VERY_LOW = "Very Low",
    LOW = "Low",
    MEDIUM = "Medium",
    HIGH = "High",
    VERY_HIGH = "Very High",
}

export const RISK_COLOR: Record<RiskLevel, string> = {
    [RiskLevel.VERY_LOW]: "#95d9c1",
    [RiskLevel.LOW]: "#B5EAD7",
    [RiskLevel.MEDIUM]: "#E2F0CB",
    [RiskLevel.HIGH]: "#FFB7B2",
    [RiskLevel.VERY_HIGH]: "#FF9AA2",
};

export interface BaseRisk {
    name: string;
    description?: string;
    probability: RiskEnumeration;
    impact: RiskEnumeration;
    status: RiskStatus;
}

export interface Risk extends BaseRisk {
    id: number;
    project: Project;
    createdAt: Date;
    updatedAt: Date;
    level: RiskLevel;
}

export interface CreateRiskDto extends BaseRisk {
    projectId: number;
}

export type UpdateRiskDto = Partial<CreateRiskDto>;

type AscDesc = "asc" | "desc";
type FilterOrder = `${string}:${AscDesc}`;

export interface RiskFilter extends PaginationFilters {
    name?: string;
    probability?: RiskEnumeration;
    impact?: RiskEnumeration;
    status?: RiskStatus;
    level?: RiskLevel;
    projectId?: number;
    order?: FilterOrder;
}
