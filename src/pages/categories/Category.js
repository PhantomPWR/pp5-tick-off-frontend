import React from "react";
import { Card, Media } from "react-bootstrap";
import { MoreDropdown } from "../../components/MoreDropdown";
import { axiosRes } from "../../api/axiosDefaults";
import { Link, useHistory } from "react-router-dom";

const Category = (props) => {
  const {
    id,
    title,
    description,
    // setCategories,
    categoryPage
  } = props;
  // const [showEditForm, setShowEditForm] = useState(false);
  const history = useHistory();

  const handleEdit = () => {
    history.push(`/categories/${id}/edit`);
  };

  // const handleDelete = async () => {
  //   try {
  //     await axiosRes.delete(`/categories/${id}/`);
  //     setCategories((prevCategories) => ({
  //       ...prevCategories,
  //       results: prevCategories.results.filter((category) => category.id !== id),
  //     }));
  //   } catch (err) {}
  // };

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