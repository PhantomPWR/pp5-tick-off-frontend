// React library & hooks
import React, { useState, useEffect } from "react";

// React router components
import { useParams } from "react-router";

// Axios library for HTTP requests
import { axiosReq } from "../../api/axiosDefaults";

// Reusable components
import Category from "../categories/Category";

// Bootstrap components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


function CategoryPage() {

  // State variables
  const { id } = useParams();
  const [category, setCategory] = useState({ results: [] });

  // Fetch category
  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: category }] = await Promise.all([
          axiosReq.get(`/categories/${id}`),
        ]);

        setCategory({ results: [category] });
      } catch (err) {
        // console.log(err);
      }
    };

    handleMount();

  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2">
        <Category {...category.results[0]} setCategories={setCategory} categoryPage />
      </Col>
    </Row>
  );
}

export default CategoryPage;