import React from "react";

export const useTextarea = (initialValue: string) => {
  const [value, setValue] = React.useState(initialValue);
  console.log("useTextarea -> value", value)

  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
      }
    }
  };
};