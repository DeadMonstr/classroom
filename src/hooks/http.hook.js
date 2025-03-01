import {useCallback} from "react";

export const useHttp = () => {
    const request = async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json','Accept': 'application/json'}) => {
        try {
            const response = await fetch(url, {method,mode: 'cors', body, headers});

            if (!response.ok) {

                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }
            return await response.json();
        } catch(e) {

            throw e;
        }
    }

    return {request}
}