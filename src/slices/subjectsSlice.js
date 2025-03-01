import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";

const initialState = {
    subjects: [],
    fetchSubjectsDataStatus : "idle"
}
export const fetchSubjectsData = createAsyncThunk(
    'SubjectsSlice/fetchSubjectsData',
    async () => {
        const {request} = useHttp();
        return await request(`${BackUrl}info/subjects`,"GET",null,headers())
    }
)


const SubjectsSlice = createSlice({
    name: "SubjectsSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchSubjectsData.pending,state => {state.fetchSubjectsDataStatus = 'loading'} )
            .addCase(fetchSubjectsData.fulfilled,(state, action) => {
                state.fetchSubjectsDataStatus = 'success';
                state.subjects = action.payload.subjects
            })
            .addCase(fetchSubjectsData.rejected,state => {state.fetchSubjectsDataStatus = 'error'})


    }
})

const {actions,reducer} = SubjectsSlice;

export default reducer

export const {setDataSubject,setLevel,changeLevel} = actions