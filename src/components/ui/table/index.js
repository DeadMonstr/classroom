import React from 'react';

import styles from "./style.module.sass"
import classNames from "classnames";


const Table = ({children,extraClassname}) => {
	return (
		<table className={classNames(styles.table,extraClassname)}>
			{children}
		</table>
	);
};

export default Table;