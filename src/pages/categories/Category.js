// React library & hooks
import React from "react";

// react-router-dom components for page navigation
import { Link, useHistory } from "react-router-dom";

// Axios library for HTTP requests
import { axiosRes } from "../../api/axiosDefaults";

// Bootstrap components
import { Card, Media } from "react-bootstrap";

// Reusable components
import { MoreDropdown } from "../../components/MoreDropdown";


const Category = (props) => {

  // State variables
  const history = useHistory();

  // Destructure categoryData
  const {
    id,
    title,
    description,
    categoryPage
  } = props;

  // Handle edit
  const handleEdit = () => {
    history.push(`/categories/${id}/edit`);
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/categories/${id}/`);
      history.goBack();
    } catch (err) {}
  };

  return (
    <Card>
      <Card.Body>
        <Media className="row">
              {/* Category Description */}
              <Media.Body className="align-self-center">
                <Link to={`/categories/${id}`}>
                  <h3>{title}</h3>
                </Link>
                  <p>{description}</p>
              </Media.Body>
          {/* MoreDropdown */}
          <div className="col d-flex justify-content-end">
            { categoryPage && (
              <MoreDropdown
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              />
            )}
          </div>
        </Media>
      </Card.Body>
    </ Card>
  );
};

export default Category;