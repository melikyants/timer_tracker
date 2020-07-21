import React from "react";
import { PopperInput } from "../../../../lib/components/Popper";

import { typeToHuman } from "../../../../lib/helpers";
import { useInput } from "../../../../lib/Hooks";

import { Timer_timer } from "../../../../lib/graphql/queries/Timer/__generated__/Timer";
import { TimerType } from "../../../../lib/graphql/globalTypes";

export const Types = ({
  timer,
  onChangeType,
}: {
  timer: Timer_timer;
  onChangeType: (type: TimerType) => void;
}) => {
  const defaultValueType = timer.type ? typeToHuman(timer.type) : "Select Type";
  const { setValue: setTimerType, bind: bindTimerType } = useInput(
    defaultValueType
  );
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (timer) {
      const typeNormal = timer.type ? typeToHuman(timer.type) : "Select Type";
      setTimerType(typeNormal);
    }
  }, [timer, setTimerType]);

  const onSelectType = (type: TimerType) => {
    const typeNormal = typeToHuman(type);
    onChangeType(type);
    setTimerType(typeNormal);
    setVisible(false);
  };

  return (
    <PopperInput
      inputName="type"
      inputPlaceholder="select a type"
      bindInput={bindTimerType}
      visible={visible}
      setVisible={setVisible}
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
    </PopperInput>
  );
};
