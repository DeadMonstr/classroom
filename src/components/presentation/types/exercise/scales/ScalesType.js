

import {ScalesContent} from "./ScalesContent"
import {ScalesSidebar} from "./ScalesSidebar";
import {ScalesPreview} from "./ScalesPreview";

import {ReactComponent as Icon} from  "assets/icons/scales.svg";


export const ScalesTypeTOptionsSlice = {
    count: 1,
    variants: [],
    dimensions: {
        left: {
            name: null,
            value: 0
        },
        right: {
            name: null,
            value: 5
        }
    }
}



export const scalesType = {
    name: "scales",
    title: "Scales",
    icon: Icon,
    sidebar: ScalesSidebar,
    content: ScalesContent,
    preview: ScalesPreview
}
