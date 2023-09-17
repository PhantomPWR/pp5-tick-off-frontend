// React library
import React from 'react';

// Reusable components
import Asset from './Asset';

// Assets
import NoResults from '../assets/no-results.png';

// Styles
import styles from '../styles/NoResults.module.css';


const NotFound = () => {
  return (
    <div className={styles.NotFound}>
        <Asset src={NoResults} message={"Sorry, the page you're looking for doesn't exist"} />
    </div>
  )
}

export default NotFound