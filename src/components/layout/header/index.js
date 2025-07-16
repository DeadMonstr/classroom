import React, {useEffect} from 'react';
import {Link, useLocation} from "react-router-dom";

import styles from "./style.module.sass"
import {useDispatch, useSelector} from "react-redux";
import {setActiveMenu} from "slices/layoutSlice";
import classNames from "classnames";

import userImg from "assets/user.png"
import logo from "assets/logo/Gennis logo.png"
import hamburger from "assets/hamburger.svg"
import close from "assets/close.svg"
import {BackUrlForDoc, PlatformUrl, ROLES} from "constants/global";


const Header = () => {

	const dispatch = useDispatch()
	const {data} = useSelector(state  => state.user)

	const {activeMenu} = useSelector(state => state.layout)

	return (
		<>
			<header className={styles.header}>
				<div className={styles.shape}>
					<div
						onClick={() => {
							dispatch(setActiveMenu())
						}}
						className={classNames(styles.hamburger,{
							[`${styles.active}`] : activeMenu
						})}
					>
						<img src={hamburger} alt=""/>
						<img src={close} alt=""/>
					</div>
					<Link to={"/home"}><img className={styles.logo} src={logo} alt=""/></Link>

				</div>
				<div>

				</div>
				<div>
					{
						ROLES.Parent ? null :
							<div className={styles.info}>
								<span>{data.name}</span>
								<span>{data.surname}</span>
								<Link to={`/user/${data?.id}/profile`} >
									<img src={!data.img ? userImg : `${PlatformUrl}${data.img}`} alt="UserImg" />
								</Link>

							</div>
					}

				</div>
			</header>
			<div
				onClick={() => dispatch(setActiveMenu())}
				className={classNames(styles.overlay,{
					[`${styles.active}`]: activeMenu
				})}
			/>
		</>
	);
};

export default Header;