import React, {useCallback} from 'react';

import styles from "./style.module.sass"
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import {NavLink,Routes,Route} from "react-router-dom";
import useChangeMenuParams from "hooks/useChangeMenuParams";
import { useAuth } from "hooks/useAuth";
import { logDOM } from "@testing-library/react";
import { setActiveMenu } from "slices/layoutSlice";



const Menu = () => {
	const {activeMenu,title} = useSelector(state => state.layout)
	const onDropMenu = useCallback( (e) => {
		const item = e.currentTarget.parentElement

		const subItem = item.querySelector(`.${styles.multiple__container}`)
		if (subItem) {
			e.preventDefault()
			item.classList.toggle(styles.active)
			if (item.classList.contains(styles.active)) {
				subItem.style.height = subItem.scrollHeight + "px"
			} else {
				subItem.style.height = 0 + "px"
			}
		} else {
			const subItems = document.querySelectorAll(`.${styles.multiple}`)
			subItems.forEach(child => {
				child.classList.remove(styles.active)
				child.querySelector(`.${styles.multiple__container}`).style.height = 0 + "px"
			})
		}
	},[])

	const routes = [
		{
			path: "/*",
			sidebar: "main",
			options: [],
			type: "auto"
		},
		{
			path: "/subject/:id/*",
			sidebar: "subject",
			options: [],
			type: "auto"
		},
		{
			path: "/subject/:id/level/:levelId/*",
			sidebar: "lessons",
			options: [],
			type: "handmade"
		},
	]

	return (
		<nav
			className={classNames(styles.nav,{
				[`${styles.active}`] : activeMenu
			})}
		>
			{
				title ?
					<div className={styles.title}>
						{title}
					</div>
					: null
			}
			<div className={styles.options}>
				<Routes>
					{
						routes.map((route, index) => (
							<Route
								key={index}
								path={route.path}
								exact={route.exact}
								element={RenderMenuItem(route, onDropMenu)}
							/>
						))
					}
				</Routes>
				{/*{RenderMenuItem(options,onDropMenu)}*/}
			</div>
		</nav>
	);
};



const RenderMenuItem = (route ,onDropMenu) => {

	const {options} = useSelector(state => state.layout)

	const autoOption = useChangeMenuParams(route.sidebar)

	// const dispatch = useDispatch()
	//
	// useEffect(() => {
	// 	dispatch(setOptions(autoOption))
	// },[autoOption])

	const dispatch= useDispatch()
	const disableMenu = () => {
		dispatch(setActiveMenu())
	}




	const {role,restrictionsMenu} = useAuth()





	if (route.type === "handmade") {
		return options?.map((item,index) => {


			if (item?.role?.includes(role) || item?.role?.length === 0 || !item.role) {
				if (item.type === "simple") {
					return (
						<NavLink
							key={index}
							className={({ isActive }) =>
								isActive ? `${styles.simple} ${styles.active}` : `${styles.simple}`
							}
							to={item.href}
							onClick={() => disableMenu()}
						>
							<span className={styles.innerText}>{item.title}</span>
							{
								item.title.length > 20 ?
									<span className={styles.popup}>{item.title}</span> : null
							}
						</NavLink>
					)
				} else {
					return (
						<div className={styles.multiple} key={index}>
							<NavLink

								onClick={onDropMenu}
								className={({ isActive }) =>
									isActive ? `${styles.multiple__item} ${styles.active}` : `${styles.multiple__item}`
								}
								to={item.href}

							>
								<div className={styles.info}>
									<span className={styles.innerText__noActive}>{item.title}</span>
									{
										item.title.length > 20 ?
											<span className={styles.popup}>{item.title}</span> : null
									}
								</div>
								<div className={styles.icon}>
									<i className="fa-solid fa-caret-down arrow"/>
								</div>
							</NavLink>

							<ol className={styles.multiple__container}>
								{item.links.map((child,indexChild) => {
									return (
										<li key={indexChild}>
											<NavLink
												className={({ isActive }) =>
													isActive ? `${styles.simple} ${styles.active}` : `${styles.simple}`
												}
												to={`${item.href}/${child.href}`}
											>

														<div className={styles.checked}>
															{
																child.checked ?<i className="fa-solid fa-check"></i> : null
															}

														</div>

												<span className={styles.innerText}>{child.title}</span>
												{
													item.title.length > 18 ?
														<span className={styles.popup}>{child.title}</span> : null
												}


												<div className={styles.sub_info}>
													{
														child.percentage ?
															<div className={styles.percentage}>
																{child.percentage}%
															</div> : null
													}

												</div>
											</NavLink>
										</li>
									)
								})}
							</ol>
						</div>
					)
				}
			}
		})
	}
	return autoOption.options?.map((item,index) => {

		const canSeeMenu = item.restrictions ? Object.keys(item.restrictions).some(item => restrictionsMenu[item] === true) : true

		if ((item?.role?.includes(role) || item?.role?.length === 0 || !item.role) && canSeeMenu) {
			if (item.type === "simple") {

				return (
					<NavLink
						key={index}
						className={({isActive}) =>
							isActive ? `${styles.simple} ${styles.active}` : `${styles.simple}`
						}
						to={item.href}
						onClick={() => disableMenu()}
					>
						<span className={styles.innerText}>{item.title}</span>
						{
							item.title.length > 20 ?
								<span className={styles.popup}>{item.title}</span> : null
						}
					</NavLink>
				)
			} else {
				return (
					<div className={styles.multiple} key={index}>
						<NavLink

							onClick={onDropMenu}
							className={({isActive}) =>
								isActive ? `${styles.multiple__item} ${styles.active}` : `${styles.multiple__item}`
							}
							to={item.href}

						>
							<div className={styles.info}>
								<span className={styles.innerText__noActive}>{item.title}</span>
								{
									item.title.length > 20 ?
										<span className={styles.popup}>{item.title}</span> : null
								}
							</div>
							<div className={styles.icon}>
								<i className="fa-solid fa-caret-down arrow"/>
							</div>
						</NavLink>

						<ol className={styles.multiple__container}>
							{item.links.map(child => {
								return (
									<li>
										<NavLink
											className={({isActive}) =>
												isActive ? `${styles.simple} ${styles.active}` : `${styles.simple}`
											}
											to={`${item.href}/${child.href}`}
										>
											<span className={styles.innerText}>{child.title}</span>
											{
												item.title.length > 18 ?
													<span className={styles.popup}>{child.title}</span> : null
											}
										</NavLink>
									</li>
								)
							})}
						</ol>
					</div>
				)
			}
		}
	})
}

export default Menu;