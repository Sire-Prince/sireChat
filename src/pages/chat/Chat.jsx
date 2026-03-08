// import React, { useEffect, useState } from 'react'
// import './Chat.css'
// import LeftSideBar from '../../components/LeftSideBar/LeftSideBar'
// import RightSideBar from '../../components/RightSideBar/RightSideBar'
// import ChatBox from '../../components/ChatBox/ChatBox'
// import { useContext } from 'react'
// import { AppContext } from '../../context/AppContext'



// const Chat = () => {

// const {chatData, userData} = useContext(AppContext); 
// const [loading, setLoading] = useState(true);

// useEffect(() =>{
//    if(chatData && userData) {
//     setLoading(false)
//    }
// },[chatData, userData])



//   return (
//      <div className='chat'>
//    {
//     loading ?
//     <div className='loading'>Loading...</div> :
//     <div className="chat-container">
// <LeftSideBar />
// <ChatBox/>
// <RightSideBar/>
//   </div >
//    }
      
//     </div>
//   )
// }
// export default Chat



import React, { useEffect, useState, useContext } from 'react'
import './Chat.css'
import LeftSideBar from '../../components/LeftSideBar/LeftSideBar'
import RightSideBar from '../../components/RightSideBar/RightSideBar'
import ChatBox from '../../components/ChatBox/ChatBox'
import { AppContext } from '../../context/AppContext'

const Chat = () => {
  const { chatData, userData, initialLoadDone } = useContext(AppContext); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Chat component - userData:", userData);
    console.log("Chat component - chatData:", chatData);
    console.log("Chat component - initialLoadDone:", initialLoadDone);
    
    if (initialLoadDone && userData) {
      if (chatData !== null) {
        console.log("✅ All data loaded!");
        setLoading(false);
      } else {
        console.log("⏳ Waiting for chatData...");
      }
    } else if (initialLoadDone && !userData) {
      console.log("⏳ No user data - should redirect");
      setLoading(false);
    } else {
      console.log("⏳ Waiting for initial load...");
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
          <LeftSideBar />
          <ChatBox/>
          <RightSideBar/>
        </div>
      )}
    </div>
  )
}

export default Chat
