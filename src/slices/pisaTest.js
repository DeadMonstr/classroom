import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    data: [],
    fetchPisaTestStatus: "idle",
    error: "",
}


export const fetchPisaTestData = createAsyncThunk(
    'PisaTestSlice/fetchPisaTestData',
    async (isDeleted) => {
        const {request} = useHttp();
        return await request(`${BackUrl}pisa/list/${isDeleted}`,"GET",null,headers())
    }
)


const PisaTestSlice = createSlice({
    name: "PisaTestSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchPisaTestData.pending,state => {state.fetchPisaTestStatus = 'loading'} )
            .addCase(fetchPisaTestData.fulfilled,(state, action) => {
                state.data = action.payload
                state.fetchPisaTestStatus = 'success'
            })
            .addCase(fetchPisaTestData.rejected,state => {state.fetchPisaTestStatus = 'error'})
    }
})

const {actions,reducer} = PisaTestSlice;
export default reducer

export const {} = actions