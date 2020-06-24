import React, { useState, useEffect } from 'react'
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
// import { TimersData, IStartTimer, IStartTimerVariables } from './types'
import { useInterval, milliSecToString } from '../../../../lib'

import { Timers_timers as ITimer } from '../../__generated__/Timers'
import { startTimer as startTimerData, startTimerVariables } from './__generated__/startTimer'

import PlayIcon from '../../icons/play.svg'
import StopIcon from '../../icons/stop.svg'

const START_TIMER = gql`
  mutation startTimer($start: Float!, $title:String!){
    startTimer(start: $start, title: $title){
      id
    }
  }
`

const STOP_TIMER = gql`
  mutation stopTimer($id: ID!, $end: Float!){
    stopTimer(id: $id, end: $end){
      id
    }
  }
`

const UPDATE_TIMER = gql`
  mutation updateTimer($id: ID!, $title: String!){
    updateTimer(id: $id, title: $title){
      id
    }
  }
`

interface ISTimerNew {
  start: number,
  runningSince: number,
  time: string,
  isRunning: boolean,
  isRunningId: string,
}

export const TimerLog = ({ timer, refetch }: { timer: ITimer | null, refetch: any }) => {
  const [STimer, setSTimer] = useState<ISTimerNew>({
    start: 0,
    runningSince: 0,
    time: '',
    isRunning: false,
    isRunningId: '',
  })

  const [STitle, setSTitle] = useState('')
  const [startTimer] = useMutation<startTimerData, startTimerVariables>(START_TIMER)
  const [stopTimer] = useMutation(STOP_TIMER)
  const [updateTimer] = useMutation(UPDATE_TIMER)
  

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
    refetch()
  }

  const onStopTimer = async () => {
    const now = Date.now(); //timestamp in milliseconds
    const timeRunning = milliSecToString(0)
    setSTimer(STimer => ({ ...STimer, isRunning: false, end: now, start: 0, runningSince: 0, time: timeRunning }))

    if (STimer.isRunningId !== null) {
      await stopTimer({ variables: { id: STimer.isRunningId, end: now } })
    }
    refetch()
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
      refetch()
    }
  }

  if (timer) {
    return (<div className="timer_log">
      <input className="input" type="text" onChange={onTitleChange} onKeyPress={onUpdateTitle} defaultValue={STitle} />
      <div className="timer_log__tick">{STimer.time}</div>
      <button className="btn btn__stop" onClick={onStopTimer}>
        <img src={StopIcon} width="10px" height="10px" alt="start_timer"/>
      </button>
    </div>)
  } else {
    return (<div className="timer_log">
      <input className="input" type="text" onChange={onTitleChange} placeholder="What are you working on?" />
      <button className="btn btn__start" onClick={onStartTimer}>
        <img src={PlayIcon} width="14px" height="12px" alt="stop_timer"/>
      </button>
    </div>)
  }
}