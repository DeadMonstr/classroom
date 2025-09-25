import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    list: [],
    listStatus: "idle",
    studentsForParent: [],
    studentsForParentStatus: "idle",
}

export const fetchParentsList = createAsyncThunk(
    "parentStudentSlice/fetchParentsList",
    ({location}) => {
        const {request} = useHttp()
        return request(`${BackUrl}parent/get_list/${location}`, "GET", null, headers())
    }
)

export const fetchParentStudents = createAsyncThunk(
    "parentStudentSlice/fetchParentStudents",
    ({teacher, parent}) => {
        const {request} = useHttp()
        return request(`${BackUrl}parent/students/by-teacher/${teacher}/${parent}`, "GET", null, headers())
    }
)

const parentStudentSlice = createSlice({
    name: "parentStudentSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchParentsList.pending, (state) => {
                state.listLoading = "loading"
            })
            .addCase(fetchParentsList.fulfilled, (state, action) => {
                state.list = action.payload
                state.listStatus = "idle"
            })
            .addCase(fetchParentsList.rejected, (state) => {
                state.listStatus = "error"
            })

            .addCase(fetchParentStudents.pending, (state) => {
                state.studentsForParentStatus = "loading"
            })
            .addCase(fetchParentStudents.fulfilled, (state, action) => {
                state.studentsForParent = action.payload
                state.studentsForParentStatus = "idle"
            })
            .addCase(fetchParentStudents.rejected, (state) => {
                state.studentsForParentStatus = "error"
            })
    }
})

const {actions, reducer} = parentStudentSlice

export default reducer

