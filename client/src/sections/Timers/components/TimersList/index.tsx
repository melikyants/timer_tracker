import React from 'react'

import { milliSecToString, isToday, sortByDates } from '../../../../lib'
import { Timers_timers as ITimer } from '../../__generated__/Timers'

import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import _ from 'lodash'

import {Popper} from '../../../Popper'

// import { usePopper } from 'react-popper';

const DELETE_TIMER = gql`
  mutation deleteTimer($id: ID!){
    deleteTimer(id: $id){
      id
    }
  }
`

interface ITimerTime extends ITimer {
  time: string,
  date: string
}

export const TimersList = ({ timers, refetch }: { timers: ITimer[] | null, refetch:any }) => {
  
  
  
  // const [elRefs, setElRefs] = React.useState<any[]>([]);
  
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

const Timer = ({timer, refetch}: {timer: ITimerTime, refetch:any})=> {

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

const TimerDetails = () => {
  const types = ['Study', 'Work', 'Hobbie']
  const inputProjectRef = React.useRef(null)
  const inputProjectPopperRef = React.useRef(null)

  const buttonProjectCreateRef = React.useRef(null)
  const buttonProjectCreatePopperRef = React.useRef(null)
  const [visible, setVisibility] = React.useState(false)
  const [visibleProject, setVisibilityProject] = React.useState(false)

  const showProjects = () => {
    setVisibility(!visible)
  }

  const projects = [{
    id: "001",
    title: "TimmerLog",
    info: "building timer for a personal use"
  },
  {
    id: "002",
    title: "Dashboard",
    info: "building dashbor to view all the usefull data"
  }]

  const handleCreateProject = () => {
    setVisibilityProject(!visibleProject)
    console.log('cloick')
  }
  const closeProjectCreation = () => {
    setVisibilityProject(!visibleProject)
  }
return (
  <div className="TimerDetails_wrapper">
    <h3>Details</h3>
    <div className="TimerDetails__body">
      <input placeholder="Title" className="input"/>
      <input name="project" placeholder="select a project" defaultValue="Project name" ref={inputProjectRef} onClick={showProjects}/>
    <Popper refEl={inputProjectRef} popperRef={inputProjectPopperRef} visible={visible}>
      <div>
        <ul>
          {projects.map((project)=>{
            return(<li key={project.id}>{project.title}</li>)
          })}
        </ul>
        <button ref={buttonProjectCreateRef} onClick={handleCreateProject}>Create a project</button>
        <Popper refEl={buttonProjectCreateRef} popperRef={buttonProjectCreatePopperRef} visible={visibleProject}>
          <div>
            <button onClick={closeProjectCreation}>Cancel</button></div>
        </Popper>
      </div>
    </Popper>
      {types.map((type, i)=>{
        return(
          <label key={i}>
          {type}
        <input type="checkbox" name={type}/>
      </label>
        )
      })}
        
    </div>
  </div>
)
}