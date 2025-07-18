import {createSlice} from "@reduxjs/toolkit";
import {activeTypesSideBar} from "components/presentation/types";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);


const initialState = {

    currentSlide: {
        id: 12,
        heading: '123123',
        subheading: "",
        slideType: "paragraph",
        image: 'https://asset.gecdesigns.com/img/wallpapers/beautiful-fantasy-wallpaper-ultra-hd-wallpaper-4k-sr10012418-1706506236698-cover.webp',
        imageType: 'center',
        label: "",
        activeType: "",

        design: {

            layout: "default",
            verticalAlign: "center",
            horizontalAlign: "center",
            layoutSize: 2,
            fontSize: 3,
            fontColor: "#000000",
            backgroundColor: "",
            isLayout: true,
            isLayoutSize: true,
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
            const { type, align } = action.payload;
            if (type === "current") {
                state.currentSlide.design.horizontalAlign = align;
                state.currentSlide.extraDesign.horizontalAlign = "";
            } else {
                state.currentSlide.extraDesign.horizontalAlign = align;
            }
        },


        setDesignVerticalAlign: (state, action) => {
            const { type, align } = action.payload;
            if (type === "current") {
                state.currentSlide.design.verticalAlign = align;
                state.currentSlide.extraDesign.verticalAlign = "";
            } else {
                state.currentSlide.extraDesign.verticalAlign = align;
            }
        },


        setDesignLayoutOption: (state, action) => {
            const { type, layout } = action.payload;
            if (type === "current") {
                state.currentSlide.design.layout = layout;
                state.currentSlide.extraDesign.layout = "";
            } else {
                state.currentSlide.extraDesign.layout = layout;
            }
        },


        setDesignLayoutSize: (state, action) => {
            state.currentSlide.design.layoutSize = clamp(
                state.currentSlide.design.layoutSize + action.payload,
                0,
                4
            );
        },
        setDesignFontSize: (state, action) => {
            state.currentSlide.design.fontSize = clamp(
                state.currentSlide.design.fontSize + action.payload,
                0,
                4
            );
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
            const key = action.payload === "layout"
                ? "layout"
                : `${action.payload}Align`;
            if (state.currentSlide.extraDesign.hasOwnProperty(key)) {
                state.currentSlide.extraDesign[key] = "";
            }
        },
        setDesignValue: (state, action) => {
            const { key, value } = action.payload;
            state.currentSlide.design[key] = value;
        },
        setActiveType: (state, action) => {
            state.currentSlide.activeType = action.payload
        },

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
    setSlideImageType,
    setActiveType
} = actions