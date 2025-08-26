import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    presentations: {
        data: [],
        page: 1,
        pageSize: 50,
        totalData: 0
    },
    search: "",
    templates: []
}


export const fetchPresentations = createAsyncThunk(
    'PresentationsSlice/fetchPresentations',
    async (data) => {
        const {request} = useHttp();
        return await request(`${BackUrl}v1/presentation/slide/get/?${new URLSearchParams(data).toString()}`,"GET",null,headers())
    }
)


const PresentationsSlice = createSlice({
    name: "PresentationsSlice",
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload
        },
        setSearch: (state, action) => {
            state.search = action.payload
        },

        onAddPresentation: (state, action) => {
            state.presentations.data = [...state.presentations.data,action.payload]
        },

        onChangePresentation: (state, action) => {
            state.presentations.data = state.presentations.data.map(item => {
                if (item.id === action.payload.id) {
                    return action.payload
                }
                return item
            })
        },
        onDeletePresentation: (state, action) => {
            state.presentations.data = state.presentations.data.filter(item => item.id !== action.payload)
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchPresentations.pending,(state, action) => {})
            .addCase(fetchPresentations.fulfilled,(state, action) => {
                state.presentations.data = action.payload.data
            })
            .addCase(fetchPresentations.rejected,(state, action) => {})

    }
})

const {actions,reducer} = PresentationsSlice;

export default reducer

export const {
    setPage,
    setSearch,
    onChangePresentation,
    onDeletePresentation,
    onAddPresentation
} = actions