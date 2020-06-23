import { MongoClient } from 'mongodb'
import { IDatabase } from '../lib/types'

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASS}@${process.env.DB_CLUSTER}.mongodb.net/<dbname>?retryWrites=true&w=majority`

export const connectDatabase = async (): Promise<IDatabase> => {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  const db = client.db('database_name')

  return {
    timers: db.collection('timers')
  }
}