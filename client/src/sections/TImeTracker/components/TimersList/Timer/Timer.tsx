import React from 'react'
import {Popper} from '../../Popper'
import {TimerDetails} from '../TimerDetails'

import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import {ITimerTime} from '../TimerList'

const DELETE_TIMER = gql`
  mutation deleteTimer($id: ID!){
    deleteTimer(id: $id){
      id
    }
  }
`
export const Timer = ({timer, refetch}: {timer: ITimerTime, refetch:any})=> {

  const elRefs = React.useRef<any>(null);
  const popperRef = React.useRef<any>(null);
  const [visible, setVisibility] = React.useState(false)
  const [deleteTimer] = useMutation(DELETE_TIMER)

  React.useEffect(() => {
    // listen for clicks and close dropdown on body
    const handleDocumentClick = (event:any) => {
       if (elRefs.current.contains(event.target) || popperRef.current.contains(event.target)) {
        return;
      }
      setVisibility(false);
  }
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [setVisibility]);

 const handlePopper = () => {
  setVisibility(!visible)
  console.log(visible)
}
const onDelete = async(id:string)=>{
  await deleteTimer({variables:{id}})
  refetch()
}

const showPopper = (id:string)=>{
  // setisPopover(true)
}
  return(
    <div key={timer.id}>
    <div className="timer" ref={elRefs} onClick={handlePopper}>
      <div className="timer__title_project" onClick={()=>showPopper(timer.id)}>
        <div>{timer.title}</div>
        <div><button className="btn-link" > + add project</button></div>
      </div>
      <div>
        <div>{timer.time}</div>
        <div><button onClick={()=>onDelete(timer.id)} className="btn btn__delete"> -</button></div>
      </div>
    </div>
    <Popper refEl={elRefs} popperRef={popperRef} visible={visible}>
      <TimerDetails />
    </Popper>
    </div>
  )
}