

import {MultipleChoiceContent} from "./MultipleChoiceContent"
import {MultipleChoiceSidebar} from "./MultipleChoiceSidebar";
import {getRandomColor} from "helpers/colorRandomizer";




export const MultipleChoiceOptionsSlice = {
    variants: [
        {
            id: 1,
            name: "",
            value: 1,
            correct: false,
            color: getRandomColor()
        }
    ],
    correctAnswer: false,
    multipleOptions: false,
    count: 1,
    // liveResponses: false
}



export const multipleChoiceType = {
    name: "multiple_choice",
    title: "Multiple Choice",
    preview: "",
    icon: null,
    sidebar: MultipleChoiceSidebar,
    content: MultipleChoiceContent
}
