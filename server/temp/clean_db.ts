

import env = require('dotenv')
env.config()
import { connectDatabase } from '../src/database'

const cleandb = async () => {
  try {

    console.log('[cleandb started]')
    const db = await connectDatabase()

    // for (let i = 0; i < timers.length; i++) {
    //   await db.timers.insertOne(timers[i])
    // }
    await db.timers.deleteMany({})

    console.log('[cleandb success]')
  } catch (err) {
    throw new Error('couldnt cleandb timers to mongodb')
  }

}

cleandb()