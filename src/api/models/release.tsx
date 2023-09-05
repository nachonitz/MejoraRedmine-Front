import { Project } from "./project";

export interface Release {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  project: Project;
}
