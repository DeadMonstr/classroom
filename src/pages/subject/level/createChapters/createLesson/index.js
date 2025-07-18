import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styles from "./style.module.sass"
import classNames from "classnames";

import Video from "components/lesson/video"
import Img from "components/lesson/img";
import Exercises from "components/lesson/exercises";
import Snippet from "components/lesson/snippet";
import File from "components/lesson/file/File";
import Input from "components/ui/form/input";
import Form from "components/ui/form";
import Select from "components/ui/form/select";
import Button from "components/ui/button";


import {useNavigate, useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {BackUrl, headers} from "constants/global";
import {setAlertOptions, setOptionsByHref} from "slices/layoutSlice";
import {useHttp} from "hooks/http.hook";
import TextEditorExc from "components/exercises/textEditor/TextEditor";
import Loader from "components/ui/loader/Loader";

import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {CSS} from '@dnd-kit/utilities';
import {ReactComponent as ChangePen} from "assets/icons/pen-solid.svg"



import {createPortal, unstable_batchedUpdates} from "react-dom";
import Checkbox from "components/ui/form/checkbox";


const CreateLesson = () => {

    const {levelId} = useParams()
    const {id} = useSelector(state => state.subject)

    const [activeTools, setActiveTools] = useState(false)
    const [isTest, setIsTest] = useState(false)
    const [nameLesson, setNameLesson] = useState("")
    const [numberTest, setNumberTest] = useState(null)
    const [chapters, setChapters] = useState([])

    const [selectedChapter, setSelectedChapter] = useState("")


    const [components, setComponents] = useState([])
    const [changeLessonsSort, setChangeLessonsSort] = useState(false)

    const [loading, setLoading] = useState(false)


    const tools = [
        {
            value: "text",
            title: "Matn"
        },
        {
            value: "snippet",
            title: "Code"
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
            value: "exc",
            title: "Mashq"
        }
    ]

    useEffect(() => {
        request(`${BackUrl}chapter/info/${levelId}`, "GET", null, headers())
            .then(res => {
                setChapters(res.chapters)
            })
    }, [levelId])

    const addComponent = (type) => {
        if (type === "text") {
            unstable_batchedUpdates(() => {
                setComponents(components => [...components, {
                    type: type,
                    text: "",
                    words: [],
                    completed: false,
                    index: components.length+1
                }]);
            })
        } else {
            setComponents(components => [...components, {
                type: type,
                completed: false,
                index: components.length+1
            }])
        }

    }

    const onDeleteComponent = (index) => {
        const sortedList = components.filter((item, i) => i !== index - 1)
        setComponents(sortedList)
    }


    const onSetCompletedComponent = useCallback((data) => {
        setComponents(state => state.map((item, index) => {
            if (!item.completed) {
                return {...item, ...data, completed: true}
            }
            return item
        }))
    }, [components])


    const onChangeCompletedComponent = (index) => {
        if (components.every(item => item.completed)) {
            setComponents(state => state.map((item, i) => {
                if (i === index - 1) {
                    return {...item, completed: false}
                }
                return item
            }))
        }
    }




    const renderComponents = useCallback(() => {
        return components?.map((item) => {
            if (item.type === "text") {
                return (
                    <SortableItem
                        isChange={changeLessonsSort}
                        item={item}
                        key={item.index}
                        id={item.index}
                    >
                       <TextEditorExc
                           onChangeCompletedComponent={onChangeCompletedComponent}
                           onSetCompletedComponent={onSetCompletedComponent}
                           onDeleteComponent={onDeleteComponent}
                           component={item}
                       />
                     </SortableItem>
                )
            }
            if (item.type === "video") {
                return (
                    <SortableItem
                        isChange={changeLessonsSort}
                        item={item}
                        key={item.index}
                        id={item.index}
                    >
                        <Video
                            component={item}
                            onChangeCompletedComponent={onChangeCompletedComponent}
                            onSetCompletedComponent={onSetCompletedComponent}
                            onDeleteComponent={onDeleteComponent}
                        />
                    </SortableItem>
                )
            }
            if (item.type === "img") {
                return (
                    <SortableItem
                        isChange={changeLessonsSort}
                        item={item}
                        key={item.index}
                        id={item.index}
                    >
                        <Img
                            component={item}
                            onChangeCompletedComponent={onChangeCompletedComponent}
                            onSetCompletedComponent={onSetCompletedComponent}
                            onDeleteComponent={onDeleteComponent}
                        />
                    </SortableItem>
                )
            }
            if (item.type === "file") {
                return (
                    <SortableItem
                        isChange={changeLessonsSort}
                        item={item}
                        key={item.index}
                        id={item.index}
                    >
                        <File
                            component={item}
                            onChangeCompletedComponent={onChangeCompletedComponent}
                            onSetCompletedComponent={onSetCompletedComponent}
                            onDeleteComponent={onDeleteComponent}
                        />
                    </SortableItem>

                )
            }
            if (item.type === "snippet") {
                return (
                    <SortableItem
                        isChange={changeLessonsSort}
                        item={item}
                        key={item.index}
                        id={item.index}
                    >
                        <Snippet
                            component={item}
                            onChangeCompletedComponent={onChangeCompletedComponent}
                            onSetCompletedComponent={onSetCompletedComponent}
                            onDeleteComponent={onDeleteComponent}
                        />
                    </SortableItem>

                )
            }
            if (item.type === "exc") {
                return (
                    <SortableItem
                        isChange={changeLessonsSort}
                        item={item}
                        key={item.index}
                        id={item.index}
                    >
                        <Exercises
                            subjectId={id}
                            levelId={levelId}
                            component={item}
                            onChangeCompletedComponent={onChangeCompletedComponent}
                            onSetCompletedComponent={onSetCompletedComponent}
                            onDeleteComponent={onDeleteComponent}
                            exercises={components.filter(item => item.type === "exc")}
                        />
                    </SortableItem>
                )
            }
        })
    }, [components,changeLessonsSort])

    const {request} = useHttp()
    const dispatch = useDispatch()
    const navigate = useNavigate()

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
            levelId,
            subjectId: id,
            name: nameLesson,
            chapter: selectedChapter,
            number_test: numberTest,
         }


        formData.append("info", JSON.stringify(newData))


        const token = sessionStorage.getItem("token")


        setLoading(true)
        request(`${BackUrl}lesson/info/${levelId}`, "POST", formData, {
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

    const onToggleChangeLessonSort = () => {
        setChangeLessonsSort(prev => !prev)
    }
    const typeChangeLessonSort = useMemo(() => {
        return changeLessonsSort ? "danger" : "simple"
    },[changeLessonsSort])

    if (loading) return <Loader/>

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className={styles.createLesson}>
                <Form id={"createLesson"} onSubmit={onSubmit}  typeSubmit={"outside"}>
                    <div className={styles.header}>
                        <div className={styles.header__item}>
                            <Input required={true} title={"Darslik nomi"} value={nameLesson} onChange={setNameLesson} />
                            <Select
                                title={"Bo'lim"}
                                value={selectedChapter}
                                options={chapters}
                                onChange={setSelectedChapter}
                            />
                            <div className={styles.test}>
                                <h2>Test</h2>
                                <Checkbox onChange={setIsTest} value={isTest}/>
                            </div>
                            {isTest &&  <Input type={"number"} required={true} title={"Test soni"} value={numberTest} onChange={setNumberTest} />}
                            {
                                components[components.length- 1]?.completed || components.length === 0 ?
                                <Button
                                    form={null}
                                    type={typeChangeLessonSort}
                                    active={changeLessonsSort}
                                    onClick={onToggleChangeLessonSort}
                                >
                                    <ChangePen/>
                                </Button> : null
                            }

                        </div>
                        <h1 className={styles.title}>Darslik yaratish</h1>
                    </div>

                </Form>


                <SortableContext
                    items={itemsIndex}
                    strategy={verticalListSortingStrategy}
                >
                    <div className={styles.createLesson__container}>
                        {renderedComponents}
                        {
                            components[components.length - 1]?.completed || components.length === 0 ?
                                <div className={styles.createLesson__add}>
                                    <div
                                        onClick={() => setActiveTools(!activeTools)}
                                        className={classNames(styles.icon, {
                                            [`${styles.active}`]: activeTools
                                        })}
                                    >
                                        <i className="fa-solid fa-plus"/>
                                    </div>
                                    <div className={classNames(styles.tools, {
                                        [`${styles.active}`]: activeTools
                                    })}>
                                        {
                                            tools.map(item => {
                                                return (
                                                    <div
                                                        onClick={() => addComponent(item.value)}
                                                        className={styles.tools__item}
                                                    >
                                                        {item.title}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div> : null
                        }
                    </div>
                </SortableContext>
                {
                    components[components.length - 1]?.completed ?
                        <div className={styles.submit}>
                            <Button form={"createLesson"} type={"submit"} >
                                Tasdiqlash
                            </Button>
                        </div> : null
                }

            </div>
        </DndContext>
    );
};


function SortableItem(props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: props.item.index,
        disabled: !props.item.completed ? true : !props.isChange
    });


    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            {props.children}
        </div>
    );
}

export default CreateLesson;