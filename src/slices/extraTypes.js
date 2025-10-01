import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";

const initialState = {
    systemTypes: [],
    classes: [],
    rooms: [],

    fetchSystemTypesDataStatus: "idle",
    fetchClassesDataStatus: "idle",
    fetchRoomsStatus: "idle",
}
export const fetchSystemTypesData = createAsyncThunk(
    'ExtraTypesSlice/fetchBooksData',
    async () => {
        const {request} = useHttp();
        return await request(`${BackUrl}level/system/list/`, "GET", null)
    }
)

export const fetchClassesData = createAsyncThunk(
    'ExtraTypesSlice/fetchClassesData',
    async () => {
        const {request} = useHttp();
        return await request(`${BackUrl}level/system/list/`, "GET", null)
    }
)

export const fetchRooms = createAsyncThunk(
    'ExtraTypesSlice/fetchRooms',
    async () => {
        const {request} = useHttp();
        return await request(`${BackUrl}level/system/list/`, "GET", null)
    }
)



const ExtraTypesSlice = createSlice({
    name: "ExtraTypesSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchSystemTypesData.pending, state => {
                state.fetchSystemTypesDataStatus = 'loading'
            })
            .addCase(fetchSystemTypesData.fulfilled, (state, action) => {
                state.systemTypes = action.payload.data
                state.fetchSystemTypesDataStatus = "success"
            })
            .addCase(fetchSystemTypesData.rejected, state => {
                state.fetchSystemTypesDataStatus = 'error'
            })

            .addCase(fetchClassesData.pending, state => {
                state.fetchClassesDataStatus = 'loading'
            })
            .addCase(fetchClassesData.fulfilled, (state, action) => {
                state.classes = action.payload.data
                state.fetchClassesDataStatus = "success"
            })
            .addCase(fetchClassesData.rejected, state => {
                state.fetchClassesDataStatus = 'error'
            })

            .addCase(fetchRooms.pending, state => {
                state.fetchRoomsStatus = 'loading'
            })
            .addCase(fetchRooms.fulfilled, (state, action) => {
                state.rooms = action.payload.data
                state.fetchRoomsStatus = "success"
            })
            .addCase(fetchRooms.rejected, state => {
                state.fetchRoomsStatus = 'error'
            })


    }
})

const {actions, reducer} = ExtraTypesSlice;

export default reducer

export const {} = actions

