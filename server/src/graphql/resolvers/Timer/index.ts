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

      if (!timersList) {
        throw new Error('there are no timers')
      }

      const timers = timersList.map((timer): TimersData => {
        //Front or Backend?
        // const totalTime = timer.end ? (timer.end - timer.start) : null;
        // const time = milliSecToString(totalTime);
        // const date = new Date(timer.end).toString();
        const temp: TimersData = Object.assign({}, { ...timer }, { project_title: '', project_description: '' })

        if (projects || timer.project_id !== null) {
          // console.log("projects", projects[0]._id)
          const projectIndex = projects.findIndex((project: any) => project._id.toHexString() == timer.project_id)
          // console.log("projectIndex", projectIndex)
          if (projectIndex > -1) {
            temp['project_title'] = projects[projectIndex].title
            temp['project_description'] = projects[projectIndex].description
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

        const timer: TimersData = Object.assign({}, { ...timerFetch }, { project_title: '', project_description: '' })
        if (timer.project_id) {
          const project = await db.projects.findOne({ _id: timer.project_id })
          console.log("project", project)

          if (project) {
            timer['project_title'] = project.title
            timer['project_description'] = project.description
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
    startTimer: async (_root: undefined, { start, title }: { start: number, title: string }, { db }: { db: IDatabase }): Promise<TimersData> => {
      const insertRes = await db.timers.insertOne({
        _id: new ObjectId(),
        start: start,
        title: title,
        project_id: null,
        end: null,
        type: 'ANY',
        notes: '',
        isRunning: true
      });

      if (!insertRes) {
        throw new Error()
      }

      const insertTimer: TimersData = Object.assign({}, insertRes.ops[0], { project_title: '', project_description: '' })


      if (!insertTimer) {
        throw new Error()
      }

      return insertTimer
    },

    stopTimer: async (_root: undefined, { id, end }: { id: string, end: number }, { db }: { db: IDatabase }): Promise<TimersData> => {

      const stopTimer = await db.timers.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { end, isRunning: false } }, { returnOriginal: false })

      if (!stopTimer.value) {
        throw new Error('failed to stop timer')
      }
      const stopTimerData: TimersData = Object.assign({}, stopTimer.value, { project_title: '', project_description: '' })
      if (stopTimerData.project_id) {
        const project = await db.projects.findOne({ _id: stopTimerData.project_id })
        console.log("project", project)

        if (project) {
          stopTimerData['project_title'] = project.title
          stopTimerData['project_description'] = project.description
        }

      } else {
        stopTimerData['project_title'] = ''
      }
      console.log("stopTimer.value", stopTimer.value)

      return stopTimerData
    },

    updateTimer: async (_root: undefined,
      { id, title, project_id, project_description, notes, type }:
        { id: string, title: string, project_id: string, project_description: string, notes: string, type: string },
      { db }: { db: IDatabase }): Promise<ITimer> => {

      const updateTimer = await db.timers.findOneAndUpdate({ _id: new ObjectId(id) },
        {
          $set: {
            title,
            project_id: new ObjectId(project_id),
            notes,
            type
          }
        }, { returnOriginal: false })


      const project = await db.projects.findOneAndUpdate({ _id: new ObjectId(project_id) }, {
        $set: { description: project_description }
      }, { returnOriginal: false })
      console.log("--updateTimer project", project)

      if (!updateTimer.value) {
        throw new Error('failed to update timer')
      }
      if (!project.value) {
        throw new Error('failed to update project')
      }

      const timer: TimersData = Object.assign({}, { ...updateTimer.value }, { project_title: project.value.title, project_description: project.value.description })

      console.log('--updateTimer done', timer)
      return timer
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
    },
  },

}