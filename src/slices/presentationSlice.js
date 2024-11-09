import {createSlice} from "@reduxjs/toolkit";

const initialState = {

    currentSlide: {
        id: 12,
        heading: '123123',
        subheading: "",
        slideType: "paragraph",
        image: 'https://asset.gecdesigns.com/img/wallpapers/beautiful-fantasy-wallpaper-ultra-hd-wallpaper-4k-sr10012418-1706506236698-cover.webp',
        imageType: 'center',
        label: "",


        design: {

            layout: "default",
            verticalAlign: "center",
            horizontalAlign: "center",
            layoutSize: 2,
            fontSize: 3,
            fontColor: "#000000",
            backgroundColor: "",


            isLayout: true,
            isLayoutSize: false,
            isVerticalAlign: true,
            isHorizontalAlign: true
        },


        extraDesign: {
            layout: "default",
            verticalAlign: "center",
            horizontalAlign: "center",
        }
    },

    slides: [
        {
            id: 12,
            name: "heading",
            heading: 'Title heading',
        },
        {
            id: 13,
            name: "paragraph",
            heading: 'Title paragraph',
        },
        {
            id: 14,
            name: "number",
            heading: 'Title number',
        },
        {
            id: 15,
            name: "quote",
            heading: 'Title quote',
        },
        {
            id: 16,
            name: "image",
            heading: 'Title image',
        },
        {
            id: 17,
            name: "video",
            heading: 'Title video',
        },



    ]
}

const PresentationSlice = createSlice({
    name: "PresentationSlice",
    initialState,
    reducers: {
        setDesignHorizontalAlign: (state, action) => {
            if (action.payload.type === "current") {
                state.currentSlide.design.horizontalAlign = action.payload.align
                state.currentSlide.extraDesign.horizontalAlign = ""
            } else {
                state.currentSlide.extraDesign.horizontalAlign = action.payload.align
            }
        },


        setDesignVerticalAlign: (state, action) => {
            if (action.payload.type === "current") {
                state.currentSlide.design.verticalAlign = action.payload.align
                state.currentSlide.extraDesign.verticalAlign = ""
            } else {
                state.currentSlide.extraDesign.verticalAlign = action.payload.align
            }
        },


        setDesignLayoutOption: (state, action) => {
            if (action.payload.type === "current") {
                state.currentSlide.design.layout = action.payload.layout
                state.currentSlide.extraDesign.layout = ""
            } else {
                state.currentSlide.extraDesign.layout = action.payload.layout
            }
        },


        setDesignLayoutSize: (state,action) => {
            state.currentSlide.design.layoutSize = state.currentSlide.design.layoutSize + action.payload
        },

        setDesignFontSize: (state,action) => {
            state.currentSlide.design.fontSize = state.currentSlide.design.fontSize + action.payload
        },

        setDesignFontColor: (state,action) => {
            state.currentSlide.design.fontColor = action.payload
        },

        setDesignBackgroundColor: (state,action) => {
            state.currentSlide.design.backgroundColor = action.payload
        },



        setSlideImage: (state,action) => {
            state.image = action.payload
        },

        setSlideImageType: (state,action) => {
            state.currentSlide.imageType = action.payload
        },





        setContentHeading: (state,action) => {
            state.currentSlide.heading = action.payload
        },

        setContentSubheading: (state, action) => {
            state.currentSlide.subheading = action.payload
        },

        setContentLabel: (state, action) => {
            state.currentSlide.label = action.payload
        },






        clearExtraOptions: (state, action) => {
            if (action.payload === "horizontal") {
                state.currentSlide.extraDesign.horizontalAlign = ""
            }
            if (action.payload === "vertical") {
                state.currentSlide.extraDesign.verticalAlign = ""
            }
            if (action.payload === "layout") {
                state.currentSlide.extraDesign.layout = ""
            }
        }

    }
})

const {actions,reducer} = PresentationSlice;

export default reducer

export const {
    setDesignHorizontalAlign,
    setDesignVerticalAlign,
    setDesignLayoutOption,
    setDesignLayoutSize,
    setDesignFontSize,
    setDesignFontColor,
    setDesignBackgroundColor,
    clearExtraOptions,
    setContentHeading,
    setContentSubheading,
    setContentLabel,
    setSlideImage,
    setSlideImageType
} = actions