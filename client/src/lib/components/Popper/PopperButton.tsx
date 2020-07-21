import React from "react";
import { usePopper } from "react-popper";
import { Button } from "..";

import "./styles/index.scss";

interface PopperButtonI {
  children: any;
  buttonTitle: string;
  visible: boolean;
  setVisible: any;
}

export const PopperButton = ({
  children,
  buttonTitle,
  visible,
  setVisible,
}: PopperButtonI) => {
  const elRef = React.useRef<HTMLButtonElement | null>(null);
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
          elRef.current?.contains(evt.target)
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
  // console.log("Popper -> arrowElRef", arrowElRef)

  const handleClick = () => {
    setVisible(!visible);
  };

  return (
    <>
      <Button
        text={buttonTitle}
        ref={elRef}
        onClick={handleClick}
        type="button"
      />
      <div
        ref={popperRef}
        style={styles.popper}
        {...attributes.popper}
        className={`${visible && "popper_wrapper"}`}
      >
        {/* Popper element */}
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
