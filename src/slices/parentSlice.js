import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "../hooks/http.hook";
import {BackUrl, headers} from "../constants/global";


const initialState = {
    parent: [],
    dates: [],
    groups: [],
    weeklyAttendance: [],
    monthlyAttendance: [],
    balance: [],
    tests: [],
    test_dates: [],
    loading: false,
    error: null,
    loadingAttedance: false
}


export const fetchParentData = createAsyncThunk(
    'ParentSlice/fetchParentData',
    async (id) => {
        const {request} = useHttp()
        return await request(`${BackUrl}parent/crud/${id}`, "GET", null, headers())
    }
)

export const fetchChildrenAttendance = createAsyncThunk(
    'ParentSlice/fetchChildrenAttendance',
    async (username) => {
        const {request} = useHttp()
        return await request(`${BackUrl}parent/student_attendance_dates/${username}`, "GET", null, headers())
    }
)

export const fetchChildrenGroups = createAsyncThunk(
    'ParentSlice/fetchChildrenGroups',
    async ({username,year, month}) => {
        const {request} = useHttp()
        return await request(`${BackUrl}parent/student_group_list/${username}/${year}/${month}`, "GET", null, headers())
    }
)

export const fetchChildrenAttendanceWeekly = createAsyncThunk(
    'ParentSlice/fetchChildrenAttendanceWeekly',
    async (username) => {
        const {request} = useHttp()
        return await request(`${BackUrl}parent/student_attendance/${username}/`, "GET", null, headers())
    }
)
export const fetchChildrenBalance = createAsyncThunk(
    'ParentSlice/fetchChildrenBalance',
    async ({username, status}) => {
        const {request} = useHttp()
        return await request(`${BackUrl}parent/student_payments?id=${username}&payment=${status}`, "GET", null, headers())
    }
)

export const fetchChildrenTestsDate = createAsyncThunk(
    'ParentSlice/fetchChildrenTestsDate',
    async (group_id) => {
        const {request} = useHttp()
        return await request(`${BackUrl}parent/student_tests_data/${group_id}`, "GET", null, headers())
    }
)
export const fetchChildrenAttendanceMonthly = createAsyncThunk(
    'ParentSlice/fetchChildrenAttendanceMonthly',
    async ({username, year, month, groupId} ) => {
        const {request} = useHttp()
        return await request(`${BackUrl}parent/student_attendance/${username}/${groupId ? groupId : "None"}/${year}/${month}`, "GET", null, headers())
    }
)
export const fetchChildrenTests = createAsyncThunk(
    'ParentSlice/fetchChildrenTests',
    async ({ year, month, groupId} ) => {

        const {request} = useHttp()
        return await request(`${BackUrl}parent/student_tests/${groupId}/${month}/${year}`, "GET", null, headers())
    }
)

const ParentSlice = createSlice({
    name: "ParentSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchParentData.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchParentData.fulfilled, (state, action) => {
                state.loading = false
                state.parent = action.payload.children

                state.error = null
            })
            .addCase(fetchParentData.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchChildrenAttendance.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchChildrenAttendance.fulfilled, (state, action) => {
                state.loading = false
                state.dates = action.payload
                state.error = null
            })
            .addCase(fetchChildrenAttendance.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchChildrenGroups.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchChildrenGroups.fulfilled, (state, action) => {
                state.loading = false
                state.groups = action.payload
                state.error = null
            })
            .addCase(fetchChildrenGroups.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchChildrenAttendanceWeekly.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchChildrenAttendanceWeekly.fulfilled, (state, action) => {
                state.loading = false
                state.weeklyAttendance = action.payload
                state.error = null
            })
            .addCase(fetchChildrenAttendanceWeekly.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchChildrenAttendanceMonthly.pending, (state, action) => {
                state.loadingAttedance = true
                state.error = null
            })
            .addCase(fetchChildrenAttendanceMonthly.fulfilled, (state, action) => {
                state.loadingAttedance = false
                state.monthlyAttendance = action.payload.msg
                state.error = null
            })
            .addCase(fetchChildrenAttendanceMonthly.rejected, (state, action) => {
                state.loadingAttedance = false
                state.error = action.payload
            })
            .addCase(fetchChildrenBalance.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchChildrenBalance.fulfilled, (state, action) => {
                state.loading = false
                state.balance = action.payload
                state.error = null
            })
            .addCase(fetchChildrenBalance.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchChildrenTestsDate.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchChildrenTestsDate.fulfilled, (state, action) => {
                state.loading = false
                state.tests_date = action.payload
                state.error = null
            })
            .addCase(fetchChildrenTestsDate.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchChildrenTests.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchChildrenTests.fulfilled, (state, action) => {
                state.loading = false
                state.tests = action.payload.tests
                state.error = null
            })
            .addCase(fetchChildrenTests.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

    }
})

const {actions, reducer} = ParentSlice

export default reducer