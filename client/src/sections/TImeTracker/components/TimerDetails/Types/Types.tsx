import React from 'react'
import { Popper } from '../../Popper';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { useInput } from '../../../../../lib'

export const Types = ({ timer, types, onChangeType }: { timer: any, types: string[], onChangeType: (type: string) => void }) => {
  console.log("Projects -> timerId", timer)

  const inputProjectRef = React.useRef(null);
  const inputProjectPopperRef = React.useRef(null);

  const [visible, setVisibility] = React.useState(false);
  const defaultValueType = timer.type ? timer.type : 'Select Type'
  const { value: timerType, setValue: setTimerType, bind: bindTimerType } = useInput(defaultValueType)

  const onClickInputType = () => {
    setVisibility(!visible);
  };

  const onSelectType = (type: string) => {
    onChangeType(type)
    setTimerType(type)
    setVisibility(false);
  }

  return (
    <div>
      <input className="input" name="type" placeholder="select a type" ref={inputProjectRef} onClick={onClickInputType} {...bindTimerType} />
      <Popper refEl={inputProjectRef} popperRef={inputProjectPopperRef} visible={visible}>
        <div>
          <ul className="project_list">
            {types.map((type, index) => (<li key={index} onClick={(e) => onSelectType(type)}>{type}</li>))}
          </ul>
        </div>
      </Popper>
    </div>

  )
}
