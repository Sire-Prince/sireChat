
import  { React, useEffect, useContext, useState } from 'react'
import { Routes, Route, useNavigate, } from 'react-router-dom'
import './App.css'
import Login from './pages/login/Login.jsx'
import Chat from './pages/chat/Chat.jsx'
import ProfileUpdate from './pages/profileUpdate/ProfileUpdate.jsx'
import { onAuthStateChanged } from 'firebase/auth'
import {auth} from "./config/firebase.js"
import { AppContextProvider } from './context/AppContextProvider.jsx'

const App = () => {
  const navigate = useNavigate();
  const {loadUserData} = useContext(AppContextProvider)
  const [loading, setLoading] = useState(true);

 useEffect(() =>{
  const unsubscribe = onAuthStateChanged(auth, async (user)=>{
    try {
      if(user){
        await loadUserData(user.uid)
        navigate("/chat");
      }
      else{
        navigate("/")
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  })
  return () => unsubscribe();
  },[navigate, loadUserData])

  if (loading) return <div className='loading'>Loading...</div>;

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
