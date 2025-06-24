import {createContext} from "react";

const SubjectContext = createContext(null);
const MainContext = createContext(null);
const ExcContext = createContext(false);
const PisaExcContext = createContext(false);

const PresentationSidebarContext = createContext({})




export {SubjectContext,MainContext,ExcContext,PresentationSidebarContext,PisaExcContext}