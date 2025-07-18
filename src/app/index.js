import React, {lazy, Suspense, useEffect} from 'react';
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
import { ROLES } from "constants/global";
import Books from "pages/books/Books";
import TeacherObservation from "pages/teacherObservation/teacherObservation";
import Lesson from "pages/subject/level/chapters/lesson";
import Chat from "pages/chat";
// import Lesson from m ../pages/subject/level/chapters/lesson";
import Presentations from "pages/presentations/Presentations";
import Presentation from "pages/presentation/Presentation";
import CreateTestTuron from "pages/testTuron/create/createTestTuron";
import ViewTestTuron from "pages/testTuron/view/viewTestTuron";
import GetUserTuron from "pages/getUserTuron/GetUserTuron";
import Login from "pages/login/Login";
import Alert from "components/ui/alert";
import PisaTestList from "pages/pisaTest/PisaTestList";
import CreatePisaTest from "pages/pisaTest/create/CreatePisaTest";
import RegisterPisa from "pages/registerPisa/registerPisa";
import LoginPisa from "pages/loginPisa/LoginPisa";
import ViewPisaTest from "pages/pisaTest/view/ViewPisaTest";
import MyResultPisaTest from "pages/pisaTest/myResult/MyResultPisaTest";
import CheckResultsPisaTest from "pages/pisaTest/checkExc/CheckResultsPisaTest";
import RegisteredStudentsPisa from "pages/pisaTest/registeredStudents/RegisteredStudentsPisa";
import {PisaTestResults} from "pages/pisaTestResults";


const Layout = lazy(() => import("components/layout"))
const Home = lazy(() => import("pages/home"))
const User = lazy(() => import("pages/user"))
const Subject = lazy(() => import("pages/subject"))
const CreateExercises   = lazy(() => import("pages/exercises/createExercises"))
const CreateExercisesTypes = lazy(() => import("pages/exercises/createType"))
const Exercises = lazy(() => import("pages/exercises"))
const Groups = lazy(() => import("pages/groups"))
const TaskManager = lazy(() => import("pages/taskManager/TaskManager"))


const App = () => {

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
                    path={"login_block_test"}
                    element={<LoginPisa/>}
                />

                <Route path={"register_block_test"} element={<RegisterPisa/>} />

                <Route path="/*" element={<Layout/>}>
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
                        index
                        path={"home"}
                        element={<Home/>}
                    />

                    <Route
                        path={"subject/:id/*"}
                        element={<Subject/>}
                    />
                    <Route path={"taskManager/*"} element={<TaskManager/>} />


                    <Route path={"viewPisaTest/:id"} element={<ViewPisaTest/>} />
                    <Route path={"myResultsPisaTest/:id"} element={<MyResultPisaTest/>} />
                    <Route path={"checkMyResultsPisaTest/:id"} element={<CheckResultsPisaTest/>} />

                    <Route element={<RequireAuth allowedRules={[ROLES.Teacher,ROLES.Student]} />}>
                        <Route path={"groups/*"} element={<Groups/>} />
                        <Route path={"books/*"} element={<Books/>} />
                        {/*<Route path={"chat/*"} element={<Chat/>} />*/}

                    </Route>

                    <Route element={<RequireAuth allowedRules={[ROLES.Teacher]} />}>
                        <Route path={"teacherObservation/*"} element={<TeacherObservation/>} />
                    </Route>

                    <Route element={<RequireAuth allowedRules={[ROLES.Methodist]} />}>
                        <Route path={"exercises"} element={<Exercises/>}/>
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
        <Suspense fallback={<Loader />}>
            <RouterProvider router={router}/>
        </Suspense>
    );
};






export default App;