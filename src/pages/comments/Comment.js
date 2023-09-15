// React library & hooks
import React, { useState } from "react";

// Context hooks
import { useCurrentUser } from "../../contexts/CurrentUserContext";

// react-router-dom components for page navigation
import { Link } from "react-router-dom";

// Axios library for HTTP requests
import { axiosRes } from "../../api/axiosDefaults";

// Reusable components
import Avatar from "../../components/Avatar";
import CommentEditForm from "./CommentEditForm";
import { MoreDropdown } from "../../components/MoreDropdown";

// Bootstrap components
import Media from "react-bootstrap/Media";

// Styles
import styles from "../../styles/Comment.module.css";


const Comment = (props) => {
  // Destructure props
  const {
    profile_id,
    profile_image,
    owner,
    updated_date,
    content,
    id,
    setTask,
    setComments,
  } = props;

  // State variables
  const [showEditForm, setShowEditForm] = useState(false);
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  // Handle delete comment
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/comments/${id}/`);
      setTask((prevTask) => ({
        results: [
          {
            ...prevTask.results[0],
            comments_count: prevTask.results[0].comments_count - 1,
          },
        ],
      }));

      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch (err) {}
  };

  return (
    <>
      <hr />
      <Media className="row">
        <div className="row align-items-center">
          {/* Date */}
          <div className="col-2">
            <span className={styles.Date}>{updated_date}</span>
          </div>
          <div className="col d-flex justify-content-start">
            {/* Profile Image */}
            <Link to={`/profiles/${profile_id}`}>
              <Avatar src={profile_image}  height={70}/>
            </Link>
            <div className="col mt-2">
              {/* Username */}
              <span className={styles.Owner}>{owner}</span>
              {/* Comment Content */}
              <Media.Body className="align-self-center">
                {showEditForm ? (
                  <CommentEditForm
                  id={id}
                  profile_id={profile_id}
                  content={content}
                  profileImage={profile_image}
                  setComments={setComments}
                  setShowEditForm={setShowEditForm}
                  />
                  ) : (
                  <p>{content}</p>
                )}
              </Media.Body>
            </div>
          </div>
          {/* MoreDropdown */}
          <div className="col d-flex justify-content-end">
            {is_owner && !showEditForm && (
              <MoreDropdown
                handleEdit={() => setShowEditForm(true)}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </Media>
    </>
  );
};

export default Comment;