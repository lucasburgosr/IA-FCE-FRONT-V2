import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Chat from '@/pages/Chat'
import { Login } from '@/pages/Login'
import { SignUpPage } from '@/pages/SignUp'

const AppRouter: React.FC = () => {

    return (
        <Router>
            <Routes>
                <Route path='/chat' element={<Chat></Chat>}></Route>
                <Route path='/login' element={<Login></Login>}></Route>
                <Route path='/registro' element={<SignUpPage />}></Route>
            </Routes>
        </Router>
    )
}

export default AppRouter