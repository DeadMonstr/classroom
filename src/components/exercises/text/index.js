import React, {Fragment, useCallback, useContext, useEffect, useRef, useState} from "react";
import classNames from "classnames";
import styles from "./style.module.sass";

import TextEditor from "components/ui/textEditor/TextEditor";

import parse, {attributesToProps} from 'html-react-parser';
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useDroppable,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {DraggableWord, DroppableBox} from "./drag";
import {arrayMove,sortableKeyboardCoordinates} from "@dnd-kit/sortable";
import {ExcContext} from "helpers/contexts";
import Input from "components/ui/form/input";


const ExcText = React.memo(
    ({
         onChangeCompletedComponent,
         onSetCompletedComponent,
         component,
         onDeleteComponent,
         setAnswers
     }) => {

        const [textComponent, setTextComponent] = useState({})

        useEffect(() => {
            setTextComponent(component)
        }, [component])

        return component.completed ?
            <ViewExc
                setAnswers={setAnswers}
                textComponent={textComponent}
                setTextComponent={setTextComponent}
                onChangeCompletedComponent={onChangeCompletedComponent}

            /> :
            <CreateExc
                textComponent={textComponent}
                setTextComponent={setTextComponent}
                onSetCompletedComponent={onSetCompletedComponent}
                onDeleteComponent={onDeleteComponent}
            />


    })


const CreateExc = ({textComponent, onSetCompletedComponent, onDeleteComponent}) => {

    const [text, setText] = useState(null)
    const [editorState, setEditorState] = useState(null)

    const [clone, setClone] = useState(null)


    useEffect(() => {
        if (textComponent) {

            // setDataText(textComponent?.text)
            // setInnerType(textComponent.innerType ? textComponent.innerType : "text")
            setText(textComponent?.text)
            setEditorState(textComponent?.editorState)
        }
    }, [textComponent])


    const ref = useRef()

    const onSubmitText = (data) => {



        const newData = {
            ...data,
            clone
        }

        onSetCompletedComponent(newData)

    }


    return (
        <div className={styles.createText}>
            <div className={styles.subHeader}>
                <i
                    onClick={() => onDeleteComponent(textComponent.index)}
                    className={`fa-solid fa-trash ${styles.trash}`}
                />
            </div>

            <div className={styles.createText__container}>
                <TextEditor options={{input: true, match: true, matchWrong: true}} onSubmit={onSubmitText} text={text} editorState={editorState}/>
            </div>
        </div>
    )
}


const ViewExc = React.memo(({textComponent, setTextComponent, onChangeCompletedComponent, setAnswers}) => {



    const [words, setWords] = useState([])
    const [text, setText] = useState()
    const [parsedText, setParsedText] = useState()
    const [container, setContainer] = useState({
        id: "all",
        isFull: false,
        items: []
    })
    const {disabledExc,isView} = useContext(ExcContext)



    const [activeItem, setActiveItem] = useState()

    const onChangeWordsInput = (index, value) => {
        setWords(words => words.map((item, i) => {
            if (item.index === index) {
                return {...item, value: value}
            }
            return item
        }))
    }


    const optionsData = useCallback((words) => ({
        replace: (domNode) => {
            if (domNode.type === 'tag') {
                let hasMatchingText = false;
                const regex = /\{\{(\d+)\}\}/g;
                // Process children if they contain text nodes

                const children = domNode?.children.map(child => {
                    if (child.type === 'text' && regex.test(child.data)) {


                        hasMatchingText = true;

                        const parts = child.data.split(regex);


                        const props = {...attributesToProps(domNode?.attribs)};

                        return parts.map((part, index) => {
                            // console.log(part)
                            if (index % 2 === 1 && words?.length > 0) {


                                console.log(words)
                                const wordData = words.filter(item => item?.index === +part)[0]
                                if (container.items.length) {
                                    setContainer(container => ({
                                        ...container,
                                        items: container.items.map(item => {
                                            if (item.index === wordData.index) {
                                                return {
                                                    ...item,
                                                    styles: props.style,
                                                    classNames: props.className
                                                }
                                            }
                                            return item
                                        })
                                    }))
                                }
                                if (wordData?.type === "input") {
                                    const style = {display: "inline-block",padding: 0}
                                    return (
                                        <Input
                                            onChange={(e) => onChangeWordsInput(wordData.index,e)}
                                            // data-index={wordData?.index}
                                            className={classNames(styles.text_input, props?.className)}
                                            style={style}
                                            // key={index}
                                            placeholder={!isView && wordData?.text}
                                            disabled={disabledExc}
                                            value={wordData.value || ""}
                                            extraClassName={wordData.status !== undefined && wordData.status ? styles.active :
                                                wordData.status !== undefined && !wordData.status ? styles.error : null}
                                        />
                                    )
                                }

                                return (
                                    <DroppableBox
                                        key={`box-${wordData?.index}`}
                                        id={`box-${wordData?.index}`}
                                        status={wordData?.status}
                                        // items={wordData?.items}
                                    >
                                        {wordData?.item?.index &&
                                            <DraggableWord
                                                disabled={disabledExc}
                                                item={wordData.item}
                                                key={wordData.item.index}
                                            />
                                        }
                                    </DroppableBox>
                                )
                            }
                            return part ?
                                <span style={props?.style} className={props?.className} key={index}>{part}</span> :
                                <Fragment>{part}</Fragment>
                        });
                    }
                    return child;
                }).flat();


                if (hasMatchingText) {
                    const props = {...attributesToProps(domNode?.attribs)};
                    if (props.className === "editor-text-code" || props.style) {
                        props.className = ""

                        return React.createElement('span', {}, children);
                    }


                    return React.createElement(domNode.name, props, children);
                }
            }
        }
    }), [words, container])


    useEffect(() => {
        const parsedContent = parse(text || "", optionsData(words))
        setParsedText(parsedContent)
    }, [words, text])


    useEffect(() => {
        if (textComponent.words) {
            setWords(textComponent.words)
            setContainer(container => ({
                ...container,
                items: textComponent.words.filter(item => item.type === "matchWord" && !item.isSelected)
            }))
        }
        setText(textComponent.text)
        setWords(textComponent.words)

    }, [textComponent])


    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const findContainer = (id) => {
        if (typeof id === "string") {
            if (id === "all") return "all"
            return words.filter(item => `box-${item.index}` === id  && item.type === "matchWord")[0].index;
        }

        if (container.items.some(item => item.index === id)) return container.id
        return words.filter((item) => item?.item?.index === id  && item.type === "matchWord")[0]?.index;
    };

    const onDragStart = ({active}) => {
        setActiveItem(words.filter(item => item.index === active.id)[0]);
    };


    const onDragEnd = useCallback(({active, over}) => {

        const activeContainer = findContainer(active.id);

        if (!activeContainer) {
            setActiveItem(null);
            return;
        }




        const overId = over?.id;
        const overContainer = findContainer(overId);




        if (activeContainer && overContainer) {

            if (activeContainer !== overContainer && (overContainer === "all" || activeContainer === "all")) {


                let activeItem, overItem

                if (activeContainer === "all") {

                    activeItem = container.items.filter(item => item.index === active.id)[0]
                    overItem = words.filter(item => item.index === overContainer)[0].item

                    const filteredContainerItems = container.items.filter(item => item.index !== active.id)

                    setContainer(container => ({
                        ...container,
                        items: Object.keys(overItem || {}).length > 0 ? [...filteredContainerItems, overItem] : [...filteredContainerItems]
                    }))

                    setWords(words => words.map(item => {
                        if (item.index === activeItem.index) {
                            if ( overContainer === activeItem.index) {
                                return {
                                    ...item,
                                    item: activeItem,
                                    isSelected: true
                                }
                            }
                            return {
                                ...item,
                                isSelected: true
                            }
                        }
                        else if (item.index === overContainer) {
                            return {
                                ...item,
                                item: activeItem,
                            }
                        }
                        return item
                    }))

                } else {

                    activeItem = words.filter(item => item.index === activeContainer)[0].item
                    setContainer(container => ({
                        ...container,
                        items: [...container.items, activeItem]
                    }))

                    setWords(words => words.map(item => {
                        if (item.index === activeItem.index) {
                            if ( activeContainer === activeItem.index) {
                                return {
                                    ...item,
                                    item: {},
                                    isSelected: false
                                }
                            }
                            return {
                                ...item,
                                isSelected: false
                            }
                        }
                        if (item.index === activeContainer) {
                            return {
                                ...item,
                                item: {}
                            }
                        }
                        return item
                    }))
                }

            } else if (activeContainer !== overContainer && overContainer !== "all" || activeContainer !== "all") {
                const activeItem = words.filter(item => item.index === activeContainer)[0].item
                const overItem = words.filter(item => item.index === overContainer)[0].item


                setWords(words => words.map(item => {

                    if (item.index === overContainer) {
                        return {
                            ...item,
                            item: activeItem || {}
                        }
                    } else if (item.index === activeContainer) {
                        return {
                            ...item,
                            item: overItem || {}
                        }
                    }
                    return item
                }))
            } else {


                const activeIndex = container.items.findIndex(item => item.id === active.id);
                const overIndex = container.items.findIndex(item => item.id === overId);

                setContainer((prevItems) => ({
                    ...prevItems,
                    items: arrayMove(prevItems.items, activeIndex, overIndex)
                }))
            }
        }
        setActiveItem(null);
    }, [container, words]);

    const onDragCancel = () => {
        setActiveItem(null);
    };

    useEffect(() => {
        if (words?.length > 0 && setAnswers) {
            setAnswers(textComponent.index, {
                ...textComponent,
                answers: words,
                everyFilled: words.every(item => item.type === "matchWord" ? item.item?.index : item.value),
                someFilled: words.some(item => item.type === "matchWord" ? item.item?.index : item.value || item.value === "")
            })
        }
    }, [words])

    return (
        <DndContext
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            sensors={sensors}
            onDragCancel={onDragCancel}
            // collisionDetection={closestCorners}
        >
            <div className={styles.viewText}>
                <div className={styles.text}>
                    {
                        onChangeCompletedComponent ?
                            <div onClick={() => onChangeCompletedComponent(textComponent?.index)}
                                 className={styles.popup}>
                                <i className="fa-sharp fa-solid fa-pen-to-square"/>
                            </div> : null
                    }
                    {parsedText}
                </div>
                {
                    words?.length > 0 && !disabledExc > 0 && words.some(item => item.type === "matchWord") && <AllWordsContainer container={container} />
                }
            </div>
        </DndContext>
    )
})


const AllWordsContainer = ({container}) => {
    const {setNodeRef, over, isOver} = useDroppable({
        id: container.id,
    })

    return (
        <div
            className={styles.allWords}
            ref={setNodeRef}
        >
            {container?.items?.map(item => {
                return (
                    <DraggableWord item={item} key={item.index}/>
                )
            })}
        </div>

    )
}


export default ExcText