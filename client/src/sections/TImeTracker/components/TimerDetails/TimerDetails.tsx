import React from 'react';

import { Projects } from './Projects'
import { useInput } from '../../../../lib'

import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import { TimerContext } from "../../../../lib/context/TimerContext";

const TIMER = gql`
  query Timer($id: ID!) {
    timer(id: $id) {
      id
      title
      project_id
      type
      notes
      description
      start
      end
      project_title
      isRunning
    }
  }
`;

export const TimerDetails = ({ timerId }: { timerId: any }) => {
  // console.log("TimerDetails -> timer", timer)
  const types = ['Study', 'Work', 'Hobbie'];
  const { data, loading, error, refetch } = useQuery(TIMER, {
    variables: {
      id: timerId,
    }
  })
  React.useEffect(() => {
    console.log("data", data)
    if (data) {
      setTimerValue(data.timer.title)
    }

  }, [data])

  const { value: timerTitle, setValue: setTimerValue, bind: bindTitle } = useInput('')
  const [timerDetailsId, setTimerDetailsId] = React.useContext(TimerContext)

  if (loading) return (<div>Loading...</div>)

  const timerFetched = data ? data.timer : null;


  const onCancleDetails = () => {
    setTimerDetailsId(null)
  }

  return (
    <div className="TimerDetails_wrapper">
      <h3>Details</h3>
      <div>
        <button onClick={onCancleDetails}>Cancel</button>
        <button>Save</button>
      </div>
      <div className="TimerDetails__body">
        <div><input placeholder="Title" className="input" {...bindTitle} /></div>

        {timerFetched && <Projects timer={timerFetched} />}
        <div className="TimerDetails__body_types">
          {types.map((type, i) => (
            <label key={i}>
              {type}
              <input type="checkbox" name={type} />
            </label>
          ))}
        </div>

      </div>
    </div>
  );
};

