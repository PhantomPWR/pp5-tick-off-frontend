import React from "react";

const status_choices = {
  BACKLOG: "Backlog",
  TODO: "To Do",
  INPROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const TaskStatus = ({ taskStatus }) => {
  return <span>
      {taskStatus ? status_choices[taskStatus] : "Status Unavailable"}
    </span>;
};

export default TaskStatus;
