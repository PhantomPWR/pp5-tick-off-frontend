import React, { useEffect, useState, useCallback } from "react";
import { Form } from "react-bootstrap";
import axios from "axios";

const status_choices = {
  BACKLOG: "Backlog",
  TODO: "To Do",
  INPROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const StatusUpdateForm = ({ taskId, currentStatus, onUpdateStatus }) => {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const submitForm = useCallback(async () => {
    setLoading(true);
    try {
      await axios.patch(`/tasks/${taskId}/`, { task_status: newStatus });
      onUpdateStatus(newStatus);
    } catch (err) {
      // Handle error
    }
    setLoading(false);
  }, [taskId, newStatus, onUpdateStatus]);

  useEffect(() => {
    if (newStatus !== currentStatus && newStatus !== "") {
      submitForm();
    }
  }, [newStatus, currentStatus, submitForm]);

  return (
    <Form>
      <select value={newStatus} onChange={handleStatusChange}>
        <option value="">Select task status</option>
        {Object.keys(status_choices).map((status) => (
          <option key={status} value={status}>
            {status_choices[status]}
          </option>
        ))}
      </select>
    </Form>
  );
};

export default StatusUpdateForm;
