import React, { useEffect, useState } from 'react';
import styles from "./styles.module.sass"
import {Link} from "react-router-dom";
import { useHttp } from "hooks/http.hook";
import { useSelector } from "react-redux";



const Curriculum = () => {



	const {curriculum} = useSelector(state => state.group)

	console.log(curriculum)



	return (
		<div className={styles.curriculum}>
			{
				curriculum.map((item,index) => {
					return (
						<Link to={`/subject/${item.subject.id}/level/${item.id}`} key={index} className={styles.curriculum__item}>
							<div className={styles.header}>
								<span>{item.name}</span>
								<span>{item.finished_percentage}%</span>
							</div>
							<div className={styles.percentage}>
								<div style={{width: item.finished_percentage + "%"}} className={styles.line} />
							</div>
							<div className={styles.desc}>
								{item.desc}
							</div>
						</Link>


					)
				})
			}
		</div>
	);
};

export default Curriculum;