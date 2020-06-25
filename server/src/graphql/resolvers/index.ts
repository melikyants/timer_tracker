import merge from 'lodash.merge'
import { timerResolvers } from './Timer'
import { projectResolver } from './Project'

export const resolvers = merge(timerResolvers, projectResolver)