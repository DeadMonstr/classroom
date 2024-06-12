import React from 'react';

import styles from "./styles.module.sass"
import {useNavigate} from "react-router";
import classNames from "classnames";


const Back = ({to = -1,className}) => {
	const navigate = useNavigate()

	return (
		<div className={classNames(styles.back,className)} onClick={() => navigate(to)}>
			<span><i className="fa-solid fa-arrow-left"></i></span>
		</div>
	);
};

export default Back;