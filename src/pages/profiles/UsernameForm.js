// React library & hooks
import React, { useEffect, useState } from "react";

// react-router-dom components for page navigation
import { useHistory, useParams } from "react-router-dom";

// Context hooks
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

// Axios library for HTTP requests
import { axiosRes } from "../../api/axiosDefaults";

// Bootstrap components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

// Styles
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";


const UsernameForm = () => {

  // Set up state variables
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  // Check if profile matches current user
  useEffect(() => {
    if (currentUser?.profile_id?.toString() === id) {
      setUsername(currentUser.username);
    } else {
      history.push("/");
    }
  }, [currentUser, history, id]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put("/dj-rest-auth/user/", {
        username,
      });
      setCurrentUser((prevUser) => ({
        ...prevUser,
        username,
      }));
      history.goBack();
    } catch (err) {
      // console.log(err);
      setErrors(err.response?.data);
    }
  };

  return (
    <Row>
      <Col className="py-2 mx-auto text-center" md={6}>
        <Container className={appStyles.Content}>
          <Form onSubmit={handleSubmit} className="my-2">
            <Form.Group>
              <Form.Label>Change username</Form.Label>
              <Form.Control
                placeholder="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Form.Group>
            {errors?.username?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Orange}`}
              onClick={() => history.goBack()}
            >
              cancel
            </Button>
            <Button
              className={`${btnStyles.Button} ${btnStyles.Orange}`}
              type="submit"
            >
              save
            </Button>
          </Form>
        </Container>
      </Col>
    </Row>
  );
};

export default UsernameForm;