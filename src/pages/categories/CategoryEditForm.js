// React library & hooks
import React, { useState, useEffect } from "react";

// react-router-dom components for page navigation
import { useHistory, useParams } from "react-router-dom";

// Axios library for HTTP requests
import { axiosReq } from "../../api/axiosDefaults";

// Bootstrap components
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

// Styles
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import styles from "../../styles/CategoryCreateEditForm.module.css";


function CategoryEditForm() {

  // State variables 
  const [errors, setErrors] = useState({});
  const [categoryData, setCategoryData] = useState({
    title: '',
    description: '',
  });

  // Destructure categoryData
  const {
    title,
    description,
  } = categoryData;

  const history = useHistory();
  const {id} = useParams();
  
  useEffect(() => {
    // Fetch category
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/categories/${id}/`);
        const {
          title,
          description,
        } = data;

        // Set category data
        setCategoryData({
          title,
          description,
        });
      } catch (err) {
          console.log(err);
        }
    };
    handleMount();
  }, [id]);

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
        await axiosReq.put(`/categories/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        history.push(`/categories/${id}`)
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
        update
      </Button>
    </div>
  );

  

  return (

    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={7} lg={7} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
        <Col className="py-2 p-0 p-md-2" md={5} lg={5}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
      </Row>
    </Form>
  );
}

export default CategoryEditForm;