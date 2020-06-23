

import env = require('dotenv')
env.config()
import { connectDatabase } from '../src/database'

const seed = async () => {
  try {

    console.log('[seed started]')
    const db = await connectDatabase()

    // for (let i = 0; i < timers.length; i++) {
    //   await db.timers.insertOne(timers[i])
    // }
    await db.timers.deleteMany({})

    console.log('[seed success]')
  } catch (err) {
    throw new Error('couldnt seed timers to mongodb')
  }

}

seed()