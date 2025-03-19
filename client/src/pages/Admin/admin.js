import React from "react";
import { Tabs } from "antd";
import TheatreTable from "./TheatreTable";
import MovieListComponent from "./MovieListComponent";
function Admin() {
  const tabItems = [
    { key: "1", label: "Movies", children: <MovieListComponent /> },
    { key: "2", label: "Theatres", children: <TheatreTable></TheatreTable> },
  ];

  return (
    <>
      <div>
        <h1>Admin Page</h1>
        <Tabs items={tabItems}> </Tabs>
      </div>
    </>
  );
}

export default Admin;
