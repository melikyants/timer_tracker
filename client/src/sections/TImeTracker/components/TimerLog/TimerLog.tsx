import React, { useState, useEffect } from 'react'
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
// import { TimersData, IStartTimer, IStartTimerVariables } from './types'
import { useInterval, milliSecToString } from '../../../../lib'

// import { Timers_timers as ITimer } from '..TimersList/Timers'
import { startTimer as startTimerData, startTimerVariables } from './__generated__/startTimer'

import { ReactComponent as PlayIcon } from '../../icons/arrow.svg'
import { ReactComponent as StopIcon } from '../../icons/stop.svg'

import { Popper } from '../Popper'
import { TimerDetails } from '../TimerDetails'

import { TimerContext } from "../../../../lib/context/TimerContext";

import { START_TIMER, STOP_TIMER, UPDATE_TIMER } from '../../../../lib/graphql/mutation'
import { TIMERS, TIMER } from '../../../../lib/graphql/query'


interface ISTimerNew {
  start: number,
  runningSince: number,
  time: string,
  isRunning: boolean,
  isRunningId: string,
}

export const TimerLog = ({ timer }: { timer: any | null }) => {
  const [STimer, setSTimer] = useState<ISTimerNew>({
    start: 0,
    runningSince: 0,
    time: '',
    isRunning: false,
    isRunningId: '',
  })

  const [STitle, setSTitle] = useState('')
  const [timerDetailsId, setTimerDetailsId] = React.useContext(TimerContext)
  const [startTimer] = useMutation<any>(START_TIMER, {
    update(cache, { data: { startTimer } }) {
      const { timers } = cache.readQuery<any>({ query: TIMERS })

      cache.writeQuery({
        query: TIMERS,
        data: { timers: timers.concat([startTimer]) }
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
  const [updateTimer] = useMutation(UPDATE_TIMER)

  const elRefsLog = React.useRef<any>(null);
  const popperRef = React.useRef<any>(null);

  useInterval(() => {
    const runningSince = Date.now() - STimer.start
    const timeRunning = milliSecToString(runningSince)
    setSTimer(STimer => ({ ...STimer, runningSince: STimer.runningSince + 1, time: timeRunning }));
  }, STimer.isRunning ? 1000 : null);

  useEffect(() => {
    if (timer) {
      const runningSince = Date.now() - timer.start
      const timeRunning = milliSecToString(runningSince)
      setSTimer((STimer) => ({ ...STimer, start: timer.start, isRunning: true, runningSince: Date.now(), time: timeRunning, isRunningId: timer.id }))
      setSTitle(timer.title)
    }
  }, [timer])

  const onStartTimer = async () => {
    const now = Date.now(); //timestamp in milliseconds
    const timeRunning = milliSecToString(0)
    setSTimer(STimer => ({ ...STimer, isRunning: true, start: now, time: timeRunning }))
    console.log("onStartTimer -> STimer", STimer)

    await startTimer({ variables: { start: now, title: STitle } })
      .then((result) => {
        setSTimer(STimer => ({ ...STimer, isRunningId: result.data ? result.data.startTimer.id : '' }))
      })
    // refetchTimers()
  }

  const onStopTimer = async () => {
    const now = Date.now(); //timestamp in milliseconds
    const timeRunning = milliSecToString(0)
    setSTimer(STimer => ({ ...STimer, isRunning: false, end: now, start: 0, runningSince: 0, time: timeRunning }))

    if (STimer.isRunningId !== null) {
      await stopTimer({ variables: { id: STimer.isRunningId, end: now } })
    }
    // refetchTimers()
  }

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSTitle(e.currentTarget.value)
  }

  const onUpdateTimer = async () => {
    updateTimer({ variables: { id: STimer.isRunningId, title: STitle } })
  }

  const onUpdateTitle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("onUpdateTitle -> e", e)
    if (e.key === 'Enter') {
      console.log('Adding....');
      onUpdateTimer()
      // refetchTimers()
    }
  }

  const onTimerDetails = () => {
    // setVisibility(!visible)
    setTimerDetailsId(timer.id)
  }

  if (timer) {
    return (<div className="timer_log">
      {/* <input className="input" type="text" onChange={onTitleChange} onKeyPress={onUpdateTitle} defaultValue={STitle} /> */}
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