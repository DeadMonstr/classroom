import React from 'react';
import ActiveBox from "components/presentation/ui/activeBox/activeBox";


import cls from "./videoType.module.sass"
import TextSlide from "components/presentation/ui/text/TextSlide";
import ReactPlayer from "react-player";
import {activeTypesSideBar} from "components/presentation/types/index";
import {useSelector} from "react-redux";


import {ReactComponent as VideoThumbnail} from "assets/icons/videoContent.svg";

export const VideoPreview = () => {


    const {currentSlide: {video,label,heading}} = useSelector(state => state.presentation)
    return (
        <ActiveBox type={activeTypesSideBar.video}>
            <div className={cls.video}>


                <div className={cls.video__content}>
                    <VideoThumbnail className={cls.svg}/>
                </div>


                <div className={cls.video__text}>

                    <TextSlide type={"smaller"}>
                        Label
                    </TextSlide>

                    <TextSlide type={"normal"}>
                        Video Title
                    </TextSlide>
                </div>


            </div>
        </ActiveBox>

    );
};

