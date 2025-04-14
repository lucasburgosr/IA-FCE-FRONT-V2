import React from 'react'
import { Navigate, BrowserRouter as Router, Routes, Route } from "react-router-dom"
import ProtectedRoute from './ProtectedRoute'
import Chat from '@/pages/Chat'
import { Login } from '@/pages/Login'
import { SignUpPage } from '@/pages/SignUp'
import Layout from './Layout'

const AppRouter: React.FC = () => {

    return (
        <Router>
            <Routes>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/registro' element={<SignUpPage />}></Route>
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path='/chat' element={<Chat />}></Route>
                    </Route>
                </Route>
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    )
}

export default AppRouter