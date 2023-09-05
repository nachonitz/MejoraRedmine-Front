import { User } from "./user";

export interface Project {
  id: number;
  redmineId: number;
  identifier: string;
  name: string;
  description: string;
  is_public: boolean;
  status: number;
  created_on: Date;
  owner: User;
}
