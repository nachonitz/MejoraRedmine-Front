export interface Risk {
    id: number;
    name: string;
    probability: string;
    impact: string;
    status: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    level: string;
}