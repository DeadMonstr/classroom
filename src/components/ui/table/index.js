import React from 'react';

import styles from "./style.module.sass"


const Table = ({children}) => {
	return (
		<table className={styles.table}>
			{children}
		</table>
	);
};

export default Table;