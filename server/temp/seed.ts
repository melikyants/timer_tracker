

import env = require('dotenv')
env.config()
import { connectDatabase } from '../src/database'
import { ITimer } from '../src/lib/types'
import { ObjectId } from 'mongodb'

const seed = async () => {
  try {
    // const timers: ITimer[] = [
    //   {
    //     _id: new ObjectId(),
    //     title: "module 8",
    //     project_id: "001", //dropdown list with timer projects and automaticaly create if its something new
    //     type: "study", //dropdown list with timer categories
    //     description: 'learning graphql and connecting apollo server',
    //     notes: 'usefull links: ',
    //     start: 1592814104323,
    //     end: 1592814108323,
    //     isRunning: false,
    //   },
    //   {
    //     _id: new ObjectId(),
    //     title: "drawing heads",
    //     project_id: "003",
    //     type: "hobbie", //dropdown list with timer categories
    //     description: 'different head rotation',
    //     notes: 'references i used: http://google.com/drawings, http://google.com/pinterest',
    //     start: 1592814104323,
    //     end: 1592814108323,
    //     isRunning: false
    //   },
    // ]
    console.log('[seed started]')
    const db = await connectDatabase()

    // // for (let i = 0; i < timers.length; i++) {
    // //   await db.timers.insertOne(timers[i])
    // // }
    // for (const timer of timers) {
    //   await db.timers.insertOne(timer)
    // }

    const bulkOpTimers = db.timers.initializeOrderedBulkOp();
    bulkOpTimers.find({}).update({ $set: { isRunning: false } })

    await bulkOpTimers.execute();

    console.log('[seed success]')
  } catch (err) {
    throw new Error('couldnt seed timers to mongodb')
  }

}

seed()