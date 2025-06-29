import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import 'remixicon/fonts/remixicon.css'
import 'animate.css';
import { useState, useEffect } from 'react';
import http from '../util/http';

import Home from './components/Home'
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import UserLayout from './components/User/UserLayout';
import Workspace from './components/User/Workspace';
import Upgrade from './components/User/Upgrade';
import Context from '../util/Context';
import Chat from './components/User/Chat';
import Plan from './Plan';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Unauthorized from './components/Unauthorized';

const App = () => {

  const [sessionLoading, setSessionLoading] = useState(null)
  const [session, setSession] = useState(null)
  console.log(session)

  useEffect(() => {
    getSession()
  }, [])

  const getSession = async () => {
    try {
      setSessionLoading(true)
      const { data } = await http.get("/api/user/session")
      setSession(data)
    }
    catch (err) {
      setSession(null)
    }
    finally {
      setSessionLoading(false)
    }
  }

  return (
    <Context.Provider value={{ session, setSession, sessionLoading, setSessionLoading }}>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/unauthorized' element={<Unauthorized/>}/>

          {/* user */}
          <Route
            path="/user/layout"
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="workspace" element={<Workspace />} />
            <Route path="upgrade" element={<Upgrade />} />
            <Route path="chat/:id" element={<Chat />} />
          </Route>

          {/* admin */}
          <Route
            path="/admin/plan/create"
            element={
              <AdminRoute>
                <Plan />
              </AdminRoute>
            }
          />



        </Routes>
      </BrowserRouter>
    </Context.Provider>
  )

}

export default App