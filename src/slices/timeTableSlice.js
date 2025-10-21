import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";

export const fetchTimeTableForShow = createAsyncThunk(
    "timeTableSlice/fetchTimeTableForShow",
    async ({branch, teacher, student, group , week}) => {
        console.log(week)
        const {request} = useHttp()
        return await request(`${BackUrl}time_table/timetable-lessons/?teacher=${teacher}${week ? `&which_week=${week}` : ""}`, "GET", null, headers())
    }
)

const initialState = {
    timeTable: [],
    loading: false,
    error: null
} 

const timeTableSlice = createSlice({
    name: "timeTableSlice",
    initialState,
    reducers: {},
    extraReducers: builder => 
        builder
            .addCase(fetchTimeTableForShow.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchTimeTableForShow.fulfilled, (state, action) => {
                state.timeTable = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(fetchTimeTableForShow.rejected, (state) => {
                state.loading = false
                state.error = "error"
            })
})

export default timeTableSlice.reducer

