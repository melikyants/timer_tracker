// import { timers } from '../../../timers'
import { IResolvers } from 'apollo-server-express'
import { IDatabase, ITimer } from '../../../lib/types'
import { ObjectId } from "mongodb";

export const timerResolvers: IResolvers = {
  Query: {
    timers: async (_root: undefined, _args: {}, { db }: { db: IDatabase }): Promise<ITimer[]> => {
      const timers = await db.timers.find({}).toArray()
      return timers
    }
  },
  Mutation: {
    startTimer: async (_root: undefined, { start, title, isRunning }: { start: number, title: string, isRunning: boolean }, { db }: { db: IDatabase }): Promise<ITimer> => {
      const insertRes = await db.timers.insertOne({
        _id: new ObjectId(),
        start: start,
        end: 0,
        title: title,
        project_id: "001",
        type: "study",
        description: "",
        notes: "",
        isRunning: true
      });
      if (!insertRes) {
        throw new Error()
      }

      const insertTimer: ITimer = insertRes.ops[0]

      if (!insertTimer) {
        throw new Error()
      }

      return insertTimer
    },
    stopTimer: async (_root: undefined, { id, end }: { id: string, end: number }, { db }: { db: IDatabase }): Promise<any> => {
      console.log("id", id)
      const updatedId = new ObjectId(id)
      console.log("updatedId", updatedId)
      const stopTimer = await db.timers.findOneAndUpdate({ _id: updatedId }, { $set: { end, isRunning: false } }, { returnOriginal: false })

      console.log("stopTimer", stopTimer)

      if (!stopTimer.ok) {
        throw new Error('failed to stop timer')
      }

      return stopTimer.value
    },

    updateTimer: async (_root: undefined, { id, title }: { id: string, title: string }, { db }: { db: IDatabase }): Promise<any> => {
      console.log("id", id)
      const updatedId = new ObjectId(id)
      console.log("updatedId", updatedId)
      const updateTimer = await db.timers.findOneAndUpdate({ _id: updatedId }, { $set: { title } }, { returnOriginal: false })

      // if (timer.ops)
      console.log("updateTimer", updateTimer)

      if (!updateTimer.ok) {
        throw new Error('failed to update timer')
      }

      return updateTimer.value
    },
    deleteTimer: async (_root: undefined, { id }: { id: string }, { db }: { db: IDatabase }): Promise<ITimer> => {
      console.log("id", id)

      const deleteTimer = await db.timers.findOneAndDelete({ _id: new ObjectId(id) })

      if (!deleteTimer.value) {
        throw new Error('failed to delete timer')
      }

      return deleteTimer.value
    },
  },

  Timer: {
    id: (timer: ITimer): string => {
      return timer._id.toHexString()
    }
  }

}