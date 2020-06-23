import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID, GraphQLInt, GraphQLNonNull,
  GraphQLList
} from 'graphql'

import { timers } from './timers'

const Timer = new GraphQLObjectType({
  name: "Timer",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLNonNull(GraphQLString) },
    project_id: { type: GraphQLNonNull(GraphQLString) },
    category: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    notes: { type: GraphQLNonNull(GraphQLString) },
    elapsed: { type: GraphQLNonNull(GraphQLInt) },
    runningSince: { type: GraphQLNonNull(GraphQLInt) },
    images: { type: GraphQLNonNull(GraphQLString) }
  })
})

const query = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    timers: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(Timer))),
      resolve: () => {
        return timers
      }
    }
  })
})

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    deleteTimer: {
      type: GraphQLNonNull(Timer),
      args: {
        id: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve: (_root, { id }) => {
        for (let i = 0; i < timers.length; i++) {
          if (timers[i].id === id) {
            return timers.splice(i, 1)[0]
          }
        }
        throw new Error('failed to delete timer')
      }
    }
  }
})


export const schema = new GraphQLSchema({
  query,
  mutation
})