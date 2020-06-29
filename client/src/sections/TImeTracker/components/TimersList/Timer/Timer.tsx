import React from 'react'
import { Popper } from '../../Popper'
import { TimerDetails } from '../../TimerDetails'

import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

// import { ITimerTime } from '../TimerList'

import { TimerContext } from "../../../../../lib/context/TimerContext";

const DELETE_TIMER = gql`
  mutation deleteTimer($id: ID!){
    deleteTimer(id: $id){
      id
    }
  }
`

export const Timer = ({ timer, timersRefetch }: { timer: any, timersRefetch: () => void }) => {

  const elRefs = React.useRef<any>(null);
  const popperRef = React.useRef<any>(null);
  const [visible, setVisibility] = React.useState(false)
  const [timerDetailsId, setTimerDetailsId] = React.useContext(TimerContext)


  const [deleteTimer] = useMutation(DELETE_TIMER)


  const handlePopper = () => {
    setVisibility(!visible)
    console.log(visible)
  }
  const onDelete = async (id: string) => {
    await deleteTimer({ variables: { id } })
    timersRefetch()
  }

  const showDetails = (id: string) => {
    // setisPopover(true)
    setTimerDetailsId(id)
  }
  return (
    <div key={timer.id}>
      <div className="timer">
        <div className="timer_desc" onClick={() => showDetails(timer.id)}>
          <div>{timer.title}</div>
          {timer.project_id ? <div className="timer_desc__title">
            {timer.project_title}
          </div> : <div><button className="btn-link" > + add project</button></div>}
        </div>
        <div>
          <div>{timer.time}</div>
          <div><button onClick={() => onDelete(timer.id)} className="btn btn__delete"> -</button></div>
        </div>
      </div>
    </div>
  )
}