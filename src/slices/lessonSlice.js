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
    archiveId: null,
    isChangedComponents: false,
    fetchLessonStatus : "idle"
}
export const fetchLessonData = createAsyncThunk(
    'LessonSlice/fetchLessonData',
    async ({chapterId,lessonOrder,token}) => {
        const {request} = useHttp();
        if (token) {
            const header =  {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Authorization" : "Bearer " + token
            }
            return await request(`${BackUrl}lesson/profile/${chapterId}/${lessonOrder}/`,"GET",null,header)
        }
        return await request(`${BackUrl}lesson/profile/${chapterId}/${lessonOrder}/`,"GET",null,headers())
    }
)




const LessonSlice = createSlice({
    name: "LessonSlice",
    initialState,
    reducers: {
        setArchiveId: (state, action) => {
            state.archiveId = action.payload.id
        },
        setLessonData: (state, action) => {
            state.lesson = action.payload.data
            state.isChangedComponents = true
            state.archiveId = null
            state.components = action.payload.data.lesson_blocks?.map((item, i) => {
                const index = i + 1
                const type = item.type_block
                const text = item.desc
                const img = item.file
                const clone = item.clone
                const audio = item.file
                const video = item.video_url
                const file = {
                    name: item.original_name,
                    url: item.file
                }
                const id = item.id
                const innerType = item.inner_type
                let editorState = null


                if (item.type_block === "exc") {
                    const block = item.exercise
                    return {
                        completed: true,
                        exc: {
                            ...block
                        },
                        exercise_id: item.exercise_id,
                        id: item.id,
                        type: "exc",
                        index: index,

                    }
                }

                if (item.type === "text") {
                    if (item.clone.editorState) editorState = item.clone.editorState
                    else editorState = item.clone
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
                    id,
                    editorState,
                    innerType,
                    completed: true
                }
            })
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchLessonData.pending,state => {state.fetchLessonStatus = 'loading'} )
            .addCase(fetchLessonData.fulfilled,(state, action) => {
                state.lesson = action.payload.data
                state.next = action.payload.next
                state.prev = action.payload.prev
                state.archiveId = action.payload.archive_id
                state.studentLessonId = action.payload.lesson_id
                state.lesson = action.payload.data
                state.components = action.payload.data.lesson_blocks?.map((item, i) => {
                    const index = i + 1
                    const type = item.type_block
                    const text = item.desc
                    const img = item.file
                    const clone = item.clone
                    const audio = item.file
                    const video = item.video_url
                    const file = {
                        name: item.original_name,
                        url: item.file
                    }
                    const id = item.id
                    const innerType = item.inner_type
                    let editorState = null


                    if (item.type_block === "exc") {
                        const block = item.exercise
                        return {
                            completed: true,
                            exc: {
                                ...block
                            },
                            exercise_id: item.exercise_id,
                            id: item.id,
                            type: "exc",
                            index: index,

                        }
                    }

                    if (item.type === "text") {
                        if (item.clone.editorState) editorState = item.clone.editorState
                        else editorState = item.clone
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
                        id,
                        editorState,
                        innerType,
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

export const {setArchiveId,setLessonData} = actions