import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
    closestCenter,
    DndContext, DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useDroppable,
    useSensor,
    useSensors, pointerWithin, rectIntersection, getFirstCollision, defaultDropAnimationSideEffects, MeasuringStrategy
} from "@dnd-kit/core";
import {
    arrayMove, defaultAnimateLayoutChanges,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';


import {ReactComponent as ArrowDown} from "assets/icons/chevron-down-solid.svg"
import {ReactComponent as Grip} from "assets/icons/grip-vertical-solid.svg"
import {ReactComponent as ChangePen} from "assets/icons/pen-solid.svg"
import styles from "./style.module.sass"
import classNames from "classnames";
import {createPortal} from "react-dom";
import {ChangeChapterContext} from "pages/subject/level/createChapters/CreateChapters";
import {useNavigate} from "react-router";


const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: "0.5",
            },
        },
    }),
};


const Chapters = React.memo(({chapters = [],setChapters,setChangedLessons}) =>  {

    const [items, setItems] = useState([]);

    useEffect(() => {
        setItems(chapters)
    }, [chapters])

    const recentlyMovedToNewContainer = useRef(false);
    const lastOverId = useRef(null);
    const [activeItem, setActiveItem] = useState();
    const [activeContainer, setActiveContainer] = useState();
    const [activeId, setActiveId] = useState();
    const [changedItem, setChangedItem] = useState()
    const [isSubmit, setIsSubmit] = useState(false)
    const [changedIndex, setChangedIndex] = useState()


    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const collisionDetectionStrategy = useCallback(
        (args) => {
            if (activeId && items.some(item => item.chapter_id === activeId)) {
                return closestCenter({
                    ...args,
                    droppableContainers: args.droppableContainers.filter(
                        (container) => items.some(item => item.chapter_id === container.id)
                    ),
                });
            }

            // Start by finding any intersecting droppable
            const pointerIntersections = pointerWithin(args);
            const intersections =
                pointerIntersections.length > 0
                    ? // If there are droppables intersecting with the pointer, return those
                    pointerIntersections
                    : rectIntersection(args);
            let overId = getFirstCollision(intersections, "id");


            if (overId != null) {

                if (items.some(item => item.chapter_id === overId)) {

                    const containerItems = items.filter(item => item.chapter_id === overId)[0].lessons;
                    // If a container is matched, and it contains items (columns 'A', 'B', 'C')
                    if (containerItems.length > 0) {
                        // Return the closest droppable within that container
                        const isNumber = typeof overId === "number" ? +overId : overId

                        overId = closestCenter({
                            ...args,
                            droppableContainers: args.droppableContainers.filter(
                                (container) => {
                                    return (
                                        container.id !== isNumber &&
                                        containerItems.some(item => item.id === container.id)
                                    )
                                }
                            ),
                        })[0]?.id;
                    }
                }

                lastOverId.current = overId;

                return [{id: overId}];
            }


            // When a draggable item moves to a new container, the layout may shift
            // and the `overId` may become `null`. We manually set the cached `lastOverId`
            // to the id of the draggable item that was moved to the new container, otherwise
            // the previous `overId` will be returned which can cause items to incorrectly shift positions
            if (recentlyMovedToNewContainer.current) {
                lastOverId.current = activeId;
            }

            // If no droppable is matched, return the last match
            return lastOverId.current ? [{id: lastOverId.current}] : [];
        },
        [activeId, items]
    );


    const onToggleChapter = useCallback((index) => {
        setItems(items => items.map((item, i) => {
            if (i === index) {
                return {
                    ...item,
                    active: !item.active
                }
            }
            return item
        }))
    }, [items])

    const renderContainers = () => {
        return items.map((item, index) => {
            return (
                <DroppableContainer item={item} onToggleChapter={() => onToggleChapter(index)} />
            )
        })
    }

    useEffect(() => {
        requestAnimationFrame(() => {
            recentlyMovedToNewContainer.current = false;
        });
    }, [items]);


    useEffect(() => {
        if (!activeId && !changedIndex && !activeContainer && !activeItem ) return
        const isContainer = items.some(item => item.chapter_id === activeId)
        if (isContainer) {
            const isChanged = items.some((item,index) => item.chapter_id === activeId && index === changedIndex)
            if (!isChanged) {
                const newItemIndex = items.findIndex(item => item.chapter_id === activeId)
                setChangedLessons({type: "container",container: activeItem.id,oldIndex: changedIndex,newIndex: newItemIndex})
            }
        } else {

            const newItems = items.filter(containers => containers.chapter_id === activeContainer)[0]?.lessons.filter((item,index) => item.id === activeId && index === changedIndex)

            if (!newItems?.length > 0) {

                const changedContainer = items.filter((key) => key?.lessons?.some(item => item.id === +activeId))[0]
                const newItemIndex = changedContainer?.lessons?.findIndex(item => item.id === activeId)

                setChangedLessons({type: "lesson", container: changedContainer.id,lesson: activeId,oldIndex: changedIndex,newIndex: newItemIndex})
            }
        }
    },[activeContainer,activeItem,items])


    const renderedContainers = renderContainers()

    const containersIds = useMemo(() => {
        return items.map(item => item.chapter_id)
    }, [items])


    return (
        <DndContext
            sensors={sensors}
            collisionDetection={collisionDetectionStrategy}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            measuring={{
                droppable: {
                    strategy: MeasuringStrategy.Always,
                },
            }}
        >
            <SortableContext
                items={containersIds}
                strategy={verticalListSortingStrategy}
            >
                <div className={styles.chapters}>
                    {renderedContainers}
                </div>
            </SortableContext>
            {createPortal(
                <DragOverlay dropAnimation={dropAnimation}>
                    {
                        activeId
                            ? items.some(item => item.chapter_id === activeId)
                                ? renderContainerDragOverlay(activeItem)
                                : renderSortableItemDragOverlay(activeItem)
                            : null
                    }
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );

    function findContainer(id) {
        if (items.some(item => item.chapter_id === id)) {
            return id;
        }

        return items.filter((key) => key?.lessons?.some(item => item.id === +id))[0].chapter_id;
    }

    function handleDragStart(event) {
        const {active} = event;
        const {id} = active;
        const activeContainer = findContainer(id);
        let activeIndex

        if (items.some(item => item.chapter_id === id)) {
            setActiveItem(items.filter(item => item.chapter_id === id)[0])
            activeIndex = items.findIndex(item => item.chapter_id === activeContainer);
        } else {
            setActiveItem(items.filter(item => item.chapter_id === activeContainer)[0]?.lessons?.filter(item => item.id === id)[0])
            activeIndex = items.filter(item => item.chapter_id === activeContainer)[0].lessons.findIndex(item => item.id === id)
        }
        setChangedIndex(activeIndex)
        setActiveContainer(activeContainer)
        setActiveId(id);
    }


    function handleDragOver(event) {
        const {active, over} = event;
        const {id} = active;
        const overId = over?.id

        if (items.some(item => item.chapter_id === id) && over?.id) {

            setItems((containers) => {
                const activeIndex = containers.findIndex(item => item.chapter_id === active.id);
                const overIndex = containers.findIndex(item => item.chapter_id === over.id);
                return arrayMove(containers, activeIndex, overIndex);
            });
        }
        if (overId == null || items.some(item => item.chapter_id === id)) {
            return;
        }

        // Find the containers
        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);

        if (
            !activeContainer ||
            !overContainer
        ) {
            return;
        }

        if (activeContainer !== overContainer) {
            setItems((items) => {
                const activeItems = items.filter(item => item.chapter_id === activeContainer)[0];
                const overItems = items.filter(item => item.chapter_id === overContainer)[0];
                const overIndex = overItems.lessons.findIndex(item => item.id === overId);
                const activeIndex = activeItems.lessons.findIndex(item => item.id === id);

                let newIndex;

                if (items.some(item => item.chapter_id === overContainer)) {
                    newIndex = overItems.lessons.length + 1;
                } else {
                    const isBelowOverItem =
                        over &&
                        active.rect.current.translated &&
                        active.rect.current.translated.top >
                        over.rect.top + over.rect.height;

                    const modifier = isBelowOverItem ? 1 : 0;

                    newIndex =
                        overIndex >= 0 ? overIndex + modifier : overItems.lessons.length + 1;
                }

                recentlyMovedToNewContainer.current = true;

                return items.map(item => {
                    if (item.chapter_id === activeContainer) {
                        return {
                            ...item,
                            lessons: activeItems.lessons.filter((item) => item.id !== id)
                        }
                    } else if (item.chapter_id === overContainer) {
                        return {
                            ...item,
                            active: true,
                            lessons: [
                                ...overItems.lessons.slice(0, newIndex),
                                activeItems.lessons[activeIndex],
                                ...overItems.lessons.slice(
                                    newIndex,
                                    overItems.lessons.length
                                ),
                            ]
                        }
                    }
                    return item
                })
            });
        }
    }

    function handleDragEnd(event) {
        const {active, over} = event;
        const {id} = active;

        const activeContainer = findContainer(id);
        const overId = over?.id


        if (!activeContainer) {
            setActiveId(null);
            return;
        }


        if (overId == null) {
            setActiveId(null);
            return;
        }

        const overContainer = findContainer(overId);

        if (overContainer) {

            const activeItems = items.filter(item => item.chapter_id === activeContainer)[0];
            const overItems = items.filter(item => item.chapter_id === overContainer)[0];
            const activeIndex = activeItems.lessons.findIndex(item => item.id === id);
            const overIndex = overItems.lessons.findIndex(item => item.id === overId);

            if (activeIndex !== overIndex) {

                setItems((items) => items.map(item => {
                    if (item.chapter_id === overContainer) {
                        return {
                            ...item,
                            lessons: arrayMove(
                                overItems.lessons,
                                activeIndex,
                                overIndex
                            )
                        }
                    }
                    return item
                }))
            }
        }
        // setActiveId(null);
        // setActiveItem(null);
    }


    function renderSortableItemDragOverlay(item) {
        return (
            <Item
                item={item}
                id={item.id}
                isDragging={true}
                isDragOverlay={true}
            />
        );
    }

    function renderContainerDragOverlay(item) {
        return (
            <Container
                chapter={item}
                dragOverlay={true}
                activeDown={item.active}
                items={item.lessons}
                onToggleChapter={() => {}}
            />
        );
    }

})

const animateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({...args, wasDragging: true});


const Container = React.forwardRef((props, ref) => {

    const {
        attributes,
        listeners,
        items,
        activeDown,
        onToggleChapter,
        style,
        dragOverlay,
        chapter
    } = props


    const {activeChangeData} = useContext(ChangeChapterContext)

    const lessonsIds = useMemo(() => {
        return items.map(item => item.id)
    }, [items])


    const checkClickToggle = (e) => {

        if (e.target.classList.contains(styles.iconChange)) {
            return
        }
        onToggleChapter()
    }


    const height = useRef()

    return (
        <SortableContext
            items={lessonsIds}
            strategy={verticalListSortingStrategy}
        >
            <div
                style={style}
                {...attributes}
                ref={ref}
                className={classNames(styles.chapter, {
                    [styles.dragOverlay]: dragOverlay
                })}
            >
                <div
                    className={classNames(styles.info, {
                        [`${styles.active}`]: activeDown
                    })}
                    onClick={checkClickToggle}
                >
                    <div>
                        {chapter?.name}
                    </div>

                    <div>
                        <ChangePen
                            onClick={() => activeChangeData({...chapter})}
                            className={styles.iconChange}
                        />

                        <Grip
                            {...listeners}
                            className={styles.handle}
                        />
                        <ArrowDown className={styles.iconDown}/>
                    </div>

                </div>
                <div
                    ref={height}
                    className={styles.items}
                    style={
                        activeDown
                            ? {height: height?.current?.scrollHeight}
                            : {height: "0px"}
                    }
                >
                    {items?.map((item) =>
                        <SortableItem
                            containerId={chapter.id}
                            item={item}
                            key={item.id}
                        />
                    )}
                </div>
            </div>
        </SortableContext>
    )
})

function SortableItem({item,containerId}) {

    const {changeLessonsSort} = useContext(ChangeChapterContext)


    const {
        isDragging,
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({
        id: item.id,
        disabled: !changeLessonsSort,
        transition: {
            duration: 150, // milliseconds
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        }
    });

    return (
        <Item
            containerId={containerId}
            attributes={attributes}
            listeners={listeners}
            setNodeRef={setNodeRef}
            transform={transform}
            transition={transition}
            id={item.id}
            item={item}
            isDragging={isDragging}
        />
    );
}


const DroppableContainer = React.memo((props) => {

    const {item, style, onToggleChapter} = props
    const {changeLessonsSort} = useContext(ChangeChapterContext)


    const {
        active,
        attributes,
        isDragging,
        listeners,
        over,
        setNodeRef,
        transition,
        transform,
    } = useSortable({
        id: item.chapter_id,
        disabled: !changeLessonsSort,
        data: {
            type: 'container',
            children: item.lessons,
        },
        animateLayoutChanges,
    });

    const isOverContainer = over
        ? (item.id === over.id && active?.data.current?.type !== 'container') ||
        item.lessons.some(key => key.id === over.id)
        : false;

    return (
        <Container
            style={{
                ...style,
                transition,
                transform: CSS?.Translate.toString(transform),
                opacity: isDragging ? 0.5 : undefined,
            }}
            attributes={attributes}
            listeners={listeners}
            ref={setNodeRef}
            activeDown={item.active}
            items={item.lessons}
            onToggleChapter={onToggleChapter}
            chapter={item}
        />
    )
})


const Item = (props) => {
    const {
        item,
        isDragging,
        isDragOverlay,
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        containerId
    } = props


    const {changeLessonsSort} = useContext(ChangeChapterContext)

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    };


    const [lastClickTime, setLastClickTime] = useState(0);




    const handleDoubleClick = () => {
        const currentTime = new Date().getTime();
        // Check if the time between clicks is within a certain threshold (e.g., 500 milliseconds)
        if (currentTime - lastClickTime < 500) {
            alert("Double click detected!");
            // Perform your desired action here

            // Reset the last click time
            setLastClickTime(0);
        } else {
            // Update the last click time if it's a single click
            setLastClickTime(currentTime);
        }
    };


    const navigate = useNavigate()
    const NavigateToItem = () => {
        if (changeLessonsSort) return
        navigate(`../changeLevelLesson/${containerId}/${item.order}`)
    }

    return (
        <div
            onClick={NavigateToItem}
            className={classNames(styles.lesson, {
                [styles.dragging]: isDragging,
                [styles.dragOverlay]: isDragOverlay
            })}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            {item.name}
        </div>
    )
}


export default Chapters;