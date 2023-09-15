// React hooks
import { useEffect, useRef, useState } from "react";

const useClickOutsideToggle = () => {

  // State variables
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);

  // Close dropdown when user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [ref]);

  return { expanded, setExpanded, ref };
};

export default useClickOutsideToggle;