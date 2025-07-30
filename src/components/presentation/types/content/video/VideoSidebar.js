import React, {useContext, useState} from 'react';

import cls from "../../typesSidebar.module.sass"
import Button from "components/ui/button";
import Input from "components/ui/form/input";
import Textarea from "components/ui/form/textarea";
import {Switch} from "components/ui/switch/switch";
import ImageModal from "components/presentation/ui/imageModal/ImageModal";
import {PresentationSidebarContext} from "helpers/contexts";


import UpdaterFile from "components/presentation/ui/updaterFile/UpdaterFile";
import {videoType} from "./videoType";
import {makeIconComponent} from "helpers/makeIconComponent";
import {useDispatch, useSelector} from "react-redux";
import {setContentHeading, setSlideVideo} from "slices/presentationSlice";
import {getYouTubeThumbnail} from "helpers/getYoutubeThumbnail";
import Label from "components/presentation/ui/label/Label";

export const VideoSidebar = () => {

    const {currentSlide: {video,heading}} = useSelector(state => state.presentation)

    const {setActiveModal} = useContext(PresentationSidebarContext)

    const [videoLink, setVideoLink] = useState(video )
    const [update,setUpdate] = useState(!video)

    const dispatch = useDispatch()

    const onChangeCaption = (e) => {
        dispatch(setContentHeading(e))
        setUpdate(false)
    }

    const onChange = () => {
        dispatch(setSlideVideo(videoLink))
        setUpdate(false)
    }

    const onChangeUpdate = () => {
        setUpdate(true)
    }

    const onDelete = () => {
        dispatch(setSlideVideo(null))
        setUpdate(true)
        setVideoLink(null)
    }

    const thumbnail = videoLink && getYouTubeThumbnail(videoLink)

    return (
        <div className={cls.sidebar}>

            <div className={cls.type}>

                <h2>Slide type</h2>

                <Button
                    onClick={() => setActiveModal(true)}
                    type={"present"}
                    extraClass={cls.type__btn}
                >
                    {makeIconComponent(videoType.icon)}
                    Video
                </Button>
            </div>


            <div className={cls.separator}/>

            <Input value={heading} onChange={onChangeCaption} extraClassNameLabel={cls.heading} title={"Video caption"}/>

            <div className={cls.videoUrl}>
                {
                    update ?
                        <>
                            <Input onChange={setVideoLink} value={videoLink} title={"URL"}/>

                            <Button type={"submit"} onClick={onChange}>Add</Button>
                        </>
                    :  <UpdaterFile onDelete={onDelete} img={thumbnail} onChange={onChangeUpdate} isVideo />
                }
            </div>

            <Label />
            <div className={cls.separator} />

            <ImageModal/>

        </div>
    );
};



