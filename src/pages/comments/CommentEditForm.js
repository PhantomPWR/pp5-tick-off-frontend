// React library & hooks
import React, { useState } from "react";

// Axios library for HTTP requests
import { axiosRes } from "../../api/axiosDefaults";

// Bootstrap components
import Form from "react-bootstrap/Form";

// Styles
import styles from "../../styles/CommentCreateEditForm.module.css";


function CommentEditForm(props) {

  // State variables
  const [formContent, setFormContent] = useState(content);

  // Destructure props
  const { id, content, setShowEditForm, setComments } = props;

  // Handle change in comment content
  const handleChange = (event) => {
    setFormContent(event.target.value);
  };

  // Handle submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put(`/comments/${id}/`, {
        content: formContent.trim(),
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) => {
          return comment.id === id
            ? {
                ...comment,
                content: formContent.trim(),
                updated_at: "now",
              }
            : comment;
        }),
      }));
      setShowEditForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="pe-1">
        <Form.Control
          className={styles.Form}
          as="textarea"
          value={formContent}
          onChange={handleChange}
          rows={2}
        />
      </Form.Group>
      <div className="text-right">
        <button
          className={styles.Button}
          onClick={() => setShowEditForm(false)}
          type="button"
        >
          cancel
        </button>
        <button
          className={styles.Button}
          disabled={!content.trim()}
          type="submit"
        >
          save
        </button>
      </div>
    </Form>
  );
}

export default CommentEditForm;