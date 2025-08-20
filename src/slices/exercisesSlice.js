import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";

const initialState = {
    excs: [],
    types: [],
    subjects: [],
    totalCount:0,

    type: "",
    subject: "",
    level: "",
    search: "",

    fetchExercisesStatus : "idle"
}
export const fetchExercisesData = createAsyncThunk(
    'ExercisesSlice/fetchExercisesData',
    async ({data}) => {
        const {request} = useHttp();
        return await request(`${BackUrl}exercise/crud/?${new URLSearchParams(data).toString()}`,"GET",null,headers())
    }
)

export const fetchExercisesTypeData = createAsyncThunk(
    'ExercisesSlice/fetchExercisesTypeData',
    async () => {
        const {request} = useHttp();
        return await request(`${BackUrl}exercise/type/crud/`,"GET",null,headers())
    }
)


const ExercisesSlice = createSlice({
    name: "SubjectSlice",
    initialState,
    reducers: {
        setTypes: (state,action) => {
            if (action.payload.status === "type") {
                state.type = action.payload.data
            }
            if (action.payload.status === "subject") {
                state.subject = action.payload.data
            }
            if (action.payload.status === "level") {
                state.level = action.payload.data
            }

        },
        setSearch: (state,action) => {
            state.search = action.payload
        },

        onDeleteExc: (state, action) => {
            state.excs = state.excs.filter(item => item.id !== action.payload)
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchExercisesData.pending,state => {state.fetchExercisesStatus = 'loading'} )
            .addCase(fetchExercisesData.fulfilled,(state, action) => {
                state.fetchExercisesStatus = 'success';
                state.excs = action.payload.data
                state.totalCount = action.payload.total

            })
            .addCase(fetchExercisesData.rejected,state => {state.fetchExercisesStatus = 'error'})

            .addCase(fetchExercisesTypeData.pending,state => {state.fetchExercisesStatus = 'loading'} )
            .addCase(fetchExercisesTypeData.fulfilled,(state, action) => {
                state.fetchExercisesStatus = 'success';
                state.types = action.payload.data
            })
            .addCase(fetchExercisesTypeData.rejected,state => {state.fetchExercisesStatus = 'error'})
    }
})

const {actions,reducer} = ExercisesSlice;

export default reducer

export const {setTypes,setSearch,onDeleteExc} = actions