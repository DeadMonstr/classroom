import {centerCrop, convertToPixelCrop, makeAspectCrop, ReactCrop} from "react-image-crop";
import React, {useEffect, useRef, useState} from "react";
import classNames from "classnames";
import Button from "components/ui/button";

import 'react-image-crop/dist/ReactCrop.css'
import cls from "components/presentation/ui/imageModal/cropImage/cropImage.module.sass";

function centerAspectCrop(
    mediaWidth,
    mediaHeight,
    aspect,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}


const CropImage = ({image,setType}) => {

    const [imgSrc, setImgSrc] = useState('')

    const imgRef = useRef(null)
    const previewCanvasRef = useRef()


    const [crop, setCrop] = useState()
    const [completedCrop, setCompletedCrop] = useState()
    const [aspect, setAspect] = useState(16 / 9)
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)



    useEffect(() => {

        setCrop(undefined) // Makes cropImage preview update between images.

        const reader = new FileReader()
        reader.addEventListener('load', () =>
            setImgSrc(reader.result?.toString() || ''),
        )
        reader.readAsDataURL(image)
    }, [image])


    function onImageLoad(e) {
        if (aspect) {
            const {width, height} = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }


    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop,
                    scale,
                    rotate,
                )
            }
        },
        100,
        [completedCrop, scale, rotate],
    )

    function handleToggleAspectClick() {

        if (aspect) {
            setAspect(undefined)
        } else {
            setAspect(16 / 9)

            if (imgRef.current) {
                const { width, height } = imgRef.current
                const newCrop = centerAspectCrop(width, height, 16 / 9)
                setCrop(newCrop)
                // Updates the preview
                setCompletedCrop(convertToPixelCrop(newCrop, width, height))
            }
        }
    }

    async function onDownloadCropClick() {
        const image = imgRef.current
        const previewCanvas = previewCanvasRef.current
        if (!image || !previewCanvas || !completedCrop) {
            throw new Error('Crop canvas does not exist')
        }

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        const offscreen = new OffscreenCanvas(
            completedCrop?.width * scaleX,
            completedCrop?.height * scaleY,
        )
        const ctx = offscreen.getContext('2d')
        if (!ctx) {
            throw new Error('No 2d context')
        }

        ctx.drawImage(
            previewCanvas,
            0,
            0,
            previewCanvas.width,
            previewCanvas.height,
            0,
            0,
            offscreen.width,
            offscreen.height,
        )

        const blob = await offscreen.convertToBlob({
            type: 'image/png',
        })

        const res = new File([blob], "userImg")


        console.log(crop)
        console.log(aspect)
        // setImgSrc(URL.createObjectURL(res))
        // setNewImage(URL.createObjectURL(res))
    }



    return (
        <div className={cls.crop}>
            <h1>Crop Image</h1>

            <div className={cls.crop__wrapper}>

                <div className={cls.image}>
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                        // minWidth={400}
                        minHeight={100}
                        ruleOfThirds={true}
                        keepSelection={true}


                        // circularCrop
                    >
                        <img
                            ref={imgRef}
                            alt="Crop me"
                            src={imgSrc}
                            style={{transform: `scale(${scale}) rotate(${rotate}deg)`}}
                            onLoad={onImageLoad}
                        />
                    </ReactCrop>

                    <canvas
                        ref={previewCanvasRef}
                        style={{
                            display: "none",
                            border: 'solid black',
                            objectFit: 'contain',
                            width: completedCrop?.width,
                            height: completedCrop?.height,
                        }}
                    />
                </div>

                <div className={cls.types}>

                    <div
                        className={classNames(cls.types__item, {
                            [cls.active] : !aspect
                        })}
                        onClick={handleToggleAspectClick}
                    >
                        Free form
                    </div>
                </div>
            </div>

            <div className={cls.subheader}>

                <Button onClick={() => setType('img')} type={"simple"}>
                    Back to upload
                </Button>

                <Button onClick={onDownloadCropClick} type={"submit"}>
                    Save
                </Button>
            </div>

        </div>
    )
}

function useDebounceEffect(
    fn,
    waitTime,
    deps,
) {
    useEffect(() => {
        const t = setTimeout(() => {
            fn.apply(undefined, deps)
        }, waitTime)

        return () => {
            clearTimeout(t)
        }
    }, deps)
}



const TO_RADIANS = Math.PI / 180

export async function canvasPreview(
    image,
    canvas,
    crop,
    scale = 1,
    rotate = 0,
) {
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('No 2d context')
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    // devicePixelRatio slightly increases sharpness on retina devices
    // at the expense of slightly slower render times and needing to
    // size the dropImage back down if you want to download/upload and be
    // true to the images natural size.
    const pixelRatio = window.devicePixelRatio
    // const pixelRatio = 1

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'

    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY

    const rotateRads = rotate * TO_RADIANS
    const centerX = image.naturalWidth / 2
    const centerY = image.naturalHeight / 2

    ctx.save()

    // 5) Move the cropImage origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY)
    // 4) Move the origin to the center of the original position
    ctx.translate(centerX, centerY)
    // 3) Rotate around the origin
    ctx.rotate(rotateRads)
    // 2) Scale the dropImage
    ctx.scale(scale, scale)
    // 1) Move the center of the dropImage to the origin (0,0)
    ctx.translate(-centerX, -centerY)
    ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
    )

    ctx.restore()
}


export default CropImage