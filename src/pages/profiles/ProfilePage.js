import React, { useEffect, useState } from "react";

import { Container, Row, Col, Image } from "react-bootstrap";
import Asset from "../../components/Asset";

import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";

import ProfileList from "./ProfileList";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { 
  useProfileData, 
  useSetProfileData,
} from "../../contexts/ProfileDataContext";
import InfiniteScroll from "react-infinite-scroll-component";
import Task from "../tasks/Task";
import { fetchMoreData } from "../../utils/utils";
import NoResults from "../../assets/no-results.png"
import { ProfileEditDropdown } from "../../components/MoreDropdown";

function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profileTasks, setProfileTasks] = useState({ results: [] });
  const [assignedTasks, setAssignedTasks] = useState({ results: [] });
  const { id } = useParams();
  const { setProfileData } = useSetProfileData();
  const { pageProfile } = useProfileData();
  const [profile] = pageProfile.results;

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

  const profileTaskCount = profileTasks.results.length;
  const assignedTaskCount = assignedTasks.results.length;
  const totalTaskCount = profileTaskCount + assignedTaskCount;

  console.log('totalTaskCount: ', totalTaskCount)

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
  /* 
    Returns all tasks created by the current or viewed profile's user
  */
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

  let taskCount = 0;

  /* 
    Returns all tasks assigned to the current or viewed profile's user
  */
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