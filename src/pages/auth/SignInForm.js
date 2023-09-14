// React library & hooks
import React, { useState } from 'react';

// Context hooks
import { useSetCurrentUser } from '../../contexts/CurrentUserContext';

// react-router-dom components for page navigation
import { Link, useHistory } from 'react-router-dom';

// Custom hooks
import { useRedirect } from '../../hooks/useRedirect';

// Axios library for HTTP requests
import axios from 'axios';

// Utils
import { setTokenTimestamp } from '../../utils/utils';

// Bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

// Styles
import appStyles from '../../App.module.css';
import btnStyles from '../../styles/Button.module.css';
import styles from '../../styles/SignInUpForm.module.css';


function SignInForm() {
  // Set up state variables
  const setCurrentUser = useSetCurrentUser();
  const [signInData, setSignInData] = useState({
    username: '',
    password: '',
  });
  const { username, password } = signInData;
  const [errors, setErrors] = useState({});
  const history = useHistory();

  // Redirect to user's tasks after login
  useRedirect('loggedIn');

  // Handle form submission
  const handleSubmit = async (event) => {
    // Prevent page reload
    event.preventDefault();
    try {
      // Send POST request
      const { data } = await axios.post('/dj-rest-auth/login/', signInData);
      setCurrentUser(data.user);
      setTokenTimestamp(data);
      history.goBack();
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  // Handle form input
  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Row className={styles.Row}>
      <Col className='m-auto p-0 p-md-2' md={6}>
        <Container className={`${appStyles.Content} p-4`}>
          <h3 className='text-center'>Welcome to Tick Off</h3>
          <hr />
          <p className='text-center fw-bold'>Tick Off is a simple task manager</p>
          <p className='text-center'>Create, assign and manage tasks.</p>
          <p className='text-center fw-bold'>Sign in or register to start ticking off.</p>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='username'>
              <Form.Label className='d-none'>Username</Form.Label>
              <Form.Control
                type='text'
                placeholder='Username'
                name='username'
                className={styles.Input}
                value={username}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.username?.map((message, idx) => (
              <Alert key={idx} variant='warning'>
                {message}
              </Alert>
            ))}

            <Form.Group controlId='password'>
              <Form.Label className='d-none'>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Password'
                name='password'
                className={styles.Input}
                value={password}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password?.map((message, idx) => (
              <Alert key={idx} variant='warning'>
                {message}
              </Alert>
            ))}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Orange}`}
              type='submit'
            >
              Sign in
            </Button>
            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant='warning' className='mt-3'>
                {message}
              </Alert>
            ))}
          </Form>
        </Container>
        <Container className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to='/register'>
            Don't have an account? <span>Sign up here.</span>
          </Link>
        </Container>
      </Col>
    </Row>
  );
}

export default SignInForm;