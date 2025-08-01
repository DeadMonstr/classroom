import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";

const initialState = {

    selectedLevel: "",
    selectedChapter: "",
    selectedLesson: "",


    data: [],
    typeData: "",

    fetchDataStatus: "idle",
    fetchFiltersDataStatus: "idle"
}



export const fetchDataLessonsDegree = createAsyncThunk(
    'FinishedLessons/fetchDataLessonsDegree',
    async (data) => {
        const {request} = useHttp();
        return await request(`${BackUrl}teacher/group_degree/`,"POST",JSON.stringify(data),headers())
    }
)



const FinishedLessonsSlice = createSlice({
    name: "FinishedLessons",
    initialState,
    reducers: {
        onChangeSelectOption: (state, action) => {

            switch (action.payload.type) {
                case "level":
                    state.selectedLevel = action.payload.id
                    state.selectedChapter = ""
                    state.selectedLesson = ""
                    break
                case "lesson":
                    state.selectedLesson = action.payload.id
                    break
                case "chapter":
                    state.selectedChapter = action.payload.id
                    state.selectedLesson = ""
                    break
            }


        },

        onChangeSelectType: (state, action) => {
            state.typeData = action.payload.type
        }

    },
    extraReducers: builder => {
        builder
            .addCase(fetchDataLessonsDegree.pending,state => {state.fetchFiltersDataStatus = 'loading'} )
            .addCase(fetchDataLessonsDegree.fulfilled,(state, action) => {
                state.fetchFiltersDataStatus = 'success';
                state.data = action.payload.data

            })
            .addCase(fetchDataLessonsDegree.rejected,state => {state.fetchFiltersDataStatus = 'error'})
    }
})

const {actions,reducer} = FinishedLessonsSlice;

export default reducer

export const {onChangeSelectOption,onChangeSelectType} = actions