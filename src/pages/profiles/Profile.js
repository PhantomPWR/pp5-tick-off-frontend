// React library & hooks
import React from "react";

// react-router-dom components for page navigation
import { Link } from "react-router-dom";

// Assets
import Avatar from "../../components/Avatar";

// Styles
import styles from "../../styles/Profile.module.css";

const Profile = (props) => {
  const { profile, mobile, imageSize = 40 } = props;
  const { id, image, owner } = profile;


  return (
    <div
      className={`my-3 d-flex align-items-center ${mobile && "flex-column"}`}
    >
      <div>
        <Link className="align-self-center" to={`/profiles/${id}`}>
          <Avatar src={image} height={imageSize} />
        </Link>
      </div>
      <div className={`mx-1 ${styles.WordBreak}`}>
        <p className='m-0 fs-6'>{owner}</p>
      </div>
    </div>
  );
};

export default Profile;