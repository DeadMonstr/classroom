import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";

const initialState = {
    data: [],

    fetchTeacherEquipmentsDataStatus : "idle"
}


export const fetchTeacherEquipmentsData = createAsyncThunk(
    'TeacherEquipmentSlice/fetchTeacherEquipmentsData',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}`, "GET", null, headers())
    }
)


const TeacherEquipmentSlice = createSlice({
    name: "TeacherEquipmentSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchTeacherEquipmentsData.pending, state => {
                state.fetchSubjectDataStatus = 'loading'
            })
            .addCase(fetchTeacherEquipmentsData.fulfilled, (state, action) => {


            })
            .addCase(fetchTeacherEquipmentsData.rejected, state => {
                state.fetchSubjectDataStatus = 'error'
            })

    }
})

const {actions, reducer} = TeacherEquipmentSlice;

export default reducer

export const {} = actions