// import { timers } from '../../../timers'
import { IResolvers } from 'apollo-server-express'
import { IDatabase, IProject } from '../../../lib/types'
import { ObjectId } from "mongodb";

export const projectResolver: IResolvers = {
  Query: {
    projects: async (_root: undefined, _args: {}, { db }: { db: IDatabase }): Promise<IProject[]> => {
      const projects = await db.projects.find({}).toArray()
      return projects
    }
  },
  Mutation: {
    createProject: async (_root: undefined, { timer_id, title, info }: { timer_id: string, title: string, info: string }, { db }: { db: IDatabase }): Promise<IProject> => {
      const project = await db.projects.insertOne({
        _id: new ObjectId(),
        title: title,
        info: info
      })

      const insertedProject: IProject = project.ops[0]

      if (!insertedProject) {
        throw new Error('failed create new project')
      }

      return insertedProject
    },
    updateProject: async (_root: undefined, { id, title, info }: { id: string, title: string, info: string }, { db }: { db: IDatabase }): Promise<any> => {
      const updateProject = await db.projects.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { title, info } }, { returnOriginal: false })

      if (!updateProject.ok) {
        throw new Error('Coudnt update the project')
      }
      return updateProject.value
    },
    deleteProject: async (_root: undefined, { id }: { id: string }, { db }: { db: IDatabase }): Promise<any> => {

      //1.find connected timers with existed project
      //2.delete the project
      //3.clear the timers project_id field
      const bulkOpTimers = db.timers.initializeOrderedBulkOp();
      bulkOpTimers.find({ project_id: id }).update({ $set: { project_id: '' } })
      const timersUpdated = await bulkOpTimers.execute();

      if (!timersUpdated.ok) {
        throw new Error('couldnt update project_id in timers collection')
      }

      const deleteProject = await db.projects.findOneAndDelete({ _id: new ObjectId(id) })

      if (!deleteProject.value) {
        throw new Error('failed to delete project')
      }

      return deleteProject.value
    }

  },

  Project: {
    id: (project: IProject): string => {
      return project._id.toHexString()
    }
  }

}