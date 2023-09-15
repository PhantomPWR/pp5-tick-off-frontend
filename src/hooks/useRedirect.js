// React hooks
import { useEffect } from 'react';

// React router components
import { useHistory } from 'react-router';

// Axios library for HTTP requests
import axios from 'axios';

// Contexts
import { useCurrentUser } from '../contexts/CurrentUserContext';


export const useRedirect = (userAuthStatus) => {

  // Set up state variables
  const history = useHistory();
  const currentUser = useCurrentUser();

  // Redirect to user's tasks after login
  useEffect(() => {
    const handleMount = async () => {
      try {
        await axios.post('/dj-rest-auth/token/refresh/');
        // user IS logged in
        if (userAuthStatus === 'loggedIn') {
          const profileId = currentUser.profile_id;
          history.push(`/profiles/${profileId}`);
          // history.push('/');
        }
      } catch (err) {
        // user is NOT logged in
        if (userAuthStatus === 'loggedOut') {
          history.push('/signin');
        }
      }
    };

    handleMount();
  }, [history, userAuthStatus, currentUser]);
};