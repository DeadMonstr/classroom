import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";

const initialState = {
	id: null,
	name: null,
	desc: null,
	percentage : null,
	img: null,
	levels: [],
	canDelete: false,
	finished_percentage: false,
	fetchSubjectDataStatus : "idle",
	fetchLevelsDataStatus : "idle"
}
export const fetchSubjectData = createAsyncThunk(
	'SubjectSlice/fetchSubjectData',
	async (id) => {
		const {request} = useHttp();
		return await request(`${BackUrl}subject/${id}`,"GET",null,headers())
	}
)

export const fetchSubjectLevelsData = createAsyncThunk(
	'SubjectSlice/fetchSubjectLevelsData',
	async (id) => {
		const {request} = useHttp();
		return await request(`${BackUrl}info_level/${id}`,"GET",null,headers())
	}
)
const SubjectSlice = createSlice({
	name: "SubjectSlice",
	initialState,
	reducers: {
		setDataSubject: (state,action) => {
			state.id = action.payload.id
			state.name = action.payload.name
			state.desc = action.payload.desc
			state.img = action.payload.img
			state.canDelete = action.payload.status_deleted
		},
		setLevel: (state,action) => {
			state.levels = action.payload.levels
		},
		changeLevel: (state,action) => {
			if (action.payload.type === "delete") {
				state.levels = state.levels.filter(item => item.id !== action.payload.id)
			} else if (action.payload.type === "change") {
				state.levels = state.levels.map(item => {
					if (item.id  === action.payload.id) {
						return {...item,...action.payload.data}
					}
					return item
				})
			}
		}
	},
	extraReducers: builder => {
		builder
			.addCase(fetchSubjectData.pending,state => {state.fetchSubjectDataStatus = 'loading'} )
			.addCase(fetchSubjectData.fulfilled,(state, action) => {
				state.fetchSubjectDataStatus = 'success';
				state.id = action.payload.data.id
				state.name = action.payload.data.name
				state.desc = action.payload.data.desc
				state.img = action.payload.data.img
				state.finished_percentage = action.payload.data.finished_percentage
				state.canDelete = action.payload.data.status_deleted

			})
			.addCase(fetchSubjectData.rejected,state => {state.fetchSubjectDataStatus = 'error'})

			.addCase(fetchSubjectLevelsData.pending,state => {state.fetchLevelsDataStatus = 'loading'} )
			.addCase(fetchSubjectLevelsData.fulfilled,(state, action) => {
				state.fetchLevelsDataStatus = 'success';
				state.levels = action.payload.data
			})
			.addCase(fetchSubjectLevelsData.rejected,state => {state.fetchLevelsDataStatus = 'error'})
	}
})

const {actions,reducer} = SubjectSlice;

export default reducer

export const {setDataSubject,setLevel,changeLevel} = actions