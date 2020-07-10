import { Collection, ObjectId } from "mongodb";

//describes the  mongodb schema
export enum ListingType {
  Study = "STUDY",
  Work = "WORK",
  Hobbie = "HOBBIE",
  PersonalProject = "PERSONAL_PROJECT",
  Any = "ANY",
}

export interface Viewer {
  _id?: string;
  avatar?: string;
  tokenGoogle?: string;
  didRequest: boolean;
  tokenUpwork?: string;
}

export interface ITimer {
  _id: ObjectId;
  start: number;
  end: number | null;
  title: string;
  project_id: ObjectId | null;
  type: ListingType | string;
  notes: string;
  isRunning: boolean;
}

export interface IProject {
  _id: ObjectId;
  title: string;
  description: string;
}

export interface User {
  _id: string;
  name: string;
  avatar: string;
  contact: string;
  tokenGoogle: string;
  tokenUpwork: string;
  tokenUpworkSecret: string;
  authorized?: boolean;
}

export interface IDatabase {
  timers: Collection<ITimer>;
  projects: Collection<IProject>;
  users: Collection<User>;
}
