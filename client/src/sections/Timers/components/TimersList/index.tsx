import React from 'react'

import { milliSecToString, isToday } from '../../../../lib'
import { Timers_timers as ITimer } from '../../__generated__/Timers'
import _ from "lodash"

interface ITimers extends ITimer {
  time: string
}

export const TimersList = ({ timers }: { timers: ITimer[] | null }) => {
  console.log("TimersList -> timers", timers)
  const groupedTimers = []


  if (timers) {
    //clone fetched timers
    let clonedTimers = _.cloneDeep(timers)

    let parsedTimerinTimers = clonedTimers.map<ITimers>((timer) => {

      let totalTime = timer.end - timer.start
      let time = milliSecToString(totalTime)

      return {
        ...timer,
        time: time
      }
    }).filter((timer) => !timer.isRunning)

    //group timers by date
    let groupTimersByDate = Object.values(parsedTimerinTimers.reduce((result: any, next) => {
      let nextDate = new Date(next.end)
      let nextDateString = nextDate.toDateString() //"Tue Jun 23 2020"

      if (!result[nextDateString]) {
        result[nextDateString] = {
          date: nextDateString,
          items: []
        }
      }

      result[nextDateString].items.push(next)
      return result
    }, {}))

    //add total time to timers that grouped by date
    let timersWithTotalTime = groupTimersByDate.map((item: any) => {
      let total = item.items.reduce((result: number, next: any) => {
        return result + (next.end - next.start)
      }, 0)

      let totalTime = milliSecToString(total)
      return {
        ...item,
        total: totalTime
      }
    }).sort((a: any, b: any) => {
      let dateA = new Date(a.date)
      let dateB = new Date(b.date)
      if (dateA > dateB) return -1;
      if (dateA == dateB) return 0;
      if (dateA < dateB) return 1;
      return 0
    })


    const timersRenderList = timersWithTotalTime.map((timersByDays) => {
      let now = new Date(timersByDays.date)


      let today = isToday(now) ? 'Today' : timersByDays.date
      return (<div className="timer__block" key={timersByDays.date}>
        <div className="timer__block_header">
          <div>{today}
          </div>
          <div>{timersByDays.total}
          </div>
        </div>
        <div className="timer__block_body">
          {timersByDays.items.map((timer: any) => {
            return (
              <div className="timer" key={timer.id}>
                <div>{timer.title}
                </div> <div>
                  {timer.time}
                </div></div>
            )
          })}
        </div>

      </div>)
    })

    return (<div className="timers_list">{timersRenderList}</div>)
  }
  return <div className="timers_list">There is no time log yet!</div>
}