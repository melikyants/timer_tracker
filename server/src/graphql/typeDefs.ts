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
    project_id: ID,
    type: TimerType,
    description: String!,
    notes: String!,
    project_title: String!,
    isRunning: Boolean!
  }

  type Project {
    id: ID!,
    title: String!,
    info: String
  }

  type Query {
    timers: [Timer!]!,
    timer(id: ID!): Timer!,
    projects: [Project!]!
  }

  type Mutation {
    startTimer(start:Float!, title: String!): Timer!
    stopTimer(id:ID!, end: Float!):Timer!
    updateTimer(id:ID!, title: String!):Timer!
    deleteTimer(id:ID!): Timer!
    assignProject(timer_id: String!, id: String!):Timer

    createProject(title:String!, info:String): Project!
    deleteProject(id: ID!): Project!
    updateProject(id: ID!, title:String, info:String ): Project!
    
  }
`
