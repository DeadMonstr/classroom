import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";

const initialState = {
    systemTypes: [],
    fetchBooksStatus: "idle"
}
export const fetchSystemTypesData = createAsyncThunk(
    'BooksSlice/fetchBooksData',
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
                state.fetchBooksStatus = 'loading'
            })
            .addCase(fetchSystemTypesData.fulfilled, (state, action) => {
                state.systemTypes = action.payload.data
                state.fetchBooksStatus = "success"
            })
            .addCase(fetchSystemTypesData.rejected, state => {
                state.fetchBooksStatus = 'error'
            })


    }
})

const {actions, reducer} = ExtraTypesSlice;

export default reducer

export const {} = actions

