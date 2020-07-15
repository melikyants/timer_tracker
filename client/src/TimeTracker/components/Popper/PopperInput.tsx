import React from "react";
import { usePopper } from "react-popper";

import "./styles/index.scss";
import { InputSelect } from "../../../lib/components";

interface PopperInputI {
  inputName: string;
  children: any;
  bindInput: any;
  inputPlaceholder: string;
  visible: boolean;
  setVisible: any;
}

export const PopperInput = ({
  children,
  bindInput,
  inputName,
  inputPlaceholder,
  visible,
  setVisible,
}: PopperInputI) => {
  const elRef = React.useRef<HTMLDivElement | null>(null);
  const popperRef = React.useRef<HTMLDivElement | null>(null);
  const arrowElRef = React.useRef(null);

  const { styles, attributes } = usePopper(elRef.current, popperRef.current, {
    placement: "left-end",
    strategy: "fixed", //keeps the dropdown above the overflow
    modifiers: [
      { name: "arrow", options: { element: arrowElRef.current } },
      // { name: "preventOverflow", enabled: true },
    ],
  });

  React.useEffect(() => {
    if (visible) {
      const handleDocumentClick = (evt: any) => {
        // evt.preventDefault();

        if (
          (popperRef.current !== null &&
            popperRef.current.contains(evt.target)) ||
          elRef.current?.parentNode?.contains(evt.target)
        ) {
          return;
        }
        //close the dropdown if its anywhere but the dropdown
        setVisible(false);
      };
      // listen for clicks and close dropdown on body
      document.addEventListener("mousedown", handleDocumentClick);
      return () => {
        document.removeEventListener("mousedown", handleDocumentClick);
      };
    }
  }, [visible, setVisible]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("handleClick -> e", e.target);
    console.log("handleClick -> visible", visible);
    setVisible(!visible);
  };
  return (
    <>
      <InputSelect
        type="text"
        name={inputName}
        placeholder={inputPlaceholder}
        ref={elRef}
        onClick={handleClick}
        bind={bindInput}
      />
      <div
        ref={popperRef}
        style={styles.popper}
        {...attributes.popper}
        className={`${visible && "popper_wrapper"}`}
      >
        {visible && <div className="popper__children">{children}</div>}
        <div
          ref={arrowElRef}
          style={styles.arrow}
          className={`${visible && "popper_arrow"}`}
        />
      </div>
    </>
  );
};
