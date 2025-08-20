import React, { useEffect, useRef } from 'react';
import Header from "./header";
import Menu from "./menu";

import styles from "./styles.module.sass"
import {Link, Outlet} from "react-router-dom"
import Alert from "../ui/alert";
import { MainContext } from "helpers/contexts";
import AuthProvider from "components/auth/authProvider";
import { useAuth } from "hooks/useAuth";
import { useDispatch } from "react-redux";
import { setClearPassword } from "slices/userSlice";
import {useParams} from "react-router";




const Layout = () => {

	const mainRef = useRef()
	const {isCheckedPassword} = useAuth()

	const dispatch = useDispatch();
	useEffect(() => {
		if (isCheckedPassword) {
			setInterval(() => {
				dispatch(setClearPassword())
			},(1000 * 60) * 15)
		}
	},[dispatch, isCheckedPassword])
	return (


		<>
			{/*<Alert/>*/}
			{/*<Header/>*/}
			{/*<Menu/>*/}
			{/*<main id={"main"} ref={mainRef} className={styles.main}>*/}
			{/*	<MainContext.Provider value={mainRef}>*/}
			{/*		<Outlet/>*/}
			{/*	</MainContext.Provider>*/}
			{/*</main>*/}



			<AuthProvider>
				<Alert/>
				<Header/>
				<Menu/>
				<main id={"main"} ref={mainRef} className={styles.main}>
					<MainContext.Provider value={mainRef}>
						<Outlet/>
					</MainContext.Provider>
				</main>
			</AuthProvider>
		</>



	);
};

export default Layout;