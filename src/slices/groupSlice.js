import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";

const initialState = {
	data: {},
	subjectLevels: [],
	curriculum: [],
	fetchGroupDataStatus: "idle"
}

export const  fetchGroup = createAsyncThunk(
	'GroupSlice/fetchGroup',
	async (id) => {
		const {request} = useHttp();

		return await request(`${BackUrl}group_profile2/${id}`,"GET",null,headers())
	}
)

export const  fetchGroupObserver = createAsyncThunk(
	'GroupSlice/fetchGroupObserver',
	async (id) => {
		const {request} = useHttp();
		const token = sessionStorage.getItem("oldToken")

		return await request(`${BackUrl}group_observer/${id}`,"GET",null,headers())
	}
)


const GroupSlice = createSlice({
	name: "GroupSlice",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchGroup.pending,state => {state.fetchGroupDataStatus = 'loading'} )
			.addCase(fetchGroup.fulfilled,(state, action) => {
				state.fetchGroupDataStatus = 'success';
				state.data = action.payload.data
				state.subjectLevels = action.payload.subject_levels
				state.curriculum = action.payload.curriculum
			})
			.addCase(fetchGroup.rejected,state => {state.fetchGroupDataStatus = 'error'})

			.addCase(fetchGroupObserver.pending,state => {state.fetchGroupDataStatus = 'loading'} )
			.addCase(fetchGroupObserver.fulfilled,(state, action) => {
				state.fetchGroupDataStatus = 'success';
				state.data = action.payload.data
			})
			.addCase(fetchGroupObserver.rejected,state => {state.fetchGroupDataStatus = 'error'})
	}
})

const {actions,reducer} = GroupSlice;

export default reducer

export const {} = actions