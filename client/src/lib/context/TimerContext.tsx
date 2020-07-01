import React from "react";

// Create Context Object
export const TimerContext = React.createContext<any>([]);

const initialState = localStorage.getItem("timerDetailsId") || ''

type Action = { type: "TIMER_RUNNING"; payload: { id: string } } |
{ type: "START_TIMER" } |
{ type: "UPDATE_TIMER_ID", payload: { runningId: string } } |
{ type: "STOP_TIMER" } |
{ type: "OPEN_TIMER_DETAILS", payload: string } |
{ type: "CLOSE_TIMER_DETAILS" }

interface contextState {
  timerDetailsId: string | null,
  isRunning: boolean,
  isRunningId: string,
}

const reducer = (state: contextState, action: Action): contextState => {
  switch (action.type) {
    case "TIMER_RUNNING": {
      return { ...state, isRunning: true, isRunningId: action.payload.id }
    }
    case "START_TIMER": {
      return { ...state, isRunning: true }
    }
    case "UPDATE_TIMER_ID": {
      return { ...state, isRunningId: action.payload.runningId }
    }
    case "STOP_TIMER": {
      return { ...state, isRunning: false }
    }
    case "OPEN_TIMER_DETAILS":
      return { ...state, timerDetailsId: action.payload }
    case "CLOSE_TIMER_DETAILS": {
      localStorage.removeItem('timerDetailsId')
      return { ...state, timerDetailsId: null }
    }
    default:
      throw new Error()
  }
}

// Create a provider for components to consume and subscribe to changes
export const TimerContextProvider = ({ children }: { children: any }) => {
  const [timerR, dispatchTimerR] = React.useReducer(reducer, {
    timerDetailsId: initialState,
    isRunning: false,
    isRunningId: '',
  });

  React.useEffect(() => {

    if (timerR.timerDetailsId) {
      localStorage.setItem("timerDetailsId", timerR.timerDetailsId)
    }

  }, [timerR.timerDetailsId])


  return (
    <TimerContext.Provider value={[timerR, dispatchTimerR]}>
      {children}
    </TimerContext.Provider>
  );
};