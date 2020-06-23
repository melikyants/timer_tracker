import React from 'react'

import { milliSecToString } from '../../../../lib'
import { Timers_timers as ITimer } from '../../__generated__/Timers'

interface ITimers extends ITimer {
  time: string
}

export const TimersList = ({ timers }: { timers: ITimer[] | null }) => {

  if (timers) {
    let fetchedTimersParsed = timers.map<ITimers>((timer) => {
      let totalTime = timer.end - timer.start
      let time = milliSecToString(totalTime)

      // if (timer.isRunning) {
      //   const runningSince = Date.now() - timer.start
      //   const timeRunning = milliSecToString(runningSince)
      //   setSTimer((STimer) => ({ ...STimer, start: timer.start, isRunning: true, runningSince: Date.now(), time: timeRunning, isRunningId: timer.id }))
      //   setSTitle(timer.title)
      // }
      return {
        ...timer,
        time: time
      }
    }).filter((timer) => !timer.isRunning)

    const timersRenderList = fetchedTimersParsed.map((timer) => {
      return (<div className="timers" key={timer.id}>
        {timer.title}
        <div>
          <span>{timer.time}</span>
        </div>

      </div>)
    })

    return (<div>{timersRenderList}</div>)
  }
  return <div>There is no time log yet!</div>
}