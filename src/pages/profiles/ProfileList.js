// React library & hooks
import React from "react";

// Context hooks
import { useProfileData } from "../../contexts/ProfileDataContext";

// Reusable components
import Profile from "./Profile";

// Bootstrap components
import Container from "react-bootstrap/Container";

// Styles
import appStyles from "../../App.module.css";

// Assets
import Asset from "../../components/Asset";


const ListProfiles = ({ mobile }) => {
  const { listProfiles } = useProfileData();

  return (
    <Container
      className={`${appStyles.Content} ${
        mobile && "d-lg-none text-center mb-3"
      }`}
    >
      {listProfiles.results.length ? (
        <>
          <p>User list</p>
          {mobile ? (
            <div className="d-flex justify-content-around">
              {listProfiles.results.slice(0, 4).map((profile) => (
                <Profile key={profile.id} profile={profile} mobile />
              ))}
            </div>
          ) : (
            listProfiles.results.map((profile) => (
              < Profile key={profile.id} profile={profile} />
            ))
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default ListProfiles;