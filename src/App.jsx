import { React, useEffect, useContext, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Login from './pages/login/Login.jsx'
import Chat from './pages/chat/Chat.jsx'
import ProfileUpdate from './pages/profileUpDate/ProfileUpDate.jsx'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from "./config/firebase.js"
import { AppContext } from './context/AppContext.jsx'

const App = () => {
  const navigate = useNavigate();
  const { loadUserData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          await loadUserData(user.uid);
          
          if (window.location.pathname === "/") {
            navigate("/chat");
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []); 

  if (loading) return <div className='loading'>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/profile" element={<ProfileUpdate />} />
    </Routes>
  );
};

export default App;