import React from 'react'

import { milliSecToString, isToday, sortByDates } from '../../../../lib'
import { Timers_timers as ITimer } from '../../__generated__/Timers'

import _ from 'lodash'

import {Timer} from './Timer'

export interface ITimerTime extends ITimer {
  time: string,
  date: string
}

export const TimersList = ({ timers, refetch }: { timers: ITimer[] | null, refetch:any }) => {
    
// clone fetched timers
const clonedTimers = timers ? _.cloneDeep(timers) : []

const parsedTimerinTimers = clonedTimers.map<ITimerTime>((timer) => {
  const totalTime = timer.end - timer.start
  const time = milliSecToString(totalTime)
  const date = new Date(timer.end).toString()
  return {
    ...timer,
    time: time,
    date
  }
}).filter((timer) => !timer.isRunning)

// group timers by date
const groupTimersByDate = Object.values(parsedTimerinTimers.reduce((result: any, next) => {
  const nextDate = new Date(next.end)
  const nextDateString = nextDate.toDateString() // "Tue Jun 23 2020"

  if (!result[nextDateString]) {
    result[nextDateString] = {
      date: nextDateString,
      items: []
    }
  }

  result[nextDateString].items.push(next)
  return result
}, {}))

// add total time to timers that grouped by date
const timersWithTotalTime = groupTimersByDate.map((item: any) => {
  const total = item.items.reduce((result: number, next: any) => {
    return result + (next.end - next.start)
  }, 0)

  const totalTime = milliSecToString(total)

  item.items.sort((a: any, b: any) => sortByDates(a.date, b.date))
  return {
    ...item,
    total: totalTime
  }
}).sort((a: any, b: any) => sortByDates(a.date, b.date))


  if (timersWithTotalTime) {
    
    const timersRenderList = timersWithTotalTime.map((timersByDays) => {
      const now = new Date(timersByDays.date)

      const today = isToday(now) ? 'Today' : timersByDays.date
      return (<div className="timer__block" key={timersByDays.date}>
        <div className="timer__block_header">
          <div>{today}
          </div>
          <div>{timersByDays.total}
          </div>
        </div>
        <div className="timer__block_body">
          {timersByDays.items && <Timers timers={timersByDays.items} refetch={refetch}/>}
        </div>

      </div>)
    })

    return (<div className="timers_list">{timersRenderList}</div>)
  }
  return <div className="timers_list">There is no time log yet!</div>
}

export const Timers = ({timers, refetch}: {timers:ITimer[], refetch:any})=>{
  
 return (<div>{timers.map((timer: any, i:number) => <Timer timer={timer} refetch={refetch} key={timer.id}/>)}</div>)
}
