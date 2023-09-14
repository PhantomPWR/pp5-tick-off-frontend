// React library & hooks
import React, { useEffect, useState } from "react";

// Context hooks
import { useCurrentUser } from "../../contexts/CurrentUserContext";

// React router useParams hook for getting URL parameters
import { useParams } from "react-router";

// Axios library for HTTP requests
import { axiosReq } from "../../api/axiosDefaults";

// Utils
import { fetchMoreData } from "../../utils/utils";

// Reusable components
import Asset from "../../components/Asset";
import Comment from "../comments/Comment"
import CommentCreateForm from "../comments/CommentCreateForm";
import Task from "./Task";

import InfiniteScroll from "react-infinite-scroll-component";

// Bootstrap components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Styles
import appStyles from "../../App.module.css";
import styles from "../../styles/TaskPage.module.css";


function TaskPage() {
  // Set up state variables
  const { id } = useParams();
  const [task, setTask] = useState({ results: [] });
  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [ comments, setComments ] = useState({ results: [] });

  // Fetch tasks & comments
  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: task }, {data: comments}] = await Promise.all([
          axiosReq.get(`/tasks/${id}`),
          axiosReq.get(`/comments/?task=${id}`),
        ]);

        setTask({ results: [task] });
        setComments(comments);
      } catch (err) {
        // console.log(err);
      }
    };

    handleMount();

  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2">
        <Task {...task.results[0]} setTasks={setTask} taskPage />
        <h5 className={styles.SectionHeading}>Discussion</h5>
        <Container className={appStyles.Content}>
          {currentUser ? (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              task={id}
              setTask={setTask}
              setComments={setComments}
            />
          ) : comments.results.length ? (
            "Task Comments"
          ) : null}
          {comments.results.length ? (
            <InfiniteScroll
              children={comments.results.map((comment) => (
                <Comment
                  key={comment.id}
                  {...comment}
                  setTask={setTask}
                  setComments={setComments}
                />
              ))}
              dataLength={comments.results.length}
              loader={<Asset spinner />}
              hasMore={!!comments.next}
              next={() => fetchMoreData(comments, setComments)}
            />
          ) : currentUser ? (
            <span>No comments yet.</span>
          ) : (
            <span>No comments yet.</span>
          )}
        </Container>
      </Col>
    </Row>
  );
}

export default TaskPage;