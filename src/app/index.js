import React, {lazy, Suspense, useEffect, useState} from 'react';
import {
    Route,
    Navigate,
    createBrowserRouter,
    RouterProvider,
    createRoutesFromElements,
} from "react-router-dom";

import "./style.sass"

import Loader from "components/ui/loaderPage/LoaderPage";
import ChangeExercises from "pages/exercises/changeExercises";


import GetUser from "pages/getUser";
import RequireAuth from "components/auth/requireAuth";
import {ROLES} from "constants/global";
import Books from "pages/books/Books";
import TeacherObservation from "pages/teacherObservation/teacherObservation";
import Lesson from "pages/subject/level/chapters/lesson";
import Chat from "pages/chat";

import Presentations from "pages/presentations/Presentations";
import Presentation from "pages/presentation/Presentation";
import CreateTestTuron from "pages/testTuron/create/createTestTuron";
import ViewTestTuron from "pages/testTuron/view/viewTestTuron";
import GetUserTuron from "pages/getUserTuron/GetUserTuron";
import Login from "pages/login/Login";

import PisaTestList from "pages/pisaTest/PisaTestList";
import CreatePisaTest from "pages/pisaTest/create/CreatePisaTest";
import RegisterPisa from "pages/registerPisa/registerPisa";
import LoginPisa from "pages/loginPisa/LoginPisa";
import ViewPisaTest from "pages/pisaTest/view/ViewPisaTest";
import MyResultPisaTest from "pages/pisaTest/myResult/MyResultPisaTest";
import CheckResultsPisaTest from "pages/pisaTest/checkExc/CheckResultsPisaTest";
import RegisteredStudentsPisa from "pages/pisaTest/registeredStudents/RegisteredStudentsPisa";

import ChildrenLayoutMB from "../pages/parentSection/childrenLayoutMB/childrenLayoutMB";
// import {isMobile} from "react-device-detect";
import ChildrenWeeklyGrades from "../pages/parentSection/childrenWeeklyGrades/childrenWeeklyGrades";

import {PisaTestResults} from "pages/pisaTestResults";
import TestContent from "pages/testContent";



const Layout = lazy(() => import("components/layout"))
const Home = lazy(() => import("pages/home"))
const User = lazy(() => import("pages/user"))
const Subject = lazy(() => import("pages/subject"))
const CreateExercises = lazy(() => import("pages/exercises/createExercises"))
const CreateExercisesTypes = lazy(() => import("pages/exercises/createType"))
const Exercises = lazy(() => import("pages/exercises"))
const Groups = lazy(() => import("pages/groups"))
const TaskManager = lazy(() => import("pages/taskManager/TaskManager"))
const ParentSection = lazy(() => import("pages/parentSection/parentSection"))
const ParentBalanceList = lazy(() => import("pages/parentSection/parentBalanceList/parentBalanceList"))
const ChildrenMonthlyTestsResults = lazy(() => import("pages/parentSection/childrenMonthlyTestsResults/childrenMonthlyTestsResults"))
const ChildrenMonthlyGrades = lazy(() => import("pages/parentSection/childrenMonthlyGrades/childrenMonthlyGrades"))
const ChildrenMonthlyAttendance = lazy(() => import("pages/parentSection/childrenMonthlyAttendance/childrenMonthlyAttendance"))

const App = () => {

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 375);

    useEffect(() => {
        const handleResize = () => {
            if ((window.innerWidth <= 375) !== isMobile) {
                window.location.reload();
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isMobile]);




    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route
                    path={"get_user/:token/:refreshToken"}
                    element={<GetUser/>}
                />

                <Route
                    path={"get_user_turon/:username/:token/:refreshToken"}
                    element={<GetUserTuron/>}
                />


                <Route
                    index
                    path={"lesson/:chapterId/:lessonOrder/:token"}
                    element={<Lesson/>}
                />


                <Route
                    index
                    path={"testTuron"}
                    element={<ViewTestTuron/>}
                />

                <Route
                    index
                    path={"login"}
                    element={<Login/>}
                />
                <Route
                    index
                    path={"content"}
                    element={<TestContent/>}
                />

                <Route
                    index
                    path={"login_block_test"}
                    element={<LoginPisa/>}
                />



                <Route path={"registerPisaTest"} element={<RegisterPisa/>}/>

                <Route path={"register_block_test"} element={<RegisterPisa/>} />


                <Route path="/*" element={<Layout/>}>

                    <Route element={<RequireAuth allowedRules={[ROLES.Parent]}/>}>

                        {
                            isMobile && (
                                <Route path="home" element={<ChildrenLayoutMB/>}>
                                    <Route index element={<ChildrenWeeklyGrades/>}/>
                                    <Route path="monthly-grades" element={<ChildrenMonthlyGrades/>}/>
                                    <Route path="monthly-attendance" element={<ChildrenMonthlyAttendance/>}/>
                                    <Route path="monthly-balance" element={<ParentBalanceList/>}/>
                                    <Route path="monthly-result" element={<ChildrenMonthlyTestsResults/>}/>

                                    <Route path="*" element={<Navigate to="home" replace/>}/>
                                </Route>
                            )
                        }
                        {
                            !isMobile && (
                                <>

                                    <Route path="home/parentBalance" element={<ParentBalanceList/>}/>
                                    <Route path="home/childrenTestsResults" element={<ChildrenMonthlyTestsResults/>}/>
                                    <Route path="home/childrenGrades" element={<ChildrenMonthlyGrades/>}/>
                                    <Route path="home/childrenAttendance" element={<ChildrenMonthlyAttendance/>}/>
                                </>
                            )
                        }

                    </Route>

                        <Route path={"home"} element={<Home/>}/>




                    <Route
                        index
                        path={"user/:id/*"}
                        element={<User/>}
                    />

                    <Route
                        index
                        path={"createTestTuron"}
                        element={<CreateTestTuron/>}
                    />


                    <Route
                        path={"subject/:id/*"}
                        element={<Subject/>}
                    />
                    <Route path={"taskManager/*"} element={<TaskManager/>}/>


                    <Route path={"viewPisaTest/:id"} element={<ViewPisaTest/>}/>
                    <Route path={"myResultsPisaTest/:id"} element={<MyResultPisaTest/>}/>
                    <Route path={"checkMyResultsPisaTest/:id"} element={<CheckResultsPisaTest/>}/>

                    <Route element={<RequireAuth allowedRules={[ROLES.Teacher, ROLES.Student]}/>}>
                        <Route path={"groups/*"} element={<Groups/>}/>
                        <Route path={"books/*"} element={<Books/>}/>
                        {/*<Route path={"chat/*"} element={<Chat/>} />*/}

                    </Route>

                    <Route element={<RequireAuth allowedRules={[ROLES.Teacher]}/>}>
                        <Route path={"teacherObservation/*"} element={<TeacherObservation/>}/>
                    </Route>

                    <Route element={<RequireAuth allowedRules={[ROLES.Methodist]}/>}>
                        <Route path={"exercises"} element={<Exercises/>}/>

                        <Route path={"createExercises/:id"} element={<CreateExercises/>}/>
                        <Route path={"changeExercises/:id"} element={<ChangeExercises/>}/>
                        <Route path={"createExercisesTypes"} element={<CreateExercisesTypes/>}/>
                        <Route path={"pisaTest"} element={<PisaTestList/>}/>
                        <Route path={"createPisaTest/:id"} element={<CreatePisaTest/>}/>
                        <Route path={"registeredStudentsPisa"} element={<RegisteredStudentsPisa/>}/>

                        <Route path={"createExercises"} element={<CreateExercises/>} />
                        <Route path={"changeExercises/:id"} element={<ChangeExercises/>} />
                        <Route path={"createExercisesTypes"} element={<CreateExercisesTypes/>} />
                        <Route path={"pisaTest"} element={<PisaTestList/>} />
                        <Route path={"createPisaTest/:id"} element={<CreatePisaTest/>} />
                        <Route path={"registeredStudentsPisa"} element={<RegisteredStudentsPisa/>} />
                        <Route path={"pisaTestResults.js"} element={<PisaTestResults/>} />



                        <Route path={"presentations/*"} element={<Presentations/>}/>
                        <Route path={"presentation/:id"} element={<Presentation/>}/>
                    </Route>

                    <Route
                        path="*"
                        element={<Navigate to="/home" replace/>}
                    />




                </Route>






            </>
        )
    );

    return (
        <Suspense fallback={<Loader/>}>
            <RouterProvider router={router}/>
        </Suspense>
    );
};


export default App;