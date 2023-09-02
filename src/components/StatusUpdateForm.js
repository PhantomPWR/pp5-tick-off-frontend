import React, { useEffect, useState, useCallback } from "react";
import Form from 'react-bootstrap/Form';
import axios from "axios";
import styles from "../styles/StatusUpdateForm.module.css";

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

  // useEffect(() => {
  //   if (newStatus !== currentStatus && newStatus !== "") {
  //     submitForm();
  //   }
  // }, [newStatus, currentStatus, submitForm]);

  useEffect(() => {
  let cancelRequest = false;

  const submitForm = async () => {
    setLoading(true);
    try {
      await axios.patch(`/tasks/${taskId}/`, { task_status: newStatus });
      if (!cancelRequest) {
        onUpdateStatus(newStatus);
      }
    } catch (err) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  if (newStatus !== currentStatus && newStatus !== "") {
    submitForm();
  }

  return () => {
    cancelRequest = true;
  };
}, [newStatus, currentStatus, onUpdateStatus, taskId]);


  return (
    <Form>
      <div className="form-group">
        <select className={`form-select ${styles.Select}`} value={newStatus} onChange={handleStatusChange}>
          <option value="">Select status</option>
          {Object.keys(status_choices).map((status) => (
            <option key={status} value={status}>
              {status_choices[status]}
            </option>
          ))}
        </select>
      </div>
    </Form>
  );
};

export default StatusUpdateForm;
