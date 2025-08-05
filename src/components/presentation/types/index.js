import {
    contentTypes as types,
} from "./content"


import {
    execTypes as exc,
} from "./exercise"




export const contentTypes = [
    ...types,
    ...exc
]









export const activeTypesSideBar = {
    layout: "layout",
    heading: "heading",
    paragraph: "paragraph",
    number: "number",
    image: "image",
    quote: "quote",
    video: "video",
    multipleChoice: "multiple_choice"
}
