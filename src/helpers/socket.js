import { io } from 'socket.io-client';
import {BackUrl} from "constants/global";

export const socket = io("http://192.168.68.100:5000");