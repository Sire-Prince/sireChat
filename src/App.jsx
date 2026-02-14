
import React, { useEffect,useContext } from 'react'
import { Routes, Route, useNavigate, } from 'react-router-dom'
import Login from './pages/login/Login.jsx'
import Chat from './pages/chat/Chat.jsx'
import ProfileUpdate from './pages/profileUpdate/ProfileUpdate.jsx'
import { onAuthStateChanged } from 'firebase/auth'
import {auth} from "./config/firebase.js"
import { AppContext } from './context/AppContext.jsx'

const App = () => {
  const navigate = useNavigate();
  const {loadUserData} = useContext(AppContext)

 useEffect(() =>{
  onAuthStateChanged(auth, async (user)=>{
    if(user){
      navigate("/chat");
      await loadUserData(user.uid)
    }
    else{
  navigate("./")
    }
  })
  },[])
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<ProfileUpdate />} />
      </Routes>
    </>
  )
}

export default App
