import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {activeTypesSideBar} from "components/presentation/types";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {useNavigate} from "react-router-dom";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const DefaultDesign= {
    fontColor: "#000000",
}


const initialState = {

    currentSlide: {
        id: 12,
        heading: 'Hello',
        subheading: "hello",
        slideType: "heading",
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6urTxCDsHhzRjASB99-MkY6hcvN-Ybc9yWA&s',
        video: "",
        imageType: 'center',
        label: "label",

        activeType: "layout",
        activeSidebar: "",


        design: {
            layout: "default",
            verticalAlign: "center",
            horizontalAlign: "center",
            layoutSize: 2,
            fontSize: 3,
            fontColor: "#000000",
            backgroundColor: "",
            isLayout: false,
            isLayoutSize: false,
            isVerticalAlign: false,
            isHorizontalAlign: true,
        },


        exercise: {},


        extraDesign: {
            layout: "",
            verticalAlign: "center",
            horizontalAlign: "center",
        }
    },

    slides: [
        // {
        //     id: 12,
        //     name: "heading",
        //     heading: 'Title heading',
        // },
        // {
        //     id: 13,
        //     name: "paragraph",
        //     heading: 'Title paragraph',
        // },
        // {
        //     id: 14,
        //     name: "number",
        //     heading: 'Title number',
        // },
        // {
        //     id: 15,
        //     name: "quote",
        //     heading: 'Title quote',
        // },
        // {
        //     id: 16,
        //     name: "image",
        //     heading: 'Title image',
        // },
         ,
    ],
    fetchPresentationStatus:"idle",
    fetchPresentationSlideStatus:"idle",
}



export const fetchPresentationsSlides= createAsyncThunk(
    'PresentationSlice/fetchPresentationsSlides',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}v1/presentation/slide_item/list/?slide_id=${id}`,"GET",null,headers())
    }
)

export const fetchPresentationCurrentSlide = createAsyncThunk(
    'PresentationSlice/fetchPresentation',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}v1/presentation/slide_item/get/${id}/`,"GET",null,headers())
    }
)

export const onAddPresentationSlide = createAsyncThunk(
    'PresentationSlice/onAddPresentation',
    async (data) => {
        const {request} = useHttp();
        return await request(`${BackUrl}v1/presentation/slide_item/create`,"POST",JSON.stringify(data),headers())
    }
)
export const onEditPresentationSlide = createAsyncThunk(
    'PresentationSlice/onAddPresentation',
    async (data) => {
        const {request} = useHttp();
        return await request(`${BackUrl}v1/presentation/slide_item/update/${data.slide_id}/`,"PUT",JSON.stringify(data),headers())
    }
)



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
            const { type, layout,extra } = action.payload;
            if (type === "current") {
                state.currentSlide.design.layout = layout;
                state.currentSlide.extraDesign.layout = "";


                const keys = extra ? Object.keys(extra) : Object.keys(DefaultDesign)
                const value = extra || DefaultDesign
                keys.forEach((key) => {
                    state.currentSlide.design[key] = value[key];
                })

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
        setSlideVideo: (state,action) => {
            if (action.payload) {
                state.currentSlide.video = action.payload || null

            } else {
                state.currentSlide.video = ""

            }
        },

        setSlideImageType: (state,action) => {
            state.currentSlide.imageType = action.payload


            if (action.payload === "full") {
                state.currentSlide.design.layout = "background"
                state.currentSlide.extraDesign.layout = "";
            } else {
                state.currentSlide.design.layout = "default"
                state.currentSlide.extraDesign.layout = "";
            }
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
            state.currentSlide.activeSidebar = "edit"
        },
        toggleSidebar: (state, action) => {
            state.currentSlide.activeSidebar = action.payload
        },


        setSlideType: (state, action) => {
            state.currentSlide.slideType = action.payload
            state.currentSlide.activeSidebar = ""
        },


        setExerciseOptionsSlide: (state, action) => {
            state.currentSlide.exercise = action.payload
        },

        setExerciseOptionSlide: (state, action) => {
            const keys = Object.keys(action.payload)
            for (let i = 0; i < keys.length; i++) {
                state.currentSlide.exercise[keys[i]] = action.payload[keys[i]]
            }
        },
        onAddSlide: (state, action) => {
            state.slides = [...state.slides,{
                id: action.payload.id,
                name: action.payload.slide_type
            }]
        },
        onChangeSlideType: (state, action) => {
            state.currentSlide.slideType = action.payload
        },

        onDeleteSlide: (state, action) => {


            state.slides = state.slides.filter(slide => slide.id !== action.payload)



        },

        // onAddExerciseVariantsSlide: (state, action) => {
        //     state.currentSlide.exercise.variants =
        //
        // },
        //
        //
        // onDeleteExerciseVariantsSlide: (state, action) => {
        //     state.currentSlide.exercise.variants =
        //         [...state.currentSlide.exercise.variants,action.payload]
        // },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchPresentationCurrentSlide.pending,state => {state.fetchPresentationStatus = 'loading'} )
            .addCase(fetchPresentationCurrentSlide.fulfilled,(state, action) => {
                state.fetchPresentationStatus = 'success';
                state.currentSlide = {
                    ...state.currentSlide,
                    id: action.payload.id,
                    slideType: action.payload.slide_type
                }
            })
            .addCase(fetchPresentationCurrentSlide.rejected,state => {state.fetchPresentationStatus = 'error'})

            .addCase(fetchPresentationsSlides.pending,state => {state.fetchPresentationSlideStatus = 'loading'} )
            .addCase(fetchPresentationsSlides.fulfilled,(state, action) => {
                state.fetchPresentationSlideStatus = 'success';
                state.slides = action.payload.map((slide) => {
                    return {
                        id: slide.id,
                        name: slide.slide_type
                    }
                })
            })
            .addCase(fetchPresentationsSlides.rejected,state => {state.fetchPresentationSlideStatus = 'error'})

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
    setActiveType,
    setSlideVideo,
    toggleSidebar,
    setSlideType,
    setExerciseOptionsSlide,
    setExerciseOptionSlide,
    onAddSlide,
    onDeleteSlide,
    onChangeSlideType
} = actions