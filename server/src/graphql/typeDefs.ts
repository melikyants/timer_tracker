import { gql } from "apollo-server-express";

//describes our grqphql queries and the data we want to get

export const typeDefs = gql`
  enum TimerType {
    STUDY
    WORK
    HOBBIE
    PERSONAL_PROJECT
    ANY
  }

  type Timer {
    id: ID!
    start: Float!
    end: Float
    title: String!
    type: TimerType
    notes: String
    project: Project
    isRunning: Boolean!
  }

  type Project {
    id: ID!
    title: String!
    description: String
  }

  type Viewer {
    id: ID
    token: String
    avatar: String
    hasWallet: Boolean
    didRequest: Boolean!
  }

  input LogInInput {
    code: String!
  }

  type Query {
    authUrl: String!
    timers: [Timer!]!
    timer(id: ID!): Timer!
    projects: [Project!]!
  }

  type Mutation {
    logIn(input: LogInInput): Viewer!
    logOut: Viewer!

    startTimer(start: Float!, id: ID!): Timer!
    createTimer(start: Float!, title: String!): Timer!
    stopTimer(id: ID!, end: Float!): Timer!
    updateTimer(
      id: ID!
      title: String
      project_id: String
      start: Float
      end: Float
      project_description: String
      notes: String
      type: TimerType
    ): Timer!
    deleteTimer(id: ID!): Timer!

    createProject(title: String!, description: String): Project!
    deleteProject(id: ID!): Project!
    updateProject(id: ID!, title: String, description: String): Project!
  }
`;
