import React from 'react';
import { usePopper } from 'react-popper';

import './styles/index.scss'

export const Popper = ({ children, refEl, popperRef, visible }: { children: any, refEl: any, popperRef: any, visible: boolean }) => {
  // const refEl = useRef<any>(null)
  // const [visible, setVisibility] = useState(false)
  // const popperElRef = React.useRef(null)
  const arrowElRef = React.useRef(null)


  const { styles, attributes } = usePopper(refEl.current, popperRef.current, {
    placement: 'auto',
    // strategy:"fixed",
    modifiers: [
      { name: 'arrow', options: { element: arrowElRef.current } },
      // { name: 'preventOverflow', enabled: true }
    ],
  });
  // console.log("Popper -> arrowElRef", arrowElRef)


  return (<>
    <div ref={popperRef} style={styles.popper} {...attributes.popper} className={`${visible && 'popper_wrapper'}`}>
      {/* Popper element */}
      {visible && <div className="popper__children">{children}</div>}
      {visible && <div ref={arrowElRef} style={styles.arrow} className={`${visible && 'popper_arrow'}`} />}
    </div>
  </>
  );
};