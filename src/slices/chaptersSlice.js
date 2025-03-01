import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";

const initialState = {
    chapters: [],
    fetchChaptersStatus : "idle"
}
export const fetchChaptersData = createAsyncThunk(
    'ChaptersSlice/fetchChaptersData',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}chapters_info/${id}`,"GET",null,headers())
    }
)




const ChaptersSlice = createSlice({
    name: "ChaptersSlice",
    initialState,
    reducers: {
        onToggle: (state,action) => {
            state.chapters = state.chapters?.map(item => {

                if (item.id === action.payload.id) {
                    return {
                        ...item,
                        active: !item.active
                    }
                }
                return item
            })
        }

    },
    extraReducers: builder => {
        builder
            .addCase(fetchChaptersData.pending,state => {state.fetchChaptersStatus = 'loading'} )
            .addCase(fetchChaptersData.fulfilled,(state, action) => {
                state.fetchChaptersStatus = 'success';
                state.chapters = action.payload.chapters
                const lastLesson = JSON.parse(localStorage.getItem("lastLesson"))
                if (action.payload.chapters.length > 0 && lastLesson?.chapterId ) {
                    ChaptersSlice.caseReducers.onToggle(state,{...action,payload: {id: +lastLesson?.chapterId}})
                }
            })
            .addCase(fetchChaptersData.rejected,state => {state.fetchChaptersStatus = 'error'})
    }
})

const {actions,reducer} = ChaptersSlice;

export default reducer

export const {onToggle} = actions