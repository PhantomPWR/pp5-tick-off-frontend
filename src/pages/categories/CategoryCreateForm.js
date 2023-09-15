// React library & hooks
import React, { useState } from "react";

// Axios library for HTTP requests
import { axiosReq } from "../../api/axiosDefaults";

// Bootstrap components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

// Styles
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import styles from "../../styles/TaskCreateEditForm.module.css";
import { useHistory } from "react-router-dom";


function CategoryCreateForm() {

  // State variables
  const [errors, setErrors] = useState({});
  const history = useHistory();

  // Destructure categoryData
  const [categoryData, setCategoryData] = useState({
    title: '',
    description: '',
  });

  const {
    title,
    description,
  } = categoryData;

  // Handle form input
  const handleChange = (event) => {
    setCategoryData({
      ...categoryData,
      [event.target.name]: event.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
  
    try {
        const {data} = await axiosReq.post('/categories/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        history.push(`/categories/${data.id}`)
    } catch(err){
        if (err.response?.status !== 401){
          // console.log(err.response?.data);
          setErrors(err.response?.data);
        }
    }

  }

  // Form fields
  const textFields = (
    <div className="text-center">
      
      {/* Title */}
      <Form.Group>
        <Form.Label>Category Title</Form.Label>
        <Form.Control
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
        />
      </Form.Group>
      {errors?.title?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      
      {/* Description */}
      <Form.Group>
        <Form.Label>Category Description</Form.Label>
        <Form.Control
            type="text"
            name="description"
            value={description}
            onChange={handleChange}
        /> 
      </Form.Group>
      {errors?.description?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
    
      <Button
        className={`${btnStyles.Button} ${btnStyles.Orange}`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Orange}`} type="submit">
        create
      </Button>
    </div>
  );

  

  return (

    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6} lg={6} className="d-none d-md-block p-0 p-md-2 mx-auto">
          <h1 className={`${styles.Title} text-center`}>Create Category</h1>
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default CategoryCreateForm;