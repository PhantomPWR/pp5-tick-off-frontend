// React library & hooks
import { useEffect } from "react";

// Axios library for HTTP requests
import { axiosReq } from "../api/axiosDefaults";

const APIConnectionCheck = (urlQuery) => {
    useEffect(() => {
        const checkAPIConnection = async () => {
            axiosReq.get(`/${urlQuery}/`)
                .then(response => {
                    // API is connected
                    console.log(`API connection to ${urlQuery} successful`);
                })
                .catch (error => {
                    // API is not connected
                    console.log(`API connection to ${urlQuery} failed`);
                });
        };
        checkAPIConnection();
    }, [urlQuery]);

    return null
}


export default APIConnectionCheck
