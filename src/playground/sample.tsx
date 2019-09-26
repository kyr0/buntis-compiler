import * as React from "react";
export function hello() {
  const obj = [{ name: "1" }];
  const name = "hello";
  return (
    <div>
      {hello}
      <span className={name === "hello" ? "1" : 2}>
        {obj.map(item => (
          <i>{item.name}</i>
        ))}
      </span>
    </div>
  );
}
