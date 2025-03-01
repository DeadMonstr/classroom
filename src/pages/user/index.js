import React, { useEffect } from 'react';
import { useHttp } from "hooks/http.hook";
import { Navigate, Route, Routes } from "react-router-dom"



import Profile from "pages/user/profile";
import ChangeProfile from "pages/user/changeProfile";
import AttendanceStudent from "pages/user/attendance";
import AttendanceStudentHistory from "pages/user/attendance/history";
import BalanceHistory from "pages/user/balanceHistory";
import UserLessonTime from "pages/user/lessonTime";
import TeacherSalary from "pages/user/teacherSalary/TeacherSalary";
import TeacherMonthSalary from "pages/user/teacherMonthSalary/TeacherMonthSalary";
import TeacherStudentsDebt from "pages/user/teacherStudentsDebt/TeacherStudentsDebt";
import StudentsCertificates from "pages/user/studentsCertificates/StudentsCertificates";



const User = () => {

	const {id} = useHttp()

	const {request} = useHttp()





	return (
		<>
			<Routes>

				<Route path={"profile"} element={<Profile/>}/>
				<Route path={"changeProfile"} element={<ChangeProfile/>}/>
				<Route path={"studentAttendance"} element={<AttendanceStudent/>}/>
				<Route path={"studentAttendanceHistory/:studentId/:groupId/:month/:year"} element={<AttendanceStudentHistory/>}/>
				<Route path={"balanceHistory"} element={<BalanceHistory/>}/>
				<Route path={"userLessonTime"} element={<UserLessonTime/>}/>
				<Route path={"teacherSalary"} element={<TeacherSalary/>}/>
				<Route path={"teacherSalary/month/:monthId"} element={<TeacherMonthSalary/>}/>
				<Route path={"teacherSalary/debtStudents"} element={<TeacherStudentsDebt/>}/>
				<Route path={"studentsCertificates"} element={<StudentsCertificates/>}/>

				<Route
					path="*"
					element={<Navigate to="profile" replace/>}
				/>

			</Routes>
		</>
	);
};

export default User;