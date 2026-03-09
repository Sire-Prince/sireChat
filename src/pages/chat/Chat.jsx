import React, { useEffect, useState, useContext } from 'react';
import './Chat.css'
import LeftSideBar from '../../components/LeftSideBar/LeftSideBar'
import RightSideBar from '../../components/RightSideBar/RightSideBar'
import ChatBox from '../../components/ChatBox/ChatBox'
import { AppContext } from '../../context/AppContext'

const Chat = () => {
  const { chatData, userData, initialLoadDone, chatVisible } = useContext(AppContext); 
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false); // Controls RightSideBar visibility

  useEffect(() => {
    if (initialLoadDone && userData) {
      if (chatData !== null) {
        setLoading(false);
      }
    } else if (initialLoadDone && !userData) {
      setLoading(false);
    }
  }, [userData, chatData, initialLoadDone]);

  if (!initialLoadDone) {
    return <div className='loading'>Checking authentication...</div>;
  }

  return (
    <div className='chat'>
      {loading ? (
        <div className='loading'>Loading chats...</div>
      ) : (
        <div className="chat-container">
          
          <div className={chatVisible || showInfo ? "hide-mobile" : ""}>
            <LeftSideBar />
          </div>
          
          <div className={chatVisible && !showInfo ? "" : "hide-mobile"}>
            <ChatBox setShowInfo={setShowInfo} />
          </div>

          <div className={showInfo ? "" : "hide-tablet"}>
             <RightSideBar setShowInfo={setShowInfo} />
          </div>

        </div>
      )}
    </div>
  )
}

export default Chat