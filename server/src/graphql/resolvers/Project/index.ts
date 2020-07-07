// import { timers } from '../../../timers'
import { IResolvers } from "apollo-server-express";
import { IDatabase, IProject } from "../../../lib/types";
import { ObjectId } from "mongodb";
import {
  CreateProjectArgs,
  UpdateProjectArgs,
  DeleteProjectArgs,
} from "./types";

export const projectResolver: IResolvers = {
  Query: {
    projects: async (
      _root: undefined,
      _args: {},
      { db }: { db: IDatabase }
    ): Promise<IProject[]> => {
      const projects = await db.projects.find({}).toArray();
      if (!projects) {
        throw new Error("there are no projects yet");
      }
      return projects;
    },
  },
  Mutation: {
    createProject: async (
      _root: undefined,
      { title, description }: CreateProjectArgs,
      { db }: { db: IDatabase }
    ): Promise<IProject> => {
      try {
        const project = await db.projects.insertOne({
          _id: new ObjectId(),
          title: title,
          description,
        });

        const insertedProject: IProject = project.ops[0];

        if (!insertedProject) {
          throw new Error("failed create new project");
        }

        console.log("insertedProject", insertedProject);
        return insertedProject;
      } catch (error) {
        throw new Error(`couldnt create the project ${error}`);
      }
    },
    updateProject: async (
      _root: undefined,
      { id, title, description }: UpdateProjectArgs,
      { db }: { db: IDatabase }
    ): Promise<IProject> => {
      const updateProject = await db.projects.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { title, description } },
        { returnOriginal: false }
      );

      if (!updateProject.value) {
        throw new Error("Coudnt update the project");
      }
      return updateProject.value;
    },
    deleteProject: async (
      _root: undefined,
      { id }: DeleteProjectArgs,
      { db }: { db: IDatabase }
    ): Promise<IProject> => {
      //1.find connected timers with existed project
      //2.delete the project
      //3.clear the timers project_id field
      try {
        const bulkOpTimers = db.timers.initializeOrderedBulkOp();
        bulkOpTimers
          .find({ project_id: id })
          .update({ $set: { project_id: "" } });
        const timersUpdated = await bulkOpTimers.execute();

        if (!timersUpdated.ok) {
          throw new Error("couldnt update project_id in timers collection");
        }

        const deleteProject = await db.projects.findOneAndDelete({
          _id: new ObjectId(id),
        });

        if (!deleteProject.value) {
          throw new Error("failed to delete project");
        }

        console.log("deleteProject", deleteProject);
        return deleteProject.value;
      } catch (error) {
        throw new Error(`coudnt delete the project: ${error}`);
      }
    },
  },

  Project: {
    id: (project: IProject): string => {
      return project._id.toHexString();
    },
  },
};
