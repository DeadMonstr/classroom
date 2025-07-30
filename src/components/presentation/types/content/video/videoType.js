import {ReactComponent as VideoThumb } from "assets/icons/video.svg"
import {VideoSidebar} from "./VideoSidebar";
import {VideoPreview} from "./VideoPreview";
import {VideoContent} from "./VideoContent";

export const videoType = {
    name: "video",
    title: "Video",
    preview: VideoPreview,
    icon: VideoThumb,
    sidebar: VideoSidebar,
    content: VideoContent
}