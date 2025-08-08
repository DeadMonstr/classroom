

import {WordCloudContent} from "./WordCloudContent"
import {WordCloudSidebar} from "./WordCloudSidebar";
import {WordCloudPreview} from "./WordCloudPreview";

import {ReactComponent as Icon} from  "assets/icons/word-cloud.svg";


export const WordCloudOptionsSlice = {
    words: [],
    multipleOptions: false,
    count: 1
}



export const wordCloudType = {
    name: "word_cloud",
    title: "Word cloud",
    icon: Icon,
    sidebar: WordCloudSidebar,
    content: WordCloudContent,
    preview: WordCloudPreview
}
