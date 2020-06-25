import React from 'react';
import { Popper } from '../../Popper';

import { Projects } from '../Projects'

export const TimerDetails = ({ timerId }: { timerId: string }) => {
  const types = ['Study', 'Work', 'Hobbie'];


  return (
    <div className="TimerDetails_wrapper">
      <h3>Details</h3>
      <div className="TimerDetails__body">
        <input placeholder="Title" className="input" />

        <Projects timerId={timerId} />

        {types.map((type, i) => (
          <label key={i}>
            {type}
            <input type="checkbox" name={type} />
          </label>
        ))}

      </div>
    </div>
  );
};

