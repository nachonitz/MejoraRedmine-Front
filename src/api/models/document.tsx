import { User } from "./user";

export interface Document {
    id: number;
    filesize: number;
    filename: string;
    type: string;
    title: string;
    content_url: string;
    created_on: Date;
    author: User;
    tags: string[];
}