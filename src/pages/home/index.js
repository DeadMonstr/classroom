import React, {useEffect} from 'react';

import styles from "./styles.module.sass"

import useChangeMenuParams from "hooks/useChangeMenuParams";
import { useDispatch } from "react-redux";
import {setOptions} from "slices/layoutSlice";
import { ROLES } from "constants/global";
import RequireAuthChildren from "components/auth/requireAuthChildren";

import {SubjectsBlock} from "./subjectsBlock/subjectsBlock";
import {TestsBlock} from "./testsBlock/testsBlock";

const Home = () => {





	const options = useChangeMenuParams("main","")
	const dispatch = useDispatch()


	useEffect(() => {
		dispatch(setOptions(options))
	},[dispatch, options])



	return (
		<div className={styles.home}>


			<div className={styles.home__wrapper}>
				<RequireAuthChildren allowedRules={[ROLES.Methodist,ROLES.Teacher,ROLES.Student]}>
					<SubjectsBlock />
				</RequireAuthChildren>


				<TestsBlock/>
			</div>


		</div>
	);
};









export default Home;