

import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, ROLES} from "constants/global";


const initialState = {
	data: {
		role:  process.env.NODE_ENV !== "production" ? ROLES.Methodist : null,
		name: 'Ulug',
		surname: "dasdas",
		username: 'asdasdas'
	},
	isCheckedPassword: false,
	fetchUserDataStatus: "idle"
}
export const  fetchMe = createAsyncThunk(
	'user/fetchMe',
	async (refresh_token) => {
		const {request} = useHttp();
		const headers = {
			"Authorization": "Bearer " + refresh_token,
			'Content-Type': 'application/json',
			"Access-Control-Allow-Methods" : "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization"
		}
		return await request(`${BackUrl}refresh`,"POST",null,headers)
	}
)

export const fetchUserData = createAsyncThunk(
	'UserSlice/fetchUserData',
	async (token) => {
		const {request} = useHttp();
		return await request(`${BackUrl}send_user/${token}`,"GET")
	}
)

const UserSlice = createSlice({
	name: "UserSlice",
	initialState,

	reducers: {
		setUserData: (state,action) => {
			state.data = action.payload.data
			sessionStorage.setItem('token', action.payload.data.access_token);
			sessionStorage.setItem('refresh_token', action.payload.data.refresh_token);
			localStorage.setItem('user', action.payload.data.username);
			localStorage.setItem('role', action.payload.data.role);
			state.fetchUserDataStatus = 'success';
		},
		setCheckedPassword: (state,action) => {
			state.isCheckedPassword = action.payload
		},
		setClearPassword: (state) => {
			state.isCheckedPassword = false
		},
		changeUserData: (state,action) => {
			state.data[action.payload.name] = action.payload.value
		}
	},
	extraReducers: builder => {
		builder
			.addCase(fetchMe.pending,state => {state.meLoadingStatus = 'loading'} )
			.addCase(fetchMe.fulfilled,(state, action) => {
				state.fetchUserDataStatus = 'success';
				state.data = {...action.payload.data.info,img: action.payload.data.info.img_url}
				localStorage.setItem("system_type", action.payload.data.info.system_name)
				sessionStorage.setItem('token', action.payload.data.access_token);
				sessionStorage.setItem('oldToken', action.payload.data.old_access_token);
			})
			.addCase(fetchMe.rejected,state => {state.meLoadingStatus = 'error'} )

			.addCase(fetchUserData.pending,state => {state.fetchUserDataStatus = 'loading'} )
			.addCase(fetchUserData.fulfilled,(state, action) => {
				state.fetchUserDataStatus = 'success';
				state.data = action.payload.data
			})
			.addCase(fetchUserData.rejected,state => {state.fetchUserDataStatus = 'error'})
	}
})

const {actions,reducer} = UserSlice;

export default reducer

export const {setUserData,changeUserData,setCheckedPassword,setClearPassword} = actions