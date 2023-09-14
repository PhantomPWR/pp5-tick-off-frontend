// React library & hooks
import React, { useState, useEffect } from "react";

// Context hooks
import { useCurrentUser } from "../../contexts/CurrentUserContext";

// react-router-dom components for page navigation
import { Link, useHistory } from "react-router-dom";

// Axios library for HTTP requests
import axios from "axios";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";

// Reusable components
import { MoreDropdown } from "../../components/MoreDropdown";
import TaskStatus from "../../components/TaskStatus";
import StatusUpdateForm from "../../components/StatusUpdateForm";

// Bootstrap components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Media from "react-bootstrap/Media";
import Modal from "react-bootstrap/Modal";
import { response } from "msw";

// Styles
import styles from "../../styles/Task.module.css";

// Define priority choices
const priority_choices = {
  PRIORITY1: "High",
  PRIORITY2: "Medium",
  PRIORITY3: "Low",
};

const Task = (props) => {
  // Destructure task props
  const {
    id,
    owner,
    assigned_to,
    task_status,
    priority,
    category,
    title,
    description,
    image,
    created_date,
    due_date,
    completed_date,
    comment_count,
    taskPage,
  } = props;

  // Get current user from context
  const currentUser = useCurrentUser();

  // Check if current user is task owner
  const is_owner = currentUser?.username === owner;

  // Set up state variables
  const [assignedUser, setAssignedUser] = useState(null);
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const currentDate = new Date();
  const isDueDateInPast = new Date(due_date).setHours(0,0,0,0) < currentDate.setHours(0,0,0,0);
  const isDueDateToday =
  new Date(due_date).toLocaleDateString() === currentDate.toLocaleDateString();

  const [taskStatus, setTaskStatus] = useState(props.task_status);
  const [showStatusUpdateForm, setShowStatusUpdateForm] = useState(true);
  const [taskCategory, setTaskCategory] = useState([]);

  // Handle task status update
  const handleStatusUpdate = async (newStatus) => {
    setTaskStatus(newStatus);
    setShowStatusUpdateForm(newStatus !== 'COMPLETED');
  };

  // Open modal
  const openModal = () => {
    setShowModal(true);
  };

  // Handle task edit
  const handleEdit = () => {
    history.push(`/tasks/${id}/edit`);
  };

  // Handle task delete
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/tasks/${id}/`);
      history.goBack();
    } catch (err) {
      // console.log(err);
    }
  };

    // Fetch task categories from the API
    useEffect(() => {
      const fetchTaskCategory = async () => {
        try {
          const response = await axiosReq.get(`/categories/${category}`);
          setTaskCategory(response.data.title);
        } catch (error) {
          console.error('Error fetching category options:', error);
        }
      };
      
      fetchTaskCategory();
    }, [category]);
  
  // Fetch assigned user
  useEffect(() => {
    if (assigned_to) {
      axios.get(`/profiles/${assigned_to}`).then((response) => {
        setAssignedUser(response.data.owner);
      });
    } else {
      setAssignedUser("No users assigned yet.");
    }
  }, [assigned_to]);

  return (
    <Card className={styles.Task}>
      <Card.Body className={styles.TaskBody}>
        <Media className="align-items-center justify-content-between">
          {!taskPage ? (
            /* Task List Header */
            <Link to={`/tasks/${id}`}>
              <Row className="row-cols-2 d-flex justify-content-between align-items-center">
                <Col className="text-start">
                  {title && (
                    <Card.Title className={`fs-4 ${styles.TaskTitle}`}>{title}</Card.Title>
                  )}
                </Col>
                <Col className="text-end">
                  {isDueDateInPast && task_status !== 'COMPLETED' && showStatusUpdateForm ? (
                    <span className={`px-3 py-2 ${styles.StatusBadge} ${styles.OverDue}`}>
                      Overdue{' '}
                      {new Date(due_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  ) : isDueDateToday && task_status !== 'COMPLETED' && showStatusUpdateForm ? (
                    <span className={`px-3 py-2 ${styles.StatusBadge} ${styles.DueToday}`}>
                      Due Today{' '}
                      {new Date(due_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  ) : task_status !== 'COMPLETED' ? (
                    <span className={`px-3 py-2 ${styles.StatusBadge} ${styles.DueDate}`}>
                      Due on{' '}
                      {/* {due_date} */}
                      {new Date(due_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  ) : task_status === 'COMPLETED' || taskStatus === 'COMPLETED' ? (
                      <span className={`px-3 py-2 ${styles.StatusBadge} ${styles.Completed}`}>
                        Completed on{' '}
                        {new Date(completed_date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>

                  ):null}
                </Col>
              </Row>
            </Link>
          ):null}
          {/* Task Detail Header */}
          <div className="row text-center">
             {taskPage && title && (
                    <Card.Title className={`fs-4 mb-5 ${styles.TaskTitle}`}>{title}</Card.Title>
                  )}
          </div>
          <div className="d-flex row-cols-4 justify-content-between align-items-center">
            {taskPage && (
              <span className="col-md-3">
                Created<br />
                {new Date(created_date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
              </span>
            )}
            {taskPage && isDueDateInPast && task_status !== 'COMPLETED' && showStatusUpdateForm ? (
              <span className={`col-md-3 ms-auto ${styles.StatusBadge} ${styles.OverDue}`}>
                Overdue<br />
                {new Date(due_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            ) : taskPage && isDueDateToday && task_status !== 'COMPLETED' && showStatusUpdateForm ? (
              <span className={`col-md-3 ms-auto ${styles.StatusBadge} ${styles.DueToday}`}>
                Due Today<br />
                {new Date(due_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            ) : taskPage && task_status !== 'COMPLETED' ? (
              <span className={`col-md-3 ms-auto ${styles.StatusBadge} ${styles.DueDate}`}>
                Due on<br />
                {/* {due_date} */}
                {new Date(due_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            ):null}
            {task_status !== 'COMPLETED' && taskPage && showStatusUpdateForm ? (
              <span className={`col-md-3 ms-auto`}>
                <span>Update Task Status</span>
                <StatusUpdateForm
                  taskId={id}
                  onUpdateStatus={handleStatusUpdate}
                />
              </span>
            ) : (
              <>
              {taskPage && (task_status === 'COMPLETED' || taskStatus === 'COMPLETED') ? (
                <span className={`col-md-3 ms-auto ${styles.StatusBadge} ${styles.Completed}`}>
                  Completed on<br/>
                  {new Date(completed_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
                </span>
              ) : null}
              </>
            )}
            <span className="col-1 d-flex justify-content-end">
              {is_owner && taskPage && (
                <MoreDropdown
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              )}
            </span>
          </div>
        </Media>
      </Card.Body>

      <Card.Body className={styles.TaskBody}>
        {/* Task List Body */}
        {!taskPage ? (
          <Row className="row-cols-2">
            <Col className={`d-flex flex-column justify-content-center align-items-start ${styles.Meta}`}>
              <div className={styles.MetaDetail}>
                {/* Owner */}
                <span className="me-1">
                  <i className="fas fa-crown"/>
                  {owner}
                </span>
              </div>
              <div className={styles.MetaDetail}>
                {/* Assigned User */}
                <span className="me-1">
                  <i className="fas fa-user-check"/>
                  {assignedUser}
                </span>
              </div>
              <div className={styles.MetaDetail}>
                {/* Comment Count */}
                <span className="me-1">
                  <i className="far fa-comments" />
                  {comment_count}
                </span>
              </div>
            </Col>
            <Col className={`d-flex flex-column justify-content-center align-items-end ${styles.Meta}`}>
              <div className="d-flex flex-column align-items-start">
                <div className={styles.MetaDetail}>
                  <span className="me-1">
                    <i className="fas fa-triangle-exclamation"></i>
                    {priority_choices[priority]}
                  </span>
                </div>
                <div className={styles.MetaDetail}>
                  {/* Task Status */}
                  <span className="me-1">
                    <i className="fas fa-list-check"></i>
                    { !taskStatus ? (
                      <TaskStatus taskStatus={task_status} />
                    ) : (
                      <TaskStatus taskStatus={taskStatus} />
                    ) }
                  </span>
                </div>
                <div className={styles.MetaDetail}>
                  {/* Category */}
                  <span className="me-1">
                    <i className="far fa-folder" />
                    {taskCategory}
                  </span>
              </div>
              </div>
            </Col>
          </Row>
        ) : (
          // Task Detail Body
          <>
          <Card.Body className={!taskPage ? "py-0" : ""}>

        <div className="row row-cols-1 row-cols-lg-4 justify-content-between">
          <div className="col col-lg-8">
            {taskPage && description && (
              <Card.Text align={"left"}>{description}</Card.Text>
            )}
          </div>
          {taskPage && (
            <div className="col col-lg-2 text-center">
              <Card.Text className="d-flex align-items-center">
                <i className="fas fa-paperclip"></i> Attachment
              </Card.Text>
              <Card.Img
                src={image}
                alt={title}
                onClick={openModal}
                className="w-50
                 mx-auto"
              />
              <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="lg"
                closeVariant="black"
              >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                  <Card.Img src={image} alt={title} />
                </Modal.Body>
              </Modal>
            </div>
          )}
        </div>
      </Card.Body>
          <div className={styles.TaskBar}>
            {/* Assigned User */}
            <div align="center">
              <strong className="fw-bold">Assigned to: </strong>
              <div className="row">
                <p className="col-6">
                  <i className="fas fa-crown"></i>
                  {owner}
                </p>
                <p className="col-6">
                  <i className="fas fa-user-check" />
                  {assignedUser}
                </p>
              </div>
            </div>
            <div className="row row-cols-3 justify-content-between">
              {/* Category */}
              <span className="col">
                <i className="far fa-folder" />
                Category: {taskCategory}
              </span>

              {/* Task Status */}
              <span className="col">
                <span><i className="fas fa-list-check"></i>Status:  </span>
                { !taskStatus ? (
                  <TaskStatus taskStatus={task_status} />
                ) : (
                  <TaskStatus taskStatus={taskStatus} />
                ) }
              </span>

              {/* Priority */}
              <span className="col">
                <i className="fas fa-triangle-exclamation"></i>
                Priority: {priority_choices[priority]}
              </span>
            </div>
          </div>
          </>
        )}
        
      </Card.Body>
    </Card>
  );
};

export default Task;
