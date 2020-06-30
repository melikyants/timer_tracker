import React from 'react'
import { Popper } from '../../Popper'
import { TimerDetails } from '../../TimerDetails'

import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

// import { ITimerTime } from '../TimerList'

import { ReactComponent as StartIcon } from '../../../icons/arrow.svg'

import { TimerContext } from "../../../../../lib/context/TimerContext";

export const Timer = ({ timer, timersRefetch }: { timer: any, timersRefetch: () => void }) => {

  const elRefs = React.useRef<any>(null);
  const popperRef = React.useRef<any>(null);
  const [visible, setVisibility] = React.useState(false)
  const [timerDetailsId, setTimerDetailsId] = React.useContext(TimerContext)
  const timeStart = new Date(timer.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const timeEnd = new Date(timer.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const handlePopper = () => {
    setVisibility(!visible)
    console.log(visible)
  }
  const onRunTimer = async (id: string) => {
    timersRefetch()
  }

  const showDetails = (id: string) => {
    // setisPopover(true)
    setTimerDetailsId(id)
  }

  return (
    <div key={timer.id} className="timer">
      <div className="timer_desc" onClick={() => showDetails(timer.id)}>
        <div>{timer.title}</div>
        <div className="timer_desc_row">
          {timer.project_id ? <div className="timer_desc__title">
            {timer.project_title}
          </div> : <div><button className="btn-link" > + add project</button></div>}
          {timer.type && <div className="timer_desc__title">
            {timer.type}
          </div>}
        </div>
      </div>
      <div>
        <div className="timer__times">
          <div>{timer.time}</div>
          <div className="timer__times_fromTo">{timeStart} - {timeEnd}</div>
        </div>

        <div className="startIcon">
          <button onClick={() => onRunTimer(timer.id)} className="btn btn__icon btn__play"><StartIcon /></button>
        </div>
      </div>
    </div>
  )
}