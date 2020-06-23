import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type Session {
    start: Float!,
    end: Float!
  }

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

  type Timer_Projects {
    id: ID!,
    title: String!,
    info: String
  }

  type Query {
    timers: [Timer!]!
    # timer_projects: [Timer_Projects!]!
  }

  type Mutation {
    # addTimer(title: String!, type: String, description: String): Timer!
    # deleteTimer(id: ID!): Timer!
    startTimer(start:Float!, title: String!): Timer!
    stopTimer(id:ID!, end: Float!):Timer!
    updateTimer(id:ID!, title: String!):Timer!
    # addProject(title:String!,info:String) 
  }
`
