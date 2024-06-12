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



const Layout = lazy(() => import("components/layout"))
const Home = lazy(() => import("pages/home"))
const User = lazy(() => import("pages/user"))
const Subject = lazy(() => import("pages/subject"))
const CreateExercises = lazy(() => import("pages/exercises/createExercises"))
const CreateExercisesTypes = lazy(() => import("pages/exercises/createType"))
const Exercises = lazy(() => import("pages/exercises"))
const Groups = lazy(() => import("pages/groups"))


const App = () => {

    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route
                    path={"get_user/:token/:refreshToken"}
                    element={<GetUser/>}
                />
                <Route path="/*" element={<Layout/>}>
                    <Route
                        index
                        path={"user/:id/*"}
                        element={<User/>}
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

                    <Route element={<RequireAuth allowedRules={[ROLES.Teacher,ROLES.Student]} />}>
                        <Route path={"groups/*"} element={<Groups/>} />
                        <Route path={"books/*"} element={<Books/>} />
                    </Route>

                    <Route element={<RequireAuth allowedRules={[ROLES.Teacher]} />}>
                        <Route path={"teacherObservation/*"} element={<TeacherObservation/>} />
                    </Route>

                    <Route element={<RequireAuth allowedRules={[ROLES.Methodist]} />}>
                        <Route path={"exercises"} element={<Exercises/>}/>
                        <Route path={"createExercises"} element={<CreateExercises/>} />
                        <Route path={"changeExercises/:id"} element={<ChangeExercises/>} />
                        <Route path={"createExercisesTypes"} element={<CreateExercisesTypes/>} />
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