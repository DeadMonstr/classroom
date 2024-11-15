import React from "react";
import styles from "../style.module.sass";
import classNames from "classnames";
import {useDraggable, useDroppable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";

function DroppableBox({children,id,status}) {
	const {setNodeRef,over,isOver} = useDroppable({
		id,
	});

	const style =  isOver ? {backgroundColor: "rgba(152,152,152,0.73)"} : null

	return (

		<span
			data-index={id}
			style={style}
			ref={setNodeRef}
			className={classNames(styles.matchedWord__box,{
				[`${styles.active}`] : status,
				[`${styles.error}`]: status ===false
			})}
		>
			{children}
		</span>
	);
}


function DraggableWord({item,disabled}) {


	const {attributes, listeners, setNodeRef, transform} = useDraggable({
		id: item.index,disabled
	});

	const style = {
		transform: CSS.Translate.toString(transform),
	};

	return (
		<div
			style={style}
			{...listeners}
			{...attributes}
			className={styles.matchedWord}
			ref={setNodeRef}
		>
			<div style={item.styles}  className={item.classNames} dangerouslySetInnerHTML={{__html: item.text}}></div>
		</div>
	);
}

export {DroppableBox,DraggableWord}