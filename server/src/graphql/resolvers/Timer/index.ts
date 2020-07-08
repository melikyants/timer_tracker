// import { timers } from '../../../timers'
import { IResolvers } from "apollo-server-express";
import { IDatabase, ITimer, IProject } from "../../../lib/types";
import { ObjectId } from "mongodb";
import {
  TimerArgs,
  CreateTimerArgs,
  StartTimerArgs,
  EndTimerArgs,
  UpdateTimerArgs,
  DeleteTimerArgs,
} from "./types";

export const timerResolvers: IResolvers = {
  Query: {
    timers: async (
      _root: undefined,
      _args: {},
      { db }: { db: IDatabase }
    ): Promise<ITimer[]> => {
      const timersList = await db.timers.find({}).toArray();

      if (!timersList) {
        throw new Error("there are no timers");
      }

      return timersList;
    },
    timer: async (
      _root: undefined,
      { id }: TimerArgs,
      { db }: { db: IDatabase }
    ): Promise<ITimer> => {
      const timerFetch = await db.timers.findOne({ _id: new ObjectId(id) });
      if (!timerFetch) {
        throw new Error("coudnt get the timer");
      }

      return timerFetch;
    },
  },
  Mutation: {
    createTimer: async (
      _root: undefined,
      { start, title }: CreateTimerArgs,
      { db }: { db: IDatabase }
    ): Promise<ITimer> => {
      const insertRes = await db.timers.insertOne({
        _id: new ObjectId(),
        start: start,
        title: title,
        project_id: null,
        end: null,
        type: "ANY",
        notes: "",
        isRunning: true,
      });
      const insertedTimer: ITimer = insertRes.ops[0];

      if (!insertedTimer) {
        throw new Error();
      }

      return insertedTimer;
    },
    startTimer: async (
      _root: undefined,
      { start, id }: StartTimerArgs,
      { db }: { db: IDatabase }
    ): Promise<ITimer> => {
      const getTimer = await db.timers.findOne({ _id: new ObjectId(id) });

      if (!getTimer) {
        throw new Error();
      }

      const insertRes = await db.timers.insertOne({
        _id: new ObjectId(),
        start: start,
        title: getTimer.title,
        project_id: getTimer.project_id,
        end: null,
        type: getTimer.type,
        notes: "",
        isRunning: true,
      });

      const insertedTimer: ITimer = insertRes.ops[0];

      if (!insertedTimer) {
        throw new Error();
      }

      return insertedTimer;
    },

    stopTimer: async (
      _root: undefined,
      { id, end }: EndTimerArgs,
      { db }: { db: IDatabase }
    ): Promise<ITimer> => {
      const stopTimer = await db.timers.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { end, isRunning: false } },
        { returnOriginal: false }
      );

      if (!stopTimer.value) {
        throw new Error("failed to stop timer");
      }

      return stopTimer.value;
    },

    updateTimer: async (
      _root: undefined,
      {
        id,
        title,
        project_id,
        start,
        end,
        project_description,
        notes,
        type,
      }: UpdateTimerArgs,
      { db }: { db: IDatabase }
    ): Promise<any> => {
      console.log("start", start);
      console.log("end", end);

      const updateTimer = await db.timers.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            title,
            start,
            end,
            project_id: project_id ? new ObjectId(project_id) : null,
            notes,
            type,
          },
        },
        { returnOriginal: false }
      );

      if (project_id) {
        const project = await db.projects.findOneAndUpdate(
          { _id: new ObjectId(project_id) },
          {
            $set: { description: project_description },
          },
          { returnOriginal: false }
        );

        if (!project.value) {
          throw new Error("failed to update project");
        }
      }

      if (!updateTimer.value) {
        throw new Error("failed to update timer");
      }

      return updateTimer.value;
    },
    deleteTimer: async (
      _root: undefined,
      { id }: DeleteTimerArgs,
      { db }: { db: IDatabase }
    ): Promise<ITimer> => {
      const deleteTimer = await db.timers.findOneAndDelete({
        _id: new ObjectId(id),
      });

      if (!deleteTimer.value) {
        throw new Error("failed to delete timer");
      }

      return deleteTimer.value;
    },
  },

  Timer: {
    id: (timer: ITimer): string => {
      return timer._id.toHexString();
    },
    project: async (
      timer: ITimer,
      _args: {},
      { db }: { db: IDatabase }
    ): Promise<IProject | null> => {
      try {
        if (timer.project_id) {
          const project = await db.projects.findOne({ _id: timer.project_id });

          return project;
        }
        return null;
      } catch (error) {
        throw new Error(`couldnt retrieve project: ${error}`);
      }
    },
  },
};
