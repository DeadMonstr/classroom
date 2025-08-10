import React, {Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import classNames from "classnames";
import styles from "./style.module.sass";

import TextEditor from "components/ui/textEditor/TextEditor";

import parse, {attributesToProps, domToReact} from 'html-react-parser';
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useDroppable,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {DraggableWord, DroppableBox} from "./drag";
import {arrayMove, sortableKeyboardCoordinates} from "@dnd-kit/sortable";
import {ExcContext} from "helpers/contexts";
import Input from "components/ui/form/input";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";


const  ExcText = React.memo(
    ({
         onChangeCompletedComponent,
         onSetCompletedComponent,
         component,
         onDeleteComponent,
         setAnswers,
         extra
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
                extra={extra}
            />


    })


const CreateExc = ({textComponent, onSetCompletedComponent, onDeleteComponent,extra}) => {

    const {request} = useHttp()


    const onAdd = (e) => {
        let method = textComponent?.id ? "PUT" : "POST"
        request(`${BackUrl}exercise/block/text/${textComponent.id ? textComponent.id + "/" : ""}`, method, JSON.stringify({...textComponent, ...e, ...extra}), headers())
            .then(res => {
                onSetCompletedComponent(e, res.id)
            })
    }

    const onDelete = () => {
        if (textComponent?.id) {
            request(`${BackUrl}exercise/block/text/${textComponent?.id}/`, "DELETE", null, headers())
                .then(res => {
                    onDeleteComponent(textComponent.id)
                })
        } else {
            onDeleteComponent(textComponent.id)
        }
    }


    return (
        <div className={styles.createText}>
            <div className={styles.subHeader}>
                <i
                    onClick={onDelete}
                    className={`fa-solid fa-trash ${styles.trash}`}
                />
            </div>

            <div className={styles.createText__container}>
                <TextEditor options={{input: true, match: true, matchWrong: true}} onSubmit={onAdd} text={textComponent?.text}
                            editorState={textComponent.editorState}/>
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
    const {disabledExc, isView} = useContext(ExcContext)


    const [activeItem, setActiveItem] = useState()

    const onChangeWordsInput = (index, value) => {
        setWords(words => words.map((item, i) => {
            if (item.index === index) {
                return {...item, value: value}
            }
            return item
        }))
    }




    // const optionsData = useCallback((words) => ({
    //     replace: (domNode) => {
    //         if (domNode.type === 'tag') {
    //             let hasMatchingText = false;
    //             const regex = /\{\{(\d+)\}\}/g;
    //             // Process children if they contain text nodes
    //
    //
    //             const children = domNode?.children.map(child => {
    //
    //
    //                 if (child.type === 'text' && regex.test(child.data)) {
    //
    //
    //
    //                     hasMatchingText = true;
    //
    //                     const parts = child.data.split(regex);
    //
    //                     const props = {...attributesToProps(domNode?.attribs)};
    //
    //
    //
    //
    //                     return parts.map((part, index) => {
    //
    //                         if (index % 2 === 1 && words?.length > 0) {
    //
    //                             const wordData = words.filter(item => item?.index === +part)[0]
    //                             if (container?.items?.length) {
    //                                 setContainer(container => ({
    //                                     ...container,
    //                                     items: container?.items?.map(item => {
    //                                         if (item.index === wordData.index) {
    //                                             return {
    //                                                 ...item,
    //                                                 styles: props.style,
    //                                                 classNames: props.className
    //                                             }
    //                                         }
    //                                         return item
    //                                     })
    //                                 }))
    //                             }
    //                             if (wordData?.type === "input") {
    //
    //                                 const style = {display: "inline-block", padding: 0}
    //                                 return (
    //                                     <Input
    //                                         onChange={(e) => onChangeWordsInput(wordData.index, e)}
    //                                         // data-index={wordData?.index}
    //                                         className={classNames(styles.text_input, props?.className)}
    //                                         style={style}
    //                                         // key={index}
    //                                         placeholder={!isView && wordData?.text}
    //                                         disabled={disabledExc}
    //                                         value={wordData.value || ""}
    //                                         extraClassName={wordData.status !== undefined && wordData.status ? styles.active :
    //                                             wordData.status !== undefined && !wordData.status ? styles.error : null}
    //                                     />
    //                                 )
    //                             }
    //
    //                             return (
    //                                 <DroppableBox
    //                                     key={`box-${wordData?.index}`}
    //                                     id={`box-${wordData?.index}`}
    //                                     status={wordData?.status}
    //                                     // items={wordData?.items}
    //                                 >
    //                                     {wordData?.item?.index &&
    //                                         <DraggableWord
    //                                             disabled={disabledExc}
    //                                             item={wordData.item}
    //                                             key={wordData.item.index}
    //                                         />
    //                                     }
    //                                 </DroppableBox>
    //                             )
    //                         }
    //                         return part ?
    //                             <span style={props?.style} className={props?.className} key={index}>{part}</span> :
    //                             <Fragment>{part}</Fragment>
    //                     });
    //                 }
    //
    //
    //                 return domToReact([child]); // ✅ convert raw DOM node to React element
    //
    //             }).flat();
    //
    //
    //
    //
    //
    //             if (hasMatchingText) {
    //                 const props = {...attributesToProps(domNode?.attribs)};
    //                 if (props.className === "editor-text-code" || props.style) {
    //                     props.className = ""
    //
    //                     return React.createElement('span', {}, children);
    //                 }
    //
    //
    //                 return React.createElement(domNode.name, props, children);
    //             }
    //
    //
    //         }
    //     }
    // }), [words, container])
    //
    // useEffect(() => {
    //     const parsedContent = parse(text || "", optionsData(words))
    //     setParsedText(parsedContent)
    // }, [words, text])




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
            return words.filter(item => `box-${item.index}` === id && item.type === "matchWord")[0].index;
        }

        if (container.items.some(item => item.index === id)) return container.id
        return words.filter((item) => item?.item?.index === id && item.type === "matchWord")[0]?.index;
    };

    const onDragStart = ({active}) => {
        setActiveItem(words.filter(item => item.index === active.id)[0]);
    };
    console.log(words)

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
                            if (overContainer === activeItem.index) {
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
                        } else if (item.index === overContainer) {
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
                            if (activeContainer === activeItem.index) {
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
                            <div onClick={() => onChangeCompletedComponent(textComponent?.id)}
                                 className={styles.popup}>
                                <i className="fa-sharp fa-solid fa-pen-to-square"/>
                            </div> : null
                    }

                    <HtmlParser
                        text={textComponent.text}
                        words={words}
                        // disabled={disabled}
                        isView={isView}
                        onChangeWordsInput={onChangeWordsInput}
                        onWordDrop={setContainer}
                    />

                </div>
                {
                    words?.length > 0 && !disabledExc > 0 && words.some(item => item.type === "matchWord") &&
                    <AllWordsContainer container={container}/>
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




export function HtmlParser({
                                       text,
                                       words,
                                       disabled = false,
                                       isView = false,
                                       onChangeWordsInput,
                                       onWordDrop,
                                       className = "",
                                       style = {},
                                       showDebugInfo = false,
                                   }) {
    const [parsedText, setParsedText] = useState(null)

    const handleInputChange = (index, e) => {
        if (onChangeWordsInput) {
            onChangeWordsInput(index, e)
        } else {
            console.log(`Input changed for index ${index}:`, e.target.value)
        }
    }

    const handleWordDrop = (wordIndex, targetIndex) => {
        if (onWordDrop) {
            onWordDrop(wordIndex, targetIndex)
        } else {
            console.log(`Word ${wordIndex} dropped on target ${targetIndex}`)
        }
    }

    useEffect(() => {
        if (!text || !words) {
            setParsedText(null)
            return
        }

        // Create a words map for quick lookup
        const wordsMap = new Map()
        words.forEach((word) => wordsMap.set(word.index, word))

        // First, let's do a simple string replacement approach
        let processedHtml = text

        // Replace each {{index}} with a unique placeholder that we can identify later
        const placeholders = new Map()
        let placeholderCounter = 0

        processedHtml = processedHtml.replace(/\{\{(\d+)\}\}/g, (match, indexStr) => {
            const index = Number.parseInt(indexStr, 10)
            const wordData = wordsMap.get(index)

            if (wordData) {
                const placeholderId = `__PLACEHOLDER_${placeholderCounter++}__`
                placeholders.set(placeholderId, { wordData, originalMatch: match })
                return placeholderId
            }

            return match // Keep original if no word data found
        })

        // Now parse the HTML with placeholders
        const options = {
            replace: (domNode) => {
                if (domNode.type === "text" && domNode.data) {
                    // Check if this text node contains our placeholders
                    const hasPlaceholder = Array.from(placeholders.keys()).some((placeholder) =>
                        domNode.data.includes(placeholder),
                    )

                    if (hasPlaceholder) {
                        // Split the text by placeholders and create React elements
                        let parts = [domNode.data]

                        placeholders.forEach((data, placeholderId) => {
                            const newParts = []
                            parts.forEach((part) => {
                                if (typeof part === "string" && part.includes(placeholderId)) {
                                    const splitParts = part.split(placeholderId)
                                    for (let i = 0; i < splitParts.length; i++) {
                                        if (splitParts[i]) {
                                            newParts.push(splitParts[i])
                                        }
                                        if (i < splitParts.length - 1) {
                                            // Insert the React component here
                                            const { wordData } = data

                                            if (wordData.type === "input") {
                                                newParts.push(
                                                    <Input
                                                        key={`input-${wordData.index}`}
                                                        onChange={(e) => handleInputChange(wordData.index, e)}
                                                        className="text-input"
                                                        style={{ display: "inline-block", padding: 0 }}
                                                        placeholder={!isView ? wordData.text : ""}
                                                        disabled={disabled}
                                                        value={wordData.value || ""}
                                                        extraClassName={
                                                            wordData.status !== undefined ? (wordData.status ? "active" : "error") : null
                                                        }
                                                    />,
                                                )
                                            } else {
                                                newParts.push(
                                                    <DroppableBox
                                                        key={`box-${wordData.index}`}
                                                        id={`box-${wordData.index}`}
                                                        status={wordData.status}
                                                    >
                                                        {wordData.item?.index && (
                                                            <DraggableWord
                                                                disabled={disabled}
                                                                item={wordData.item}
                                                                key={`word-${wordData.item.index}`}
                                                            />
                                                        )}
                                                    </DroppableBox>,
                                                )
                                            }
                                        }
                                    }
                                } else {
                                    newParts.push(part)
                                }
                            })
                            parts = newParts
                        })

                        return <Fragment>{parts}</Fragment>
                    }
                }
            },
        }

        try {
            const parsed = parse(processedHtml, options)
            setParsedText(parsed)
        } catch (error) {
            console.error("Error parsing HTML:", error)
            setParsedText(<div>Error parsing content</div>)
        }
    }, [text, words, disabled, isView])

    return (
        <div className={`html-parser-container ${className}`} style={style}>
            {showDebugInfo && (
                <>
                    <h2>Original HTML:</h2>
                    <pre style={{ background: "#f5f5f5", padding: "10px", fontSize: "12px", whiteSpace: "pre-wrap" }}>{text}</pre>
                </>
            )}

            <div
                style={{
                    border: showDebugInfo ? "1px solid #ccc" : "none",
                    padding: showDebugInfo ? "20px" : "0",
                    minHeight: showDebugInfo ? "100px" : "auto",
                }}
            >
                {parsedText}
            </div>

            {showDebugInfo && (
                <>
                    <h2>Words Data:</h2>
                    <pre style={{ background: "#f5f5f5", padding: "10px", fontSize: "12px" }}>
            {JSON.stringify(words, null, 2)}
          </pre>
                </>
            )}
        </div>
    )
}


export default ExcText