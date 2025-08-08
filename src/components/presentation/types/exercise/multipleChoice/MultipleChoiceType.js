

import {MultipleChoiceContent} from "./MultipleChoiceContent"
import {MultipleChoiceSidebar} from "./MultipleChoiceSidebar";
import {MultipleChoicePreview} from "./MultipleChoicePreview";

import {getRandomColor} from "helpers/colorRandomizer";
import {ReactComponent as Icon} from  "assets/icons/multiple choice.svg";


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

    icon: Icon,
    sidebar: MultipleChoiceSidebar,
    content: MultipleChoiceContent,
    preview: MultipleChoicePreview
}
