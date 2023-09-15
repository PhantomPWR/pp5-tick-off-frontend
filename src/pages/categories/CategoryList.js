// React library & hooks
import React, { useEffect, useState } from "react";

// Context hooks
import { useCurrentUser } from "../../contexts/CurrentUserContext";

// React router components
import { useLocation } from "react-router";

// Axios library for HTTP requests
import { axiosReq } from "../../api/axiosDefaults";

// Utils
import { fetchMoreData } from "../../utils/utils";

// React components
import InfiniteScroll from "react-infinite-scroll-component";

// Reusable components
import Asset from "../../components/Asset";
import Category from "../categories/Category";

// Bootstrap components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';

// Styles
import appStyles from "../../App.module.css";
import styles from "../../styles/CategoryList.module.css";

// Assets
import NoResults from "../../assets/no-results.png";


function CategoryList({ message, filter = "" }) {

  // State variables
  const [categories, setCategories] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const currentUser = useCurrentUser();
  const [query, setQuery] = useState('');

  useEffect(() => {
  
    // 
    const fetchCategories = async () => {
      try {
        const { data } = await axiosReq.get(`/categories/?${filter}&search=${query}`);
          setCategories(data);
          setHasLoaded(true);
      } catch (err) {
        // console.log(err);
      }
    };

    setHasLoaded(false);
    // stop results flashing - fetch after 1s delay
    const timer = setTimeout(() => {
      fetchCategories();
    }, 1000);

    // Cleanup Function 
    return () => {
      clearTimeout(timer);
    };

  }, [filter, query, pathname, currentUser]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Form
          className={styles.SearchBar}
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="me-sm-2"
            placeholder="Search categories"
            aria-label="Search Bar"
          />
        </Form>
        {hasLoaded ? (
          <>
            {console.log('categories: ', categories)}
            {categories.results.length ? (
              <InfiniteScroll
                key={categories.results.map((category) => category.id).join(",")}
                children={
                  categories.results.map((category) => (
                    <Category key={category.id} {...category} setCategories={setCategories} />
                  ))
                }
                dataLength={categories.results.length}
                loader={<Asset spinner />}
                hasMore={!!categories.next}
                next={() => fetchMoreData(categories, setCategories)}
              />

            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}

          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
    </Row>
  );
}

export default CategoryList;