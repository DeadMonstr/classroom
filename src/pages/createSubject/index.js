import React from 'react';
import styles from "./style.module.sass"
import Input from "components/ui/form/input";
import CreateLevel from "./createLevel";



const CreateSubjects = () => {
	return (
		<div className={styles.createSubject}>

			<div className={styles.header}>
				<h1>Fanlar yaratish</h1>
			</div>

			<div className={styles.container}>

				<div className={styles.addIcon}>

				</div>
			</div>
		</div>
	);
};






// const CreateSubject = () => {
// 	return (
// 		<div className={styles.createSubject}>
//
// 			<div className={styles.header}>
// 				<h1>Ingliz tili</h1>
// 			</div>
//
//
//
// 			<CreateLevel/>
//
//
// 		</div>
// 	);
// };

export default CreateSubjects;