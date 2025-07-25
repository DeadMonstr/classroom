import {configureStore} from "@reduxjs/toolkit";

import layout from "slices/layoutSlice";
import subject from "slices/subjectSlice";
import subjects from "slices/subjectsSlice";
import user from "slices/userSlice";
import group from "slices/groupSlice";
import exercises from "slices/exercisesSlice";
import chapters from "slices/chaptersSlice";
import lesson from "slices/lessonSlice";
import finishedLessons from "slices/finishedLessonsSlice";
import books from "slices/booksSlice";
import chat from "slices/chatSlice"
import presentation from "slices/presentationSlice";
import pisaTest from "slices/pisaTest";

import parentSlice from "slices/parentSlice";

import pisaTestResults from "slices/pisaTestResults";


const stringMiddleware = () => (next) => (action) => {
    if (typeof action === 'string') {
        return next({
            type: action
        })
    }
    return next(action)
}


const store = configureStore({
    reducer: {
        layout,
        subject,
        user,
        group,
        exercises,
        subjects,
        chapters,
        lesson,
        finishedLessons,
        books,
        presentation,
        chat,
        pisaTest,

        parentSlice,

        pisaTestResults

    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
            stringMiddleware
        ),

})

export default store