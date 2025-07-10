import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    data: [],
    fetchStatus: "idle",
    error: "",
}


export const fetchPisaTestResultsData = createAsyncThunk(
    'PisaTestResultsSlice/fetchPisaTestResultsData',
    async ({location_id, pisa_test_id}) => {
        const {request} = useHttp();
        return await request(
            `${BackUrl}pisa/student/show/results?${location_id !== "all" ? `location_id=${location_id}&` : ""}${pisa_test_id !== "all" ? `pisa_test_id=${pisa_test_id}` : ""}`,
            "GET", null, headers()
        )
    }
)


const PisaTestResultsSlice = createSlice({
    name: "PisaTestResultsSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchPisaTestResultsData.pending, state => {
                state.fetchStatus = 'loading'
            })
            .addCase(fetchPisaTestResultsData.fulfilled, (state, action) => {
                state.data = action.payload.results
                state.fetchStatus = 'success'
            })
            .addCase(fetchPisaTestResultsData.rejected, state => {
                    state.fetchStatus = 'error'
                }
            )
    }
})

const {actions, reducer} = PisaTestResultsSlice;
export default reducer

export const {} = actions