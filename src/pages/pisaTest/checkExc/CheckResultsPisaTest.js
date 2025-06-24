import React, {useCallback, useEffect, useMemo, useState} from 'react';


import cls from "./checkResultsPisaTest.module.sass"
import Button from "components/ui/button";
import classNames from "classnames";
import {useNavigate, useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {BackUrl, headers} from "constants/global";
import {unstable_batchedUpdates} from "react-dom";
import {PisaExcContext} from "helpers/contexts";

import {useHttp} from "hooks/http.hook";
import {setAlertOptions} from "slices/layoutSlice";
import {closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import Loader from "components/ui/loader/Loader";
import Input from "components/ui/form/input";
import {CSS} from "@dnd-kit/utilities";


import Question from "components/pisa/question";
import ExcText from "components/pisa/text";
import Video from "components/pisa/video";
import Img from "components/pisa/img";
import File from "components/pisa/file/File";
import Snippet from "components/pisa/snippet";
import TextEditorExc from "components/pisa/textEditor/TextEditor";

import useDebounce from "hooks/useDebounce";
import Checkbox from "components/ui/form/checkbox";

const CheckResultsPisaTest = () => {

    const {id} = useParams()


    const [type, setType] = useState("left")

    const [leftExc, setLeftExc] = useState([])
    const [rightExc, setRightExc] = useState([])
    const [name, setName] = useState()
    const [status, setStatus] = useState(false)
    const [isChanging, setIsChanging] = useState(false)

    const [leftDisabled,setLeftDisabled] = useState(true)
    const [rightDisabled,setRightDisabled] = useState(true)



    useEffect(() => {
        if (id) {
            request(`${BackUrl}pisa/student/get/test/${id}`, "GET", null, headers())
                .then(res => {
                    setIsChanging(true)
                    setName(res.name)
                    setStatus(res.status)

                    const left = translateToComponents(res.pisa_blocks_left)
                    const right = translateToComponents(res.pisa_blocks_right)

                    // console.log(left)

                    setLeftExc(left)
                    setRightExc(right)
                })
        }
    }, [id])


    const translateToComponents = (data) => {

        let components = []

        for (let item of data) {


            if (item.type === "question") {


                components.push({
                    completed: true,
                    id: item.id,
                    index: item.index,
                    type: "question",
                    image: item.image_url,
                    text: item.text,
                    innerType: item.innerType,
                    variants: {
                        ...item.variants,
                        options: item.options.map(item => {
                            return {
                                ...item,
                                img: item.image_url
                            }
                        }),
                        type: item.type_question,
                        typeVariants: item.typeVariants
                    }
                })

            } else if (item.type === "text" || item.type === "words") {
                components.push({
                    completed: true,
                    id: item.id,
                    index: item.index,
                    type: item.type,
                    text: item.text,
                    textEditor: item.textEditor,
                    words: item.answers
                })
            } else if (item.type === "video") {
                components.push({
                    completed: true,
                    id: item.id,
                    index: item.index,
                    type: item.type,
                    text: item.text,
                    videoLink: item.video_url

                })
            } else if (item.type === "img") {
                components.push({
                    completed: true,
                    id: item.id,
                    index: item.index,
                    type: item.type,
                    text: item.text,
                    img: item.image_url

                })
            } else if (item.type === "file") {
                components.push({
                    completed: true,
                    id: item.id,
                    index: item.index,
                    type: item.type,
                    text: item.text,
                    file: item.file_url

                })
            }
        }
        return components

    }

    const onChangeExc = (type, exc) => {
        if (type === "left") {
            setLeftExc(exc)
        } else {
            setRightExc(exc)
        }
    }


    const {request} = useHttp()
    const dispatch = useDispatch()



    const navigate = useNavigate()







    return (
        <div className={cls.createPisaTest}>
            <div className={cls.header}>
                <div>
                    <h1>{name}</h1>
                </div>
                <div>
                    <Button onClick={() => setType("left")}>Left</Button>
                    <Button onClick={() => setType("center")}>Center</Button>
                    <Button onClick={() => setType("right")}>Right</Button>
                </div>

                <div></div>


            </div>

            <div className={cls.container}>
                <div className={classNames(cls.left, {
                    [cls.active]: type === "left",
                    [cls.center]: type === "center"
                })}>
                    <div className={cls.wrapper}>
                        <CreateExcPisa
                            setDisabled={setLeftDisabled}
                            oldExc={leftExc}
                            pisaId={id}
                            typeSide={"left"}
                            onChangeExc={onChangeExc}
                        />
                    </div>
                </div>
                <div className={classNames(cls.right, {
                    [cls.active]: type === "right",
                    [cls.center]: type === "center"
                })}>
                    <div className={cls.wrapper}>
                        <CreateExcPisa
                            setDisabled={setRightDisabled}
                            oldExc={rightExc}
                            pisaId={id}
                            typeSide={"right"}
                            onChangeExc={onChangeExc}
                        />
                    </div>
                </div>
            </div>






        </div>
    );
};


const CreateExcPisa = ({typeSide, onChangeExc, pisaId, oldExc = [], setDisabled}) => {

    const [activeTools, setActiveTools] = useState(false)

    const [selectedChapter, setSelectedChapter] = useState("")
    const [isGetted, setIsGetted] = useState(false)

    const [components, setComponents] = useState([])
    const [answers, setAnswers] = useState([])
    const [changeLessonsSort, setChangeLessonsSort] = useState(false)

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (oldExc.length > 0 && !isGetted) {
            setIsGetted(true)
            setComponents(oldExc)
        }
    }, [oldExc, isGetted])


    const tools = [
        {
            value: "text",
            title: "Matn"
        },

        {
            value: "video",
            title: "Video"
        },
        {
            value: "img",
            title: "Rasm"
        },
        {
            value: "file",
            title: "Fayl"
        },
        {
            value: "question",
            title: "Savol"
        },
        {
            value: "words",
            title: "So'zlar"
        }
    ]


    const {request} = useHttp()

    const addComponent = (type) => {


        if (type === "text") {
            unstable_batchedUpdates(() => {
                setComponents(components => [...components, {
                    type: type,
                    text: "",
                    words: [],
                    completed: false,
                    index: components.length + 1
                }]);
            })
        } else {
            setComponents(components => [...components, {
                type: type,
                completed: false,
                index: components.length + 1
            }])
        }

    }

    useEffect(() => {
        if (components.length > 0) {
            onChangeExc(typeSide, components)
        }
    }, [components])

    const onSetAnswers = (index, changedAnswer) => {
        const isInAnswers = answers.some(item => item.index === index)

        if (isInAnswers) {
            setAnswers(answers => answers.map((item) => {
                if (item.index === index) {
                    return changedAnswer
                }
                return item
            }))
        } else {
            setAnswers(answers => [...answers, changedAnswer])
        }

    }


    const renderComponents = useCallback(() => {
        return components?.map((item) => {
            if (item.type === "text") {
                return (
                    <TextEditorExc
                        component={item}
                        extra={{pisaId: pisaId, side: typeSide}}
                    />
                )
            }
            if (item.type === "video") {
                return (
                    <Video
                        type={"view"}
                        component={item}
                        extra={{pisaId: pisaId, side: typeSide}}
                    />
                )
            }
            if (item.type === "img") {
                return (
                    <Img
                        component={item}
                        type={"view"}
                        extra={{pisaId: pisaId, side: typeSide}}
                    />
                )
            }
            if (item.type === "file") {
                return (
                    <File
                        component={item}
                        type={"view"}
                        extra={{pisaId: pisaId, side: typeSide}}

                    />
                )
            }
            if (item.type === "question") {
                return (
                    <Question
                        type={"view"}
                        component={item}
                        extra={{pisaId: pisaId, side: typeSide}}
                        setAnswers={onSetAnswers}
                    />
                )
            }
            if (item.type === "words") {
                return (
                    <ExcText
                        type={"view"}
                        component={item}
                        setAnswers={onSetAnswers}
                        extra={{pisaId: pisaId, side: typeSide}}
                    />
                )
            }
        })
    }, [components, changeLessonsSort, pisaId,onSetAnswers])

    const dispatch = useDispatch()
    const navigate = useNavigate()


    useEffect(() => {
        if (answers.length > 0) {
            console.log(!answers.every(item => item.everyFilled), "sadsda")
            setDisabled(!answers.every(item => item.everyFilled))
        }
    }, [answers])


    console.log(answers)
    const onSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData()


        const componentImg = components.filter(item => item.type === "img")
        const componentAudio = components.filter(item => item.type === "audio")
        const componentFile = components.filter(item => item.type === "file")


        if (componentImg.length > 0) {
            for (let item of componentImg) {
                formData.append(
                    `component-${item.index}-img`,
                    item.img
                )
            }
        }

        if (componentAudio.length > 0) {
            for (let item of componentAudio) {
                formData.append(
                    `component-${item.index}-audio`,
                    item.audio
                )
            }
        }


        if (componentFile.length > 0) {
            for (let item of componentFile) {
                formData.append(
                    `component-${item.index}-file`,
                    item.file
                )
            }
        }

        const newData = {
            components,
            chapter: selectedChapter,
        }


        formData.append("info", JSON.stringify(newData))


        const token = sessionStorage.getItem("token")


        setLoading(true)
        request(`${BackUrl}lessons/`, "POST", formData, {
            "Authorization": "Bearer " + token,
        })
            .then(res => {
                setLoading(false)
                const alert = {
                    active: true,
                    message: res.msg,
                    type: res.status
                }
                dispatch(setAlertOptions({alert}))
            })
            .then(() => {
                navigate(-1)
            })
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );


    function handleDragEnd(event) {
        const {active, over} = event;

        if (active.id !== over.id) {
            setComponents((items) => {
                const oldIndex = items.findIndex(item => item.index === active.id);
                const newIndex = items.findIndex(item => item.index === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }


    const itemsIndex = useMemo(() => {
        return components.map(item => item.index)
    }, [components])


    const renderedComponents = renderComponents()


    if (loading) return <Loader/>




    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className={cls.createLesson}>


                <SortableContext
                    items={itemsIndex}
                    strategy={verticalListSortingStrategy}
                >
                    <div className={cls.createLesson__container}>
                        <PisaExcContext.Provider value={{disabledExc:true, isView: true}}>

                            {renderedComponents}

                        </PisaExcContext.Provider>
                    </div>
                </SortableContext>


            </div>
        </DndContext>
    );
};




export default CheckResultsPisaTest;