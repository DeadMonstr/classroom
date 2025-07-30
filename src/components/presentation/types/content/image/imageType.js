import {ReactComponent as ImageThumb } from "assets/icons/imageThumb.svg"
import {ImageSidebar} from "./ImageSidebar";
import {ImagePreview} from "./ImagePreview";
import {ImageContent} from "./ImageContent";



export const imageType = {
    name: "image",
    title: "Image",
    preview: ImagePreview,
    icon: ImageThumb ,
    sidebar: ImageSidebar,
    content: ImageContent
}
