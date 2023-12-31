import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    majorsList: [],
    majorStudents: [],
    majorDetails: [],
    projectsList: [],
    projectDetails: [],
    projectTotals: [],
    loading: false,
    subloading: false,
    error: null,
    response: null,
    getresponse: null,
};

const majorSlice = createSlice({
    name: 'major',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getProjectDetailsRequest: (state) => {
            state.subloading = true;
        },
        getSuccess: (state, action) => {
            state.majorsList = action.payload;
            state.loading = false;
            state.error = null;
            state.getresponse = null;
        },
        getStudentsSuccess: (state, action) => {
            state.majorStudents = action.payload;
            state.loading = false;
            state.error = null;
            state.getresponse = null;
        },
        getStudentsSuccessByTeacher: (state, action) => {
            state.majorStudentsByTeacher = action.payload;
            state.loading = false;
            state.error = null;
            state.getresponse = null;
        },
        getProjectsSuccess: (state, action) => {
            state.projectsList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getProjectsSuccessTeacher: (state, action) => {
            state.projectsListFreeTeacher = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getProjectsByTeacherSuccess: (state, action) => {
            state.projectsListByTeacher = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getProjectsByStudentSuccess: (state, action) => {
            state.projectsListByStudent = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getProjectDetailsByTeacherSuccess: (state, action) => {
            state.projectDetailsByTeacher = action.payload;
            state.subloading = false;
            state.error = null;
        },
        getFailed: (state, action) => {
            state.projectsList = [];
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getFailedTwo: (state, action) => {
            state.majorsList = [];
            state.majorStudents = [];
            state.getresponse = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        detailsSuccess: (state, action) => {
            state.majorDetails = action.payload;
            state.loading = false;
            state.error = null;
        },
        detailsSuccessAddTeacher: (state, action) => {
            state.majorDetailsAddTeacher = action.payload;
            state.loading = false;
            state.error = null;
        },
        getProjectDetailsSuccess: (state, action) => {
            state.projectDetails = action.payload;
            state.subloading = false;
            state.error = null;
        },
        getTotalProjectsSuccess: (state, action) => {
            state.projectTotals = action.payload;
            state.subloading = false;
            state.error = null;
        },
        resetProjects: (state) => {
            state.projectsList = [];
            state.majorsList = [];
        },
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    getStudentsSuccess,
    getProjectsSuccessTeacher,
    getStudentsSuccessByTeacher,
    getProjectsSuccess,
    getProjectsByTeacherSuccess,
    getProjectsByStudentSuccess,
    getProjectDetailsByTeacherSuccess,
    detailsSuccess,
    detailsSuccessAddTeacher,
    getTotalProjectsSuccess,
    getFailedTwo,
    resetProjects,
    getProjectDetailsSuccess,
    getProjectDetailsRequest
} = majorSlice.actions;

export const majorReducer = majorSlice.reducer;