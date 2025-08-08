

import {OpenEndedContent} from "./OpenEndedContent"
import {OpenEndedSidebar} from "./OpenEndedSidebar";
import {OpenEndedPreview} from "./OpenEndedPreview";

import {ReactComponent as Icon} from  "assets/icons/open-ended.svg";


export const OpenEndedTOptionsSlice = {
    count: 1
}



export const openEndedType = {
    name: "open_ended",
    title: "Open ended",
    icon: Icon,
    sidebar: OpenEndedSidebar,
    content: OpenEndedContent,
    preview: OpenEndedPreview
}
