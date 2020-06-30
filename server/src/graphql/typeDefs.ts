import { gql } from 'apollo-server-express'

//describes our grqphql queries and the data we want to get

export const typeDefs = gql`
  enum TimerType {
    STUDY
    WORK
    HOBBIE
    ANY
  }
  type Timer {
    id: ID!,
    start: Float!,
    end: Float,
    title: String!,
    type: TimerType,
    notes: String,
    project_id: ID,
    project_title: String!,
    project_description: String,
    isRunning: Boolean!
  }

  type Project {
    id: ID!,
    title: String!,
    description: String
  }

  type Query {
    timers: [Timer!]!,
    timer(id: ID!): Timer!,
    projects: [Project!]!
  }

  type Mutation {
    startTimer(start:Float!, title: String!): Timer!
    stopTimer(id:ID!, end: Float!):Timer!
    updateTimer(id:ID!, title: String, project_id:String, project_description:String, notes: String, type: TimerType):Timer!
    deleteTimer(id:ID!): Timer!

    createProject(title:String!, description:String): Project!
    deleteProject(id: ID!): Project!
    updateProject(id: ID!, title:String, description:String ): Project!
    
  }
`
