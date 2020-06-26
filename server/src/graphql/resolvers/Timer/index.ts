// import { timers } from '../../../timers'
import { IResolvers } from 'apollo-server-express'
import { IDatabase, ITimer } from '../../../lib/types'
import { ObjectId } from "mongodb";
import { TimersData } from './types'

export const timerResolvers: IResolvers = {
  Query: {
    timers: async (_root: undefined, _args: {}, { db }: { db: IDatabase }): Promise<TimersData[]> => {
      const timersList = await db.timers.find({}).toArray()
      const projects = await db.projects.find({}).toArray()
      console.log("projects", projects)

      if (!timersList) {
        throw new Error('there are no timers')
      }

      const timers = timersList.map((timer): TimersData => {

        //Front or Backend?
        // const totalTime = timer.end ? (timer.end - timer.start) : null;
        // const time = milliSecToString(totalTime);
        // const date = new Date(timer.end).toString();
        const temp: TimersData = Object.assign({}, { ...timer }, { project_title: '' })

        if (projects || timer.project_id !== null) {
          // console.log("projects", projects[0]._id)
          const projectIndex = projects.findIndex((project: any) => project._id.toHexString() == timer.project_id)
          // console.log("projectIndex", projectIndex)
          if (projectIndex > -1) {
            temp['project_title'] = projects[projectIndex].title
          }
        }
        return temp
      })

      // console.log("---timers", timers)
      return timers
    },
    timer: async (_root: undefined, { id }: { id: string }, { db }: { db: IDatabase }): Promise<TimersData> => {
      try {
        const timerFetch = await db.timers.findOne({ _id: new ObjectId(id) })


        if (!timerFetch) {
          throw new Error()
        }

        const timer: TimersData = Object.assign({}, { ...timerFetch }, { project_title: '' })
        if (timer.project_id) {
          const project = await db.projects.findOne({ _id: timer.project_id })

          if (project) {
            timer['project_title'] = project.title
          }

        } else {
          timer['project_title'] = ''
        }


        console.log("timer", timer)
        return timer
      } catch (error) {
        throw new Error(`Failed to query listing: ${error}`);
      }

    }
  },
  Mutation: {
    startTimer: async (_root: undefined, { start, title, isRunning }: { start: number, title: string, isRunning: boolean }, { db }: { db: IDatabase }): Promise<TimersData> => {
      const insertRes = await db.timers.insertOne({
        _id: new ObjectId(),
        start: start,
        title: title,
        project_id: null,
        end: null,
        type: 'ANY',
        description: '',
        notes: '',
        isRunning: true
      });

      if (!insertRes) {
        throw new Error()
      }

      const insertTimer: TimersData = Object.assign({}, insertRes.ops[0], { project_title: '' })


      if (!insertTimer) {
        throw new Error()
      }


      return insertTimer
    },

    stopTimer: async (_root: undefined, { id, end }: { id: string, end: number }, { db }: { db: IDatabase }): Promise<ITimer> => {

      const stopTimer = await db.timers.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { end, isRunning: false } }, { returnOriginal: false })

      if (!stopTimer.value) {
        throw new Error('failed to stop timer')
      }

      return stopTimer.value
    },

    updateTimer: async (_root: undefined, { id, title }: { id: string, title: string }, { db }: { db: IDatabase }): Promise<ITimer> => {

      const updateTimer = await db.timers.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { title } }, { returnOriginal: false })

      if (!updateTimer.value) {
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
    assignProject: async (_root: undefined, { timer_id, id }: { timer_id: string, id: string }, { db }: { db: IDatabase }): Promise<TimersData> => {

      const assignProjectToTimer = await db.timers.findOneAndUpdate({ _id: new ObjectId(timer_id) }, { $set: { project_id: new ObjectId(id) } }, { returnOriginal: false })
      console.log("assignProjectToTimer", assignProjectToTimer)
      const project = await db.projects.findOne({ _id: new ObjectId(id) })

      if (!assignProjectToTimer.value) {
        throw new Error('couldnt assign project to the timer')
      }

      const timer: TimersData = Object.assign({}, { ...assignProjectToTimer.value }, { project_title: '' })

      if (project) {
        console.log("projects", project)
        timer['project_title'] = project.title
      }

      console.log("assignProjectToTimer.value", timer)
      return timer
    }
  },

  Timer: {
    id: (timer: ITimer): string => {
      return timer._id.toHexString()
    },
  },

}