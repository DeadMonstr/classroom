import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";

const initialState = {
    lesson: null,
    next: null,
    prev: null,
    lastIndex: null,
    studentLessonId: null,
    components: [],
    fetchLessonStatus : "idle"
}
export const fetchLessonData = createAsyncThunk(
    'LessonSlice/fetchLessonData',
    async ({chapterId,lessonOrder}) => {
        const {request} = useHttp();
        return await request(`${BackUrl}info_lesson/${chapterId}/${lessonOrder}`,"GET",null,headers())
    }
)




const LessonSlice = createSlice({
    name: "LessonSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchLessonData.pending,state => {state.fetchLessonStatus = 'loading'} )
            .addCase(fetchLessonData.fulfilled,(state, action) => {
                state.lesson = action.payload.data
                state.next = action.payload.next
                state.prev = action.payload.prev
                state.studentLessonId = action.payload.lesson_id
                state.lesson = action.payload.data
                state.components = action.payload.data.blocks?.map((item,i) => {
                    const index = i + 1
                    const type = item.type
                    const text = item.desc
                    const img = item.img
                    const clone = item.clone
                    const audio = item.audio
                    const video = item.audio
                    const file = item.file
                    const block_id = item.id
                    let editorState = null

                    if (item.type === "exc") {
                        const block = item.exercise_block
                        return {
                            index: index + 1,
                            completed: true,
                            exc: {
                                block
                            },
                            id: item.exercise_id,
                            block_id: item.id,
                            type: "exc"
                        }
                    }

                    if (item.type === "text") {
                        editorState = item.clone
                    }

                    return {
                        ...clone,
                        type,
                        index,
                        img,
                        video,
                        audio,
                        text,
                        file,
                        clone,
                        block_id,
                        editorState,
                        completed: true
                    }
                })
                state.fetchLessonStatus = 'success';

            })
            .addCase(fetchLessonData.rejected,state => {state.fetchLessonStatus = 'error'})
    }
})

const {actions,reducer} = LessonSlice;

export default reducer

export const {} = actions