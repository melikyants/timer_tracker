import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type Timer {
    id: ID!,
    title: String!,
    project_id: String!,
    type: String!,
    description: String!,
    notes: String!,
    start: Float!,
    end: Float!
    isRunning: Boolean!
  }

  type Project {
    id: ID!,
    title: String!,
    info: String
  }

  type Query {
    timers: [Timer!]!,
    projects: [Project!]!
  }

  type Mutation {
    startTimer(start:Float!, title: String!): Timer!
    stopTimer(id:ID!, end: Float!):Timer!
    updateTimer(id:ID!, title: String!):Timer!
    deleteTimer(id:ID!): Timer!

    createProject(title:String!, info:String): Project!
    deleteProject(id: ID!): Project!
    updateProject(id: ID!, title:String, info:String ): Project!
    assignProject(timer_id: String!, id: String!):Project
  }
`
