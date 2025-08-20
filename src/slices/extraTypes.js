import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {BackUrl} from "constants/global";
import {useHttp} from "hooks/http.hook";

const initialState = {
    fetchBooksStatus: "idle"
}




const ExtraTypesSlice = createSlice({
    name: "ExtraTypesSlice",
    initialState,
    reducers: {},
    // extraReducers: builder => {
    //     builder
    //
    //
    // }
})

const {actions, reducer} = ExtraTypesSlice;

export default reducer

export const {} = actions

