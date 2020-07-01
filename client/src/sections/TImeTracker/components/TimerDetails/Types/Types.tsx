import React from 'react'
import { Popper } from '../../Popper';

import { TimerType as ITimerTYpe } from "../../../../../lib/graphql/globalTypes";

import { useInput } from '../../../../../lib'

export const Types = ({ timer, onChangeType }: { timer: any, onChangeType: (type: ITimerTYpe) => void }) => {

  const inputProjectRef = React.useRef(null);
  const inputProjectPopperRef = React.useRef(null);

  const [visible, setVisibility] = React.useState(false);
  const defaultValueType = timer.type ? timer.type : 'Select Type'
  const { setValue: setTimerType, bind: bindTimerType } = useInput(defaultValueType)

  const onClickInputType = () => {
    setVisibility(!visible);
  };

  const onSelectType = (type: ITimerTYpe) => {
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
            <li onClick={(e) => onSelectType(ITimerTYpe.ANY)}>Any</li>
            <li onClick={(e) => onSelectType(ITimerTYpe.STUDY)}>Study</li>
            <li onClick={(e) => onSelectType(ITimerTYpe.WORK)}>Work</li>
            <li onClick={(e) => onSelectType(ITimerTYpe.HOBBIE)}>Hobbie</li>
          </ul>
        </div>
      </Popper>
    </div>

  )
}
