import {io} from "socket.io-client"
import {BackUrlForDoc} from "constants/global";

// "undefined" means the URL will be computed from the `window.location` object
// const URL =  process.env.NODE_ENV === 'production' ? undefined : BackUrlForDoc;
//
// // @ts-ignore
// export const socket = io(URL, {
//     autoConnect: false
// });