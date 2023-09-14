// React library & hooks
import React, { useEffect, useState } from "react";

// Context hooks
import { useCurrentUser } from "../../contexts/CurrentUserContext";

// react-router-dom components for page navigation
import { useLocation, useParams } from "react-router-dom";

// Axios library for HTTP requests
import { axiosReq } from "../../api/axiosDefaults";

// Utils
import { fetchMoreData } from "../../utils/utils";

// React components
import InfiniteScroll from "react-infinite-scroll-component";

// Reusable components
import APIConnectionCheck from "../../components/APIConnectionCheck";
import Asset from "../../components/Asset";
import ProfileList from "../profiles/ProfileList";
import SearchBar from "../../components/SearchBar";
import Task from "./Task";

// Bootstrap components
import Container from "react-bootstrap/Container";

// Styles
import appStyles from "../../App.module.css";
import styles from "../../styles/TaskList.module.css";

// Assets
import NoResults from "../../assets/no-results.png";


function TaskList({ message, filter = "" }) {
  
  // Set up state variables
  const [tasks, setTasks] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const currentUser = useCurrentUser();
  const { taskStatus, taskPriority } = useParams();
  const [query, setQuery] = useState('');

  // Check API connection to tasks
  APIConnectionCheck('tasks');

  useEffect(() => {

    const fetchTasks = async () => {
      try {
        let url = `/tasks/?${filter}`;
        if (query) {
          url += `&search=${query}`;
        }
        if (taskStatus) {
          url += `&task_status=${taskStatus}`;
        }
        if (taskPriority) {
          url += `&priority=${taskPriority}`;
        }
        const { data } = await axiosReq.get(url);
        setTasks(data);
        setHasLoaded(true);
      } catch (err) {
        // console.log(err);
      }
    };

  setHasLoaded(false);
  // stop results flashing - fetch after 1s delay
  const timer = setTimeout(() => {
    fetchTasks();
  }, 1000);
  
  // Cleanup Function 
  return () => {
    clearTimeout(timer);
  };
  
}, [filter, query, pathname, currentUser, taskStatus, taskPriority]);


return (
  <Container className="h-100">
      <div className="py-2 p-0 p-lg-2 MainCol">
        <ProfileList mobile />
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <SearchBar query={query} setQuery={setQuery} taskCount={tasks.count} />
        {hasLoaded ? (
          <>
            {console.log('tasks: ', tasks)}
            {tasks.results.length ? (
              <InfiniteScroll
                key={tasks.results.map(task => task.id).join(",")}
                children={
                  tasks.results.map((task) => (
                    <Task key={task.id} {...task} setTasks={setTasks} />
                ))}
                dataLength={tasks.results.length}
                loader={<Asset spinner />}
                hasMore={!!tasks.next}
                next={() => fetchMoreData(tasks, setTasks)}
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
      </div>
  </Container>
  );
}

export default TaskList;