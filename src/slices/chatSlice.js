import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    contacts: [],
    fetchContactsStatus: "idle",
    messages: [],
    fetchMessagesStatus: "idle",
    sendMessage: {},
    fetchSendMessageStatus: "idle"
}

export const fetchContactsData = createAsyncThunk(
    "ChatSlice/fetchContactsData",
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}get_info/${id}`, "GET", null, headers())
    }
)

export const fetchMessagesData = createAsyncThunk(
    "ChatSlice/fetchMessagesData",
    async (value) => {
        const {request} = useHttp();
        return await request(`${BackUrl}get_info/${value.userId}`, "POST",
            JSON.stringify({type: "chat", chat_id: value.chatId})
            , headers())
    }
)

const ChatSlice = createSlice({
    name: "ChatSlice",
    initialState,
    reducers: {
        sendingMessage: (state) => {
            state.fetchSendMessageStatus = "loading"
        },
        gotSendMessage: (state, action) => {
            state.messages = [...state.messages, action.payload.prevMessage]
            state.sendMessage = action.payload.message
            state.fetchSendMessageStatus = "success"
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchContactsData.pending, state => {
                state.fetchContactsStatus = "loading"
            })
            .addCase(fetchContactsData.fulfilled, (state, action) => {
                console.log(action.payload, "slice")
                state.contacts = action.payload.chats
                state.fetchContactsStatus = "success"
            })
            .addCase(fetchContactsData.rejected, state => {
                state.fetchContactsStatus = "error"
            })
            .addCase(fetchMessagesData.pending, state => {
                state.fetchMessagesStatus = "loading"
            })
            .addCase(fetchMessagesData.fulfilled, (state, action) => {
                state.messages = action.payload.filtered_list
                state.fetchMessagesStatus = "success"
            })
            .addCase(fetchMessagesData.rejected, state => {
                state.fetchMessagesStatus = "error"
            })
    }
})

const {actions, reducer} = ChatSlice

export default reducer

export const {
    sendingMessage,
    gotSendMessage
} = actions