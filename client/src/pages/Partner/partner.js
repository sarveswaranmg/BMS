import React from "react";
import TheatreList from "./TheatreList";
import { Tabs } from "antd";
function Partner() {
  const items = [
    {
      key: "1",
      label: "Theatres",
      children: <TheatreList></TheatreList>,
    },
  ];
  return (
    <div>
      <h1>Partner Page</h1>
      <Tabs items={items}></Tabs>
    </div>
  );
}

export default Partner;
