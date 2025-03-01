import React, {useEffect} from 'react';
import { Navigate, Route,Routes } from "react-router-dom";
import {useParams} from "react-router";
import {fetchSubjectData} from "slices/subjectSlice"
import {useDispatch, useSelector} from "react-redux";
import Curriculum from "pages/subject/curriculum";
import Level from "pages/subject/level/Level";
import DeletedLevels from "pages/subject/curriculum/deletedLevels";


const Subject = () => {
	const {id} = useParams()
	const dispatch = useDispatch()

	const {id: subjectId} = useSelector(state => state.subject)


	useEffect(() => {
		if (id && +id !== subjectId) {
			dispatch(fetchSubjectData(id))
		}
	},[dispatch, id,subjectId])


	return (
		<Routes>
			<Route
				index
				path={"curriculum"}
				element={<Curriculum/>}
			/>
			<Route
				index
				path={"deletedLevels"}
				element={<DeletedLevels/>}
			/>
			<Route
				path={"level/:levelId/*"}
				element={<Level/>}
			/>
			<Route
				path="*"
				element={<Navigate to="curriculum" replace/>}
			/>
		</Routes>
	);
};


export default Subject;