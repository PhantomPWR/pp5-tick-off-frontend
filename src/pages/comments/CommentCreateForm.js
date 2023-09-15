// React library & hooks
import React, { useState } from "react";

// react-router-dom components for page navigation
import { Link } from "react-router-dom";

// Axios library for HTTP requests
import { axiosRes } from "../../api/axiosDefaults";

// Reusable components
import Avatar from "../../components/Avatar";

// Bootstrap components
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

// Styles
import styles from "../../styles/CommentCreateEditForm.module.css";


function CommentCreateForm(props) {

  // State variables
  const [content, setContent] = useState("");

  // Destructure props
  const { task, setTask, setComments, profileImage, profile_id } = props;

  // Handle change in comment content
  const handleChange = (event) => {
    setContent(event.target.value);
  };

  // Handle submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosRes.post("/comments/", {
        content,
        task,
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: [data, ...prevComments.results],
      }));
      setTask((prevTask) => ({
        results: [
          {
            ...prevTask.results[0],
            comment_count: prevTask.results[0].comment_count + 1,
          },
        ],
      }));
      setContent("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form className="mt-2" onSubmit={handleSubmit}>
      <Form.Group>
        <InputGroup>
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profileImage} />
          </Link>
          <Form.Control
            className={styles.Form}
            placeholder="Add your comment here..."
            as="textarea"
            value={content}
            onChange={handleChange}
            rows={2}
          />
        </InputGroup>
      </Form.Group>
      <button
        className={`${styles.Button} btn d-block ms-auto`}
        disabled={!content.trim()}
        type="submit"
      >
        post
      </button>
    </Form>
  );
}

export default CommentCreateForm;