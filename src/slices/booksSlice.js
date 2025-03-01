import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {BackUrl, headers, headersOldToken, PlatformUrlApi} from "constants/global";
import {useHttp} from "hooks/http.hook";

const initialState = {
    books: [],
    book: {},
    purchased: [],
    fetchBooksStatus: "idle"
}
export const fetchBooksData = createAsyncThunk(
    'BooksSlice/fetchBooksData',
    async () => {
        const {request} = useHttp();
        return await request(`${PlatformUrlApi}book`, "GET", null)
    }
)


export const fetchBookData = createAsyncThunk(
    'BooksSlice/fetchBookData',
    async (id) => {
        const {request} = useHttp();
        return await request(`${PlatformUrlApi}book_inside/${id}`, "GET", null, headersOldToken())
    }
)


export const fetchPurchasedBooks = createAsyncThunk(
    'BooksSlice/fetchPurchasedBooks',
    async (data) => {
        const {request} = useHttp();
        return await request(`${PlatformUrlApi}teacher_orders/${data}`, "GET", null, headersOldToken())
    }
)


const BooksSlice = createSlice({
    name: "BooksSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchBooksData.pending, state => {
                state.fetchBooksStatus = 'loading'
            })
            .addCase(fetchBooksData.fulfilled, (state, action) => {
                state.books = action.payload.books
                state.fetchBooksStatus = "success"
            })
            .addCase(fetchBooksData.rejected, state => {
                state.fetchBooksStatus = 'error'
            })

            .addCase(fetchBookData.pending, state => {
                state.fetchBooksStatus = 'loading'
            })
            .addCase(fetchBookData.fulfilled, (state, action) => {
                state.book = action.payload.book
                state.fetchBooksStatus = "success"
            })
            .addCase(fetchBookData.rejected, state => {
                state.fetchBooksStatus = 'error'
            })

            .addCase(fetchPurchasedBooks.pending, state => {
                state.fetchBooksStatus = 'loading'
            })
            .addCase(fetchPurchasedBooks.fulfilled, (state, action) => {
                state.purchased = action.payload.new_books
                state.fetchBooksStatus = "success"
            })
            .addCase(fetchPurchasedBooks.rejected, state => {
                state.fetchBooksStatus = 'error'
            })
    }
})

const {actions, reducer} = BooksSlice;

export default reducer

export const {} = actions

