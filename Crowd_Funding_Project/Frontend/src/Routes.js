import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProjectPage from './features/project/ProjectPage';
import ManageProjects from './features/user/ManageProjects';
import EditProject from './features/project/EditProject';
import Search from './features/project/Search';
import Main from './features/project/Main';
import AdminPage from './features/admin/AdminPage';
import FundProject from './components/FundProject';
import ViewCreator from './features/user/ViewCreator';

const RoutesComponent = () => {
    const user = localStorage.getItem('token');
    return (
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/project/:id" element={<ProjectPage isView={false} />} />
            <Route path="/projects/:id/fund" element={<FundProject />} />
            <Route path="/users/:id" element={<ViewCreator />} />
            <Route path="/manage" element={user ? <ManageProjects /> : <Navigate to="/" />} />
            <Route path="/manage/:id" element={user ? <EditProject /> : <Navigate to="/" />} />
            <Route path="/manage/new" element={user ? <EditProject isCreate={true} /> : <Navigate to="/" />} />
            <Route path="/search" element={<Search />} />
            <Route path="admin/project/:id" element={<ProjectPage isView={true} />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default RoutesComponent;