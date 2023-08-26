import React, { useState, useEffect } from "react";
import styles from "../../styles/Task.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link, useHistory } from "react-router-dom";
import { MoreDropdown } from "../../components/MoreDropdown";
import axios from "axios";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import StatusUpdateForm from "../../components/StatusUpdateForm";
import TaskStatus from "../../components/TaskStatus";
import { Card, Media, Modal } from "react-bootstrap";
import { response } from "msw";


const priority_choices = {
  PRIORITY1: "1",
  PRIORITY2: "2",
  PRIORITY3: "3",
};

const Task = (props) => {
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

  const [taskStatus, setTaskStatus] = useState(props.task_status);
  const [showStatusUpdateForm, setShowStatusUpdateForm] = useState(true);
  const [taskCategory, setTaskCategory] = useState([]);
  const handleStatusUpdate = async (newStatus) => {
    setTaskStatus(newStatus);
    setShowStatusUpdateForm(newStatus !== 'COMPLETED');
  };

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const [assignedUser, setAssignedUser] = useState(null);
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const currentDate = new Date();
  // const dueDate = due_date;
  const isDueDateInPast = new Date(due_date) < currentDate;
  const isDueDateToday =
    new Date(due_date) === currentDate;

  const openModal = () => {
    setShowModal(true);
  };

  const handleEdit = () => {
    history.push(`/tasks/${id}/edit`);
  };

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
          <Link to={`/tasks/${id}`}>
            {title && (
              <Card.Title className="fs-4 text-center">{title}</Card.Title>
            )}
          </Link>
          <div className="d-flex row-cols-4 justify-content-between align-items-center">
            <span className="col-md-3">
              Created<br />
              {new Date(created_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
            </span>
            {isDueDateInPast && task_status !== 'COMPLETED' && showStatusUpdateForm ? (
              <span className={`col-md-3 ms-auto ${styles.OverDue}`}>
                Overdue<br />
                {new Date(due_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            ) : isDueDateToday && task_status !== 'COMPLETED' && showStatusUpdateForm ? (
              <span className={`col-md-3 ms-auto ${styles.DueToday}`}>
                Due Today<br />
                {new Date(due_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            ) : (
              <span className="col-md-3 ms-auto">
                Due on<br />
                {/* {due_date} */}
                {new Date(due_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
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
              {task_status === 'COMPLETED' || taskStatus === 'COMPLETED' ? (
                <span className={`col-md-3 ms-auto ${styles.Completed}`}>
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
          <div className="row">
            {/* Category */}
            <span className="col-md-3">
              <i className="far fa-folder" />
              Category: {taskCategory}
            </span>

            {/* Task Status */}
            <span className="col-md-3">
              <span><i className="fas fa-list-check"></i>Status:  </span>
              { !taskStatus ? (
                <TaskStatus taskStatus={task_status} />
              ) : (
                <TaskStatus taskStatus={taskStatus} />
              ) }
            </span>

            {/* Priority */}
            <span className="col-md-3">
              <i className="fas fa-triangle-exclamation"></i>
              Priority: {priority_choices[priority]}
            </span>

            {/* Comment Count */}
            <span className="col-md-3">
              <i className="far fa-comments" />
              Comments: {comment_count}
            </span>
          </div>
        </div>
      </Card.Body>
      <Card.Body>
        <div className="row row-cols-1 row-cols-lg-4 justify-content-between">
          <div className="col col-lg-8">
            {description && (
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
    </Card>
  );
};

export default Task;
