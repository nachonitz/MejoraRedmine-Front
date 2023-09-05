import { Project } from "./project";
import { Release } from "./release";

export interface Sprint {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  release: Release;
  project: Project;
}
