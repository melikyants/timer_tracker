import React from "react";
import { Popper } from "../../Popper";

import { useInput, typeToHuman } from "../../../../lib";
import { Timer_timer } from "../../../../lib/graphql/queries/Timer/__generated__/Timer";
import { TimerType } from "../../../../lib/graphql/globalTypes";

export const Types = ({
  timer,
  onChangeType,
}: {
  timer: Timer_timer;
  onChangeType: (type: TimerType) => void;
}) => {
  const inputProjectRef = React.useRef(null);
  const inputProjectPopperRef = React.useRef(null);

  const [visible, setVisibility] = React.useState(false);
  // const typeNormal = typeToHuman(type);
  const defaultValueType = timer.type ? typeToHuman(timer.type) : "Select Type";
  const { setValue: setTimerType, bind: bindTimerType } = useInput(
    defaultValueType
  );

  React.useEffect(() => {
    if (timer) {
      const typeNormal = timer.type ? typeToHuman(timer.type) : "Select Type";
      setTimerType(typeNormal);
    }
  }, [timer, setTimerType]);

  const onClickInputType = () => {
    setVisibility(!visible);
  };

  const onSelectType = (type: TimerType) => {
    const typeNormal = typeToHuman(type);
    onChangeType(type);
    setTimerType(typeNormal);
    setVisibility(false);
  };

  return (
    <div>
      <input
        className="input"
        name="type"
        placeholder="select a type"
        ref={inputProjectRef}
        onClick={onClickInputType}
        {...bindTimerType}
      />
      <Popper
        refEl={inputProjectRef}
        popperRef={inputProjectPopperRef}
        visible={visible}
      >
        <div>
          <ul className="project_list">
            <li onClick={(e) => onSelectType(TimerType.ANY)}>Any</li>
            <li onClick={(e) => onSelectType(TimerType.STUDY)}>Study</li>
            <li onClick={(e) => onSelectType(TimerType.WORK)}>Work</li>
            <li onClick={(e) => onSelectType(TimerType.PERSONAL_PROJECT)}>
              Personal Project
            </li>
            <li onClick={(e) => onSelectType(TimerType.HOBBIE)}>Hobbie</li>
          </ul>
        </div>
      </Popper>
    </div>
  );
};
