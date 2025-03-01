import {createSlice} from "@reduxjs/toolkit";

const initialState = {
	activeMenu: false,
	title: "",
	// routes: routes,
	options: [],
	alert: []

}

const LayoutSlice = createSlice({
	name: "LayoutSlice",
	initialState,
	reducers: {
		setActiveMenu: (state) => {
			state.activeMenu = (!state.activeMenu)
		},
		setOptions: (state,action) => {
			state.options = action.payload.options
			state.title = action.payload.title
			state.footerOptions = action.payload.footerOptions
		},
		setOptionsByHref: (state,action) => {
			state.options = state.options.map(item => {
				if (item.href === action.payload.href) {
					return {...item,...action.payload.changedLinks}
				}
				return item
			})
		},
		setAlertOptions: (state,action) => {
			state.alert = [action.payload.alert]
		},
		setMultipleAlertOptions: (state,action) => {
			state.alert = action.payload.alerts
		},
		disableAlertActive: (state,action) => {
			state.alert = state.alert.filter((item,index) => index !== action.payload.index)
		}
	}
})

const {actions,reducer} = LayoutSlice;

export default reducer

export const {setActiveMenu,setOptions,setAlertOptions,disableAlertActive,setOptionsByHref,setMultipleAlertOptions} = actions