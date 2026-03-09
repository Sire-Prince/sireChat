import React, { useContext, useEffect, useState } from 'react'
import "./ChatBox.css"
import assets from '../../assets/assets'
import { upload } from '../../lib/upload'
import { db } from '../../config/firebase'
import { arrayUnion, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'

const ChatBox = ({ setShowInfo }) => {
  const { userData, messagesId, chatUser, messages, setMessages, setChatVisible, chatVisible } = useContext(AppContext);
  const [input, setInput] = useState("");
  const [isOnline, setIsOnline] = useState(false);

  // Online status check
  useEffect(() => {
    const checkStatus = () => {
      if (chatUser?.userData?.lastSeen) {
        const lastSeenTime = chatUser.userData.lastSeen?.toMillis 
          ? chatUser.userData.lastSeen.toMillis() 
          : chatUser.userData.lastSeen;

        const timeDiff = Date.now() - lastSeenTime;
        setIsOnline(timeDiff <= 60000);
      } else {
        setIsOnline(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [chatUser]);

  // Real-time message listener
  useEffect(() => {
    if (!messagesId) return
    const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
      if (res.exists()) {
        const data = res.data()
        setMessages(data.messages?.reverse() || [])
      }
    }, (error) => {
      toast.error("Failed to load messages")
    })
    return () => unSub()
  }, [messagesId])

  // Send Text Message
  const sendMessage = async () => {
    if (!input.trim() || !messagesId || !userData || !chatUser) return
    try {
      await updateDoc(doc(db, 'messages', messagesId), {
        messages: arrayUnion({
          sId: userData.id,
          text: input,
          createdAt: new Date()
        })
      })

      const userIDs = [chatUser.rId, userData.id]
      for (const id of userIDs) {
        const userChatRef = doc(db, 'chats', id)
        const userChatSnapshot = await getDoc(userChatRef)
        if (userChatSnapshot.exists()) {
          const userChatData = userChatSnapshot.data()
          const chatIndex = userChatData.chatsData?.findIndex((c) => c.messageId === messagesId)
          if (chatIndex !== -1) {
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30)
            userChatData.chatsData[chatIndex].updatedAt = Date.now()
            if (userChatData.chatsData[chatIndex].rId !== userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false
            }
            await updateDoc(userChatRef, { chatsData: userChatData.chatsData })
          }
        }
      }
      setInput("")
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Send Image or Video
  const sendImage = async (e) => {
    const file = e.target.files[0]
    if (!file || !messagesId) return
    try {
      const result = await upload(file)
      if (result && result.url) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            image: result.url,
            createdAt: new Date()
          })
        })
      }
    } catch (error) {
      toast.error("Upload failed")
    }
  }

  const convertTimestamp = (timestamp) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return chatUser ? (
    <div className={`chat-box ${chatVisible ? "" : "hidden"}`}>
      <div className="chat-user">
        <div className='lss'> 
          <img 
            className="main-avatar"
            src={chatUser.userData?.avatar || assets.avatar} 
            alt="user" 
            onClick={() => setShowInfo(prev => !prev)}
            onError={(e) => e.target.src = assets.avatar}
          />
          <p>
            {chatUser.userData?.name}
            {isOnline && <img src={assets.greendot} className='dot' alt="online" />}
          </p>
        </div>
        
        <div className="chat-controls">
          <img 
            onClick={() => setShowInfo(prev => !prev)} 
            src={assets.help} 
            className='help' 
            alt="help" 
          />
          <img 
            onClick={() => setChatVisible(false)} 
            src={assets.close} 
            className='arrow' 
            alt="close" 
          />
        </div>
      </div>

      <div className="chat-msg">
        {messages?.map((msg, index) => {
          const isVideo = typeof msg.image === 'string' && (
            msg.image.toLowerCase().includes('.mp4') || 
            msg.image.toLowerCase().includes('.mov') || 
            msg.image.toLowerCase().includes('.webm')
          );

          return (
            <div key={index} className={msg.sId === userData?.id ? "s-msg" : "r-msg"}>
              {msg.image ? (
                isVideo ? (
                  <div className="video-container">
                    <video className='msg-video' controls>
                      <source src={msg.image} type="video/mp4" />
                    </video>
                  </div>
                ) : (
                  <img className='msg-img' src={msg.image} alt="" onClick={() => window.open(msg.image)} />
                )
              ) : (
                <p className='msg'>{msg.text}</p>
              )}
              <div>
                <img src={msg.sId === userData?.id ? userData?.avatar : chatUser.userData?.avatar || assets.avatar} alt="" />
                <p>{convertTimestamp(msg.createdAt)}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="chat-input">
        <input 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          value={input} 
          type="text" 
          placeholder='Send a message' 
        />
        <input onChange={sendImage} type="file" id='image' accept='image/*,video/*' hidden />
        <label htmlFor="image">
          <img src={assets.attach} alt="attach" />
        </label>
        <img onClick={sendMessage} src={assets.send} alt="send" />
      </div>
    </div>
  ) : (
    <div className='chat-welcome'>
      <img src={assets.logo} alt="logo" />
      <p>Chat Anytime, Anywhere</p>
    </div>
  )
}

export default ChatBox