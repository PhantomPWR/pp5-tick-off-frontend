// React library & hooks
import React, { useEffect, useState } from "react";

// Context hooks
import { 
  useProfileData, 
  useSetProfileData,
} from "../../contexts/ProfileDataContext";

// react-router-dom components for routing & page navigation
import { useParams } from "react-router-dom";

// Axios library for HTTP requests
import { axiosReq } from "../../api/axiosDefaults";

// Utils
import { fetchMoreData } from "../../utils/utils";

// React components
import InfiniteScroll from "react-infinite-scroll-component";

// Reusable components
import Asset from "../../components/Asset";
import { ProfileEditDropdown } from "../../components/MoreDropdown";
import ProfileList from "./ProfileList";
import Task from "../tasks/Task";

// Bootstrap components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

// Styles
import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";

// Assets
import NoResults from "../../assets/no-results.png"


function ProfilePage() {
  // Set up state variables
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profileTasks, setProfileTasks] = useState({ results: [] });
  const [assignedTasks, setAssignedTasks] = useState({ results: [] });
  const { id } = useParams();
  const { setProfileData } = useSetProfileData();
  const { pageProfile } = useProfileData();
  const [profile] = pageProfile.results;

  // Fetch data for profile, profile owner tasks and assigned tasks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: pageProfile },
          { data: profileTasks },
          { data: assignedTasks }
        ] =
        await Promise.all([
          axiosReq.get(`/profiles/${id}/`),
          axiosReq.get(`/tasks/?owner__profile=${id}`),
          axiosReq.get(`/tasks/?assigned_to=${id}`),
        ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: {results: [pageProfile]},
        }));
        setProfileTasks(profileTasks);
        setAssignedTasks(assignedTasks);
        setHasLoaded(true);
      } catch(err) {
        console.log(err);
      }
    }
    fetchData();
  }, [id, setProfileData]);

  console.log('profileTasks: ', profileTasks.results.length)
  console.log('assignedTasks: ', assignedTasks.results.length)

  // Calculate total task count
  const profileTaskCount = profileTasks.results.length;
  const assignedTaskCount = assignedTasks.results.length;
  const totalTaskCount = profileTaskCount + assignedTaskCount;

  console.log('totalTaskCount: ', totalTaskCount)

  // Returns profile & task details
  const mainProfile = (
    <>
      {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
      <Row className="px-3 text-center no-gutters">
        <Col lg={3} className="text-lg-left">
          <Image 
            className={styles.ProfileImage}
            roundedCircle 
            src={profile?.image}
          />
        </Col>
        <Col lg={6}>
          <h3 className="m-2">{profile?.owner}</h3>
          <div>Tasks</div>
          <Row className="row-cols-2">
            <Col>Created: {profileTaskCount}</Col>
            <Col>Assigned: {assignedTaskCount}</Col>
          </Row>
        </Col>
        {profile?.content && <Col className="p-3">{profile.content}</Col>}
      </Row>
    </>
  );

  // Returns profile tasks owned by profile owner
  const mainProfileTasks = (
    <>
      {profileTasks.results.length ? (
        <InfiniteScroll
          children={profileTasks.results.map((task) => (
            <Task key={task.id} {...task} setTasks={setProfileTasks} />
          ))}
          dataLength={profileTasks.results.length}
          loader={<Asset spinner />}
          hasMore={!!profileTasks.next}
          next={() => fetchMoreData(profileTasks, setProfileTasks)}
        />
      ) : (
        <Asset
          src={NoResults}
          message={`No results found, ${profile?.owner} hasn't posted yet.`}
        />
      )}
    </>
  );

  // Initialize task count
  let taskCount = 0;

  // Returns tasks assigned to profile owner
  const mainAssignedTasks = (
    <>
      {assignedTasks.results.length ? (
        <React.Fragment>
          <InfiniteScroll
            children={assignedTasks.results.map((task) => {
              console.log(task);
              if (task.assigned_to === profile.id) {
                return (
                  <Task key={task.id} {...task} setTasks={setAssignedTasks} />
                );
              } else {
                taskCount++;
                return null;
              }
            })}
            dataLength={assignedTasks.results.length}
            loader={<Asset spinner />}
            hasMore={!!assignedTasks.next}
            next={() => fetchMoreData(assignedTasks, setAssignedTasks)}
          />
          {taskCount === assignedTasks.results.length && (
            <Asset
              src={NoResults}
              message={`No results found. No tasks assigned to ${profile?.owner} yet.`}
            />
          )}
        </React.Fragment>
      ) : (
        <Asset
          src={NoResults}
          message={`No results found. No tasks assigned to ${profile?.owner} yet.`}
        />
      )}
    </>
  );

  return (
    <Row>
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <Container className={appStyles.Content}>
          {hasLoaded ? (
            <>
              {mainProfile}
              {mainProfileTasks}
              {mainAssignedTasks}
            </>
          ) : (
            <Asset spinner />
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <ProfileList />
      </Col>
    </Row>
  );
}

export default ProfilePage;