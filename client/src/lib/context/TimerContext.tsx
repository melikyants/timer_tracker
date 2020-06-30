import React from "react";

// Create Context Object
export const TimerContext = React.createContext<any>([]);
const initialState = localStorage.getItem("timerDetailsId") || ''

// Create a provider for components to consume and subscribe to changes
export const TimerContextProvider = ({ children }: { children: any }) => {
  const [timerDetailsId, setTimerDetailsId] = React.useState<string>(initialState);

  React.useEffect(() => {

    if (timerDetailsId) {
      localStorage.setItem("timerDetailsId", timerDetailsId)
    }

  }, [timerDetailsId])

  return (
    <TimerContext.Provider value={[timerDetailsId, setTimerDetailsId]}>
      {children}
    </TimerContext.Provider>
  );
};