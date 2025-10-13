import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";

const initialState = {
    list: [],

    fetchTeacherEquipmentsDataStatus : "idle"
}


export const fetchTeacherEquipmentsData = createAsyncThunk(
    'teacherEquipmentSlice/fetchTeacherEquipmentsData',
    async ({id, status, system, deleted}) => {
        const {request} = useHttp();
        return await request(`${BackUrl}teacher/requests?deleted=${deleted}&${id}${status !== "all" ? `&status=${status}` : ""}`, "GET", null, headers())
    }
)


const teacherEquipmentSlice = createSlice({
    name: "teacherEquipmentSlice",
    initialState,
    reducers: {
        loadingEquipment: (state) => {
            state.fetchTeacherEquipmentsDataStatus = "loading"
        },
        createEquipment: (state, action) => {
            state.list = [
                ...state.list,
                action.payload
            ]
            state.fetchTeacherEquipmentsDataStatus = "success"
        },
        updateEquipment: (state, action) => {
            console.log(action.payload)
            state.list = state.list.map(item => {
                if (item.id === action.payload?.id) {
                    return action.payload
                } else return item
            })
            state.fetchTeacherEquipmentsDataStatus = "success"
        },
        deleteEquipment: (state, action) => {
            state.list = state.list.filter(item => item.id !== action.payload)
            state.fetchTeacherEquipmentsDataStatus = "success"
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTeacherEquipmentsData.pending, state => {
                state.fetchTeacherEquipmentsDataStatus = 'loading'
            })
            .addCase(fetchTeacherEquipmentsData.fulfilled, (state, action) => {
                console.log(action.payload);
                
                state.list = action.payload
                state.fetchTeacherEquipmentsDataStatus = "success"

            })
            .addCase(fetchTeacherEquipmentsData.rejected, state => {
                state.fetchTeacherEquipmentsDataStatus = 'error'
            })

    }
})

const {actions, reducer} = teacherEquipmentSlice;

export default reducer

export const {
    loadingEquipment, 
    createEquipment,
    updateEquipment,
    deleteEquipment
} = actions
