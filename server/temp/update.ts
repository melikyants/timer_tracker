

import env = require('dotenv')
env.config()
import { connectDatabase } from '../src/database'

const update = async () => {
  try {

    console.log('[update started]')
    const db = await connectDatabase()

    const bulkOpTimers = db.timers.initializeOrderedBulkOp();
    bulkOpTimers.find({ project_id: "001" }).update({ $set: { project_id: '' } })

    await bulkOpTimers.execute();

    console.log('[update success]')
  } catch (err) {
    throw new Error('couldnt update timers to mongodb')
  }

}

update()