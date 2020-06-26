import React from 'react';

import { Projects } from './Projects'
import { useInput } from '../../../../lib'

import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

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

export const TimerDetails = ({ timer }: { timer: any }) => {
  console.log("TimerDetails -> timer", timer)
  const types = ['Study', 'Work', 'Hobbie'];
  const { value: timerTitle, setValue: setTimerValue, bind: bindTitle } = useInput(timer.title)
  const { data, refetch } = useQuery(TIMER, {
    variables: {
      id: timer.id,
    }
  })

  const timerFetched = data ? data.timer : null;


  return (
    <div className="TimerDetails_wrapper">
      <h3>Details</h3>
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

