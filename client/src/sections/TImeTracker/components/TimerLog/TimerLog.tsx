import React from 'react'
import { useMutation } from "@apollo/react-hooks";
import { useInterval, milliSecToString } from '../../../../lib'

import { ReactComponent as PlayIcon } from '../../icons/arrow.svg'
import { ReactComponent as StopIcon } from '../../icons/stop.svg'


import { TimerContext } from "../../../../lib/context/TimerContext";

import { STOP_TIMER, CREATE_TIMER } from '../../../../lib/graphql/mutation'
import { TIMERS } from '../../../../lib/graphql/query'

interface ISTimerNew {
  start: number,
  runningSince: number,
  time: string, //human readable time
}

export const TimerLog = ({ timer }: { timer: any | null }) => {

  const [STitle, setSTitle] = React.useState('')
  const [STimer, setSTimer] = React.useState<ISTimerNew>({
    start: 0,
    runningSince: 0,
    time: '',
  })

  const [timerR, dispatchTimerR] = React.useContext(TimerContext)
  const [createTimer] = useMutation<any>(CREATE_TIMER, {
    update(cache, { data: { createTimer } }) {
      const { timers } = cache.readQuery<any>({ query: TIMERS })

      cache.writeQuery({
        query: TIMERS,
        data: { timers: timers.concat([createTimer]) }
      })
    }
  })

  const [stopTimer] = useMutation(STOP_TIMER, {
    update(cache, { data: { stopTimer } }) {

      const { timers } = cache.readQuery<any>({ query: TIMERS })
      const index = timers.findIndex((timer: any) => timer.id === stopTimer.id)
      if (index > -1) {
        timers[index] = stopTimer
      }

      cache.writeQuery({
        query: TIMERS,
        data: { timers: timers }
      })
    }
  })

  useInterval(() => {
    const runningSince = Date.now() - STimer.start
    const timeRunning = milliSecToString(runningSince)

    setSTimer(STimer => ({ ...STimer, runningSince: STimer.runningSince + 1, time: timeRunning }));

  }, timerR.isRunning ? 1000 : null);

  React.useEffect(() => {
    if (timer) {
      const runningSince = Date.now() - timer.start
      const timeRunning = milliSecToString(runningSince)
      dispatchTimerR({
        type: 'TIMER_RUNNING',
        payload: {
          id: timer.id,
        }
      })
      setSTimer(STimer => ({ ...STimer, start: timer.start, time: timeRunning, runningSince: Date.now() }));
      setSTitle(timer.title)
    }
  }, [timer, dispatchTimerR])

  const onStartTimer = async () => {
    const now = Date.now(); //timestamp in milliseconds
    const timeRunning = milliSecToString(0)

    dispatchTimerR({
      type: 'START_TIMER'
    })
    setSTimer(STimer => ({ ...STimer, start: now, time: timeRunning }));

    await createTimer({ variables: { start: now, title: STitle } })
      .then((result) => {
        dispatchTimerR({
          type: 'UPDATE_TIMER_ID',
          payload: {
            runningId: result.data ? result.data.createTimer.id : '',
          }
        })
      })
  }

  const onStopTimer = async () => {
    const now = Date.now(); //timestamp in milliseconds
    const timeRunning = milliSecToString(0)
    dispatchTimerR({
      type: 'STOP_TIMER'
    })
    setSTimer(STimer => ({ ...STimer, isRunning: false, start: 0, runningSince: 0, time: timeRunning }))

    if (timerR.isRunningId !== null) {
      await stopTimer({ variables: { id: timerR.isRunningId, end: now } })
    }
  }

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSTitle(e.currentTarget.value)
  }

  const onTimerDetails = () => {
    dispatchTimerR({
      type: "OPEN_TIMER_DETAILS",
      payload: timer.id
    })
  }

  if (timer) {
    return (<div className="timer_log">
      <div className="timer_log__desc" onClick={onTimerDetails}>
        <div>{STitle}</div>
        <div className="timer_log__project">{timer.project_title}</div>
      </div>
      <div className="timer_log__tick">{STimer.time}</div>
      <button className="btn btn__circle btn__stop" onClick={onStopTimer}>
        <StopIcon />
      </button>
    </div>)
  } else {
    return (<div className="timer_log" >

      <input className="input" type="text" onChange={onTitleChange} placeholder="What are you working on?" />
      <div onClick={onTimerDetails}>add project</div>
      <button className="btn btn__circle btn__play" onClick={onStartTimer}>
        <PlayIcon />
      </button>
    </div>)
  }
}