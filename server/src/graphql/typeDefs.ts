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
  type User {
    id: ID!
    name: String!
    avatar: String!
    contact: String!
  }

  type Viewer {
    id: ID
    avatar: String
    didRequest: Boolean!
    tokenGoogle: String
    tokenUpwork: String
  }

  type JobClient {
    country: String
    feedback: Float
    reviews_count: Float
    jobs_posted: Float
    past_hires: Float
    payment_verification_status: String
  }
  type Job {
    id: String
    title: String
    snippet: String
    category: String
    subcategory: String
    skills: [String]
    type: String
    budget: Float
    duration: String
    workload: String
    status: String
    date_created: String
    url: String
    client: JobClient
  }

  input Params {
    q: String
    skills: [String]
    paging: String
  }

  input connectUpworkInput {
    verifier: String!
  }
  input LogInInput {
    code: String!
  }

  type Query {
    user(id: ID!): User!
    authUrl: String!
    authUrlUpwork: String!
    timers(pageSize: Int, after: String): TimerConnection!
    timer(id: ID!): Timer!
    projects: [Project!]!
    searchJobs(params: Params, filterCountries: [String]): [Job!]!
  }

  type TimerConnection { # add this below the Query type as an additional type.
    cursor: String!
    hasMore: Boolean!
    timers: [Timer]!
  }

  type Mutation {
    logIn(input: LogInInput): Viewer!
    logOut: Viewer!

    connectUpwork(input: connectUpworkInput): Viewer!
    logOutUpwork: Viewer!

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
