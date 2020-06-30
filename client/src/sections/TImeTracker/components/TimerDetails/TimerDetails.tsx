import React from 'react';

import { Projects } from './Projects'
import { useInput, useTextarea } from '../../../../lib'

import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import { TimerContext } from "../../../../lib/context/TimerContext";
import { ReactComponent as DeleteIcon } from '../../icons/delete.svg'

import { TIMERS, TIMER, PROJECTS } from '../../../../lib/graphql/query'
import { DELETE_TIMER, UPDATE_TIMER } from '../../../../lib/graphql/mutation'

import { Types } from './Types'

export const TimerDetails = ({ timerId }: { timerId: any }) => {
  const types = ['STUDY', 'WORK', 'HOBBIE', 'ANY'];
  const { data, loading, error, refetch } = useQuery(TIMER, {
    variables: {
      id: timerId,
    }
  })
  const [deleteTimer] = useMutation(DELETE_TIMER, {
    update(cache, { data: { deleteTimer } }) {
      const { timers } = cache.readQuery<any>({ query: TIMERS })
      const index = timers.findIndex((timer: any) => timer.id === deleteTimer.id)
      if (index > -1) {
        timers.splice(index, 1)
      }
      cache.writeQuery({
        query: TIMERS,
        data: { timers: timers }
      })
    }
  })
  const [updateTimer] = useMutation(UPDATE_TIMER, {
    update(cache, { data: { updateTimer } }) {
      const { timer } = cache.readQuery<any>({ query: TIMER, variables: { id: timerId } })
      console.log("update -> updateTimer", updateTimer)
      console.log("update -> timer", timer)
      cache.writeQuery({
        query: TIMER,
        data: { timer: Object.assign(timer, updateTimer) }
      })
    }
  })


  React.useEffect(() => {
    console.log("data", data)
    if (data) {
      const timer = data.timer

      setTimerValue(timer.title)
      setProjectId(timer.project_id)
      setprojectDescription(timer.project_description ? timer.project_description : '')
      settimerNotes(timer.notes ? timer.notes : '')
    }
  }, [data])

  const { value: timerTitle, setValue: setTimerValue, bind: bindTitle } = useInput('')
  const { value: projectDescription, setValue: setprojectDescription, bind: bindProjectDescription } = useTextarea('')
  const { value: timerNotes, setValue: settimerNotes, bind: bindtimerNotes } = useTextarea('')
  const [timerDetailsId, setTimerDetailsId] = React.useContext(TimerContext)
  const [projectId, setProjectId] = React.useState('')
  const [timerType, setTimerType] = React.useState('ANY')

  if (loading) return (<div>Loading...</div>)

  const timerFetched = data ? data.timer : null;

  const onCancleDetails = () => {
    setTimerDetailsId(null)
    localStorage.clear()
  }
  const onDeleteTimer = async () => {
    await deleteTimer({ variables: { id: timerId } })
    setTimerDetailsId(null)
    localStorage.clear()
  }
  const onChangeProjectId = (id: string, description: string) => {
    setProjectId(id)
    setprojectDescription(description ? description : '')
  }
  const onChangeType = (type: string) => {
    setTimerType(type)
  }

  const onSubmitTimerDetails = async () => {
    console.log("onSubmitTimerDetails -> projectDescription", projectDescription)
    await updateTimer({
      variables: {
        id: timerId,
        title: timerTitle,
        project_id: projectId,
        project_description: projectDescription,
        notes: timerNotes,
        type: timerType
      }
    })

  }

  return (
    <div className="TimerDetails_wrapper">
      <h3>Details</h3>
      <div className="TimerDetails__body">
        <div><input placeholder="Title" className="input" {...bindTitle} /></div>

        <div className="TimerDetails__body__row">
          {timerFetched && <Projects timer={timerFetched} onChangeProjectId={onChangeProjectId} />}
          {timerFetched && <Types timer={timerFetched} types={types} onChangeType={onChangeType} />}
          <div>Times goes here</div>
        </div>
        <div>
          <textarea name="project_description" placeholder="Description of the Project" rows={4} className="textarea" {...bindProjectDescription} disabled={!projectId} />
        </div>
        <div>
          <textarea name="timer_notes" placeholder="Keep some notes" rows={10} className="textarea" {...bindtimerNotes} />
        </div>
        <div className="btn-block">
          <button className="btn btn__icon" onClick={onDeleteTimer}>
            <DeleteIcon />
          </button>
          <button className="btn" onClick={onCancleDetails}>Cancel</button>
          <button className="btn" onClick={onSubmitTimerDetails}>Save</button>
        </div>
      </div>
    </div>
  );
};

