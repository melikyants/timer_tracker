import { Collection, ObjectId } from 'mongodb';

export interface ITimer {
  _id: ObjectId,
  title: string,
  project_id: string,
  type: string,
  description: string,
  notes: string,
  start: number,
  end: number,
  isRunning: boolean
}

export interface ITimer_Projects {
  _id: ObjectId,
  title: string,
  info: string
}

export interface IDatabase {
  timers: Collection<ITimer>;
}