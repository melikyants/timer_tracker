import { ITimer } from '../../../lib/types'


export interface TimersData extends ITimer {
  project_title: string,
  project_description: string
}