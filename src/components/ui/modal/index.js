import React from 'react';



import styles from "./style.module.sass"
import classNames from "classnames";
import {createPortal} from "react-dom";


const Modal = React.memo(({children,active,setActive,type = "field",title}) => {
	const closeModal = (e) => {
		if (e.target.classList.contains(styles.modal)) {
			setActive()
		}
	}




	return createPortal(
		<div
			className={classNames(styles.modal, {
				[`${styles.active}`]: active
			})}
			onClick={closeModal}
		>
			{
				type === "field" ?
					<div className={styles.modal__box}>
						<div className={styles.header}>
							<h1>{title}</h1>
							<div className={styles.close}>
								<i onClick={() => setActive()} className="fa-solid fa-xmark" />
							</div>
						</div>

						<div className={styles.container}>
							{children}
						</div>
					</div>
					:
					children

			}

		</div>,
		document.body
	)


}) ;

export default Modal;