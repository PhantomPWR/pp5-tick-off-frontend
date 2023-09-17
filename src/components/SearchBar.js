// React library & hooks
import React, { useEffect, useRef, useState } from "react";

// Axios library for HTTP requests
import { axiosReq } from "../api/axiosDefaults";

// Bootstrap components
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Styles
import styles from '../styles/SearchBar.module.css';


function SearchBar({ query, setQuery, taskCount }) {

    // Set up task category choices state variable & setter
    const [
      taskCategoryChoices,
      setTaskCategoryChoices
    ] = useState([{'value': '', 'label': ''}]);

    // Fetch task category choices from the API
    useEffect(() => {
      const fetchTaskCategoryChoices = async () => {
        try {
          const response = await axiosReq.get('/category-choices/');
          const categoryChoices = response.data.map(category => ({
            key: category.id,
            value: category.value,
            label: category.label
          }));
          setTaskCategoryChoices(categoryChoices);
        } catch (error) {
          console.error('Error fetching category options:', error);
        }
      };
      
      fetchTaskCategoryChoices();
    }, []);

    // Set up form ref
    const formRef = useRef(null);
    const clearForm = () => {
        formRef.current.reset();
        setQuery('');
    };

  return (
    <Form
      ref={formRef}
      className={styles.SearchBar}
      onSubmit={(event) => event.preventDefault()}
    >
      {/* Search bar & result count */}
      <div className='row row-cols-2 d-flex justify-content-between align-items-center'>
        <div className="col-9">
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="me-sm-2"
            placeholder="Search tasks"
            aria-label="Search Bar"
          />
        </div> {/* /col */}
        <div className="col-3 text-center">
          <p className="me-sm-2">
            Search results: {taskCount}
          </p>
        </div> {/* /col */}
      </div> {/* /row */}

      {/* Filter buttons */}
      <div className="row row-cols-4 mb-3 justify-content-even g-3">
        {/* Task Category */}
        <div className="col">
          <Form.Control
            className={`form-select ${styles.Select}`}
            as="select"
            name="task_category"
            onChange={(event) => setQuery(event.target.value)}
            aria-label="task category"
          >
            <option value="">Select category</option>
            {taskCategoryChoices.map((categoryChoice) => (
              <option 
                key={categoryChoice.value} 
                value={categoryChoice.label}>
                  {categoryChoice.label}
              </option>
            ))}
          </Form.Control>
        </div> {/* /col */}
        {/* Task Status */}
        <div className="col">
          <Form.Control
            className={`form-select ${styles.Select}`}
            as="select"
            name="task_status"
            onChange={(event) => setQuery(event.target.value)}
            aria-label="task status"
          >
            <option value="">Select status</option>
            <option key="BACKLOG" value="BACKLOG">Backlog</option>
            <option key="TODO" value="TODO">To Do</option>
            <option key="INPROGRESS" value="INPROGRESS">In Progress</option>
            <option key="COMPLETED" value="COMPLETED">Completed</option>
          </Form.Control>
        </div> {/* /col */}

        {/* Task Priority */}
        <div className="col">
          <Form.Control
            className={`form-select ${styles.Select}`}
            as="select"
            name="priority"
            onChange={(event) => setQuery(event.target.value)}
            aria-label="task priority"
          >
            <option value="">Select priority</option>
            <option key="PRIORITY1" value="PRIORITY1">High</option>
            <option key="PRIORITY2" value="PRIORITY2">Medium</option>
            <option key="PRIORITY3" value="PRIORITY3">Low</option>
          </Form.Control>
        </div> {/* /col */}
        {/* Clear filters */}
        <div className="col text-end">
          <Button className={styles.OrangeOutline} type="button" onClick={clearForm}>
            Clear filters
          </Button>
        </div> {/* /col */}
      </div> {/* /row */}
    </Form>
  );
}

export default SearchBar;
