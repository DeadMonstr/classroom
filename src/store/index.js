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
        books
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
            stringMiddleware
        ),
    devTools: process.env.NODE_ENV !== "production",
})

export default store