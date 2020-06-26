import { Collection, ObjectId } from 'mongodb';

//describes the  mongodb schema
export enum ListingType {
  Study = "STUDY",
  Work = "WORK",
  Hobbie = "HOBBIE",
  ANY = "ANY"
}

export interface ITimer {
  _id: ObjectId,
  start: number,
  end: number | null,
  title: string,
  project_id: ObjectId | null,
  type: ListingType | string,
  description: string,
  notes: string,
  isRunning: boolean,
}

export interface IProject {
  _id: ObjectId,
  title: string,
  info: string
}

export interface IDatabase {
  timers: Collection<ITimer>;
  projects: Collection<IProject>
}