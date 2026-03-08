// import React, { useContext, useEffect, useState } from 'react'
// import "./ChatBox.css"
// import assets from '../../assets/assets'
// import { upload } from '../../lib/upload'
// import { db } from '../../config/firebase'
// import { arrayUnion, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore'
// import { AppContext } from '../../context/AppContext'
// import { toast } from 'react-toastify'

// const ChatBox = () => {
//   const { userData, messagesId, chatUser, messages, setMessages, setChatVisible, chatVisible } = useContext(AppContext);
//   const [input, setInput] = useState("");
//   const [sending, setSending] = useState(false);

// const [isOnline, setIsOnline] = useState(false);

// // Check online status
// // useEffect(() => {
// //   if (chatUser?.userData?.lastSeen) {
// //     setIsOnline(Date.now() - chatUser.userData.lastSeen <= 7000);
// //   } else {
// //     setIsOnline(false);
// //   }
// // }, [chatUser]);

// // Check online status with logs

//  useEffect(() => {
//     const checkStatus = () => {
//       if (chatUser?.userData?.lastSeen) {
//         // Convert Firestore timestamp or Date to milliseconds
//         const lastSeenTime = chatUser.userData.lastSeen?.toMillis 
//           ? chatUser.userData.lastSeen.toMillis() 
//           : chatUser.userData.lastSeen;

//         const timeDiff = Date.now() - lastSeenTime;
//         setIsOnline(timeDiff <= 10000); // 10 seconds threshold
//       } else {
//         setIsOnline(false);
//       }
//     };

//     checkStatus();
//     const interval = setInterval(checkStatus, 5000);
//     return () => clearInterval(interval);
//   }, [chatUser]);



//   // Listen for messages
//   useEffect(() => {
//     if (!messagesId) return
    
//     const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
//       if (res.exists()) {
//         const data = res.data()
//         setMessages(data.messages?.reverse() || [])
//       }
//     }, (error) => {
//       console.error("Message snapshot error:", error)
//       toast.error("Failed to load messages")
//     })
    
//     return () => unSub()
//   }, [messagesId])

//   // Send text message
//   const sendMessage = async () => {
//     if (!input.trim() || !messagesId || !userData || !chatUser) return

//     try {
//       await updateDoc(doc(db, 'messages', messagesId), {
//         messages: arrayUnion({
//           sId: userData.id,
//           text: input,
//           createdAt: new Date()
//         })
//       })

//       const userIDs = [chatUser.rId, userData.id]
      
//       for (const id of userIDs) {
//         const userChatRef = doc(db, 'chats', id)
//         const userChatSnapshot = await getDoc(userChatRef)

//         if (userChatSnapshot.exists()) {
//           const userChatData = userChatSnapshot.data()
          
//           const chatIndex = userChatData.chatsData?.findIndex((c) => c.messageId === messagesId)
          
//           if (chatIndex !== -1 && userChatData.chatsData[chatIndex]) {
//             userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30)
//             userChatData.chatsData[chatIndex].updatedAt = Date.now()
            
//             if (userChatData.chatsData[chatIndex].rId !== userData.id) {
//               userChatData.chatsData[chatIndex].messageSeen = false
//             }
            
//             await updateDoc(userChatRef, {
//               chatsData: userChatData.chatsData
//             })
//           }
//         }
//       }
      
//       setInput("")
      
//     } catch (error) {
//       console.error("Send message error:", error)
//       toast.error(error.message)
//     }
//   }

//   // Send image message
//   const sendImage = async (e) => {
//     const file = e.target.files[0]
//     if (!file || !messagesId) return

//     try {
//       const result = await upload(file)

//       if (result && result.url && messagesId) {
//         await updateDoc(doc(db, 'messages', messagesId), {
//           messages: arrayUnion({
//             sId: userData.id,
//             image: result.url,
//             createdAt: new Date()
//           })
//         })

//         const userIDs = [chatUser.rId, userData.id]
        
//         for (const id of userIDs) {
//           const userChatRef = doc(db, 'chats', id)
//           const userChatSnapshot = await getDoc(userChatRef)

//           if (userChatSnapshot.exists()) {
//             const userChatData = userChatSnapshot.data()
//             const chatIndex = userChatData.chatsData?.findIndex((c) => c.messageId === messagesId)
            
//             if (chatIndex !== -1 && userChatData.chatsData[chatIndex]) {
//               userChatData.chatsData[chatIndex].lastMessage = "📷 Image"
//               userChatData.chatsData[chatIndex].updatedAt = Date.now()
              
//               if (userChatData.chatsData[chatIndex].rId !== userData.id) {
//                 userChatData.chatsData[chatIndex].messageSeen = false
//               }
              
//               await updateDoc(userChatRef, {
//                 chatsData: userChatData.chatsData
//               })
//             }
//           }
//         }
        
//         e.target.value = null
//       }
//     } catch (error) {
//       console.error("Image upload error:", error)
//       toast.error("Failed to send image")
//     }
//   }

//   const convertTimestamp = (timestamp) => {
//     if (!timestamp) return ""
    
//     try {
//       const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
//       const hour = date.getHours()
//       const minute = date.getMinutes().toString().padStart(2, '0')
//       const ampm = hour >= 12 ? 'PM' : 'AM'
//       const displayHour = hour % 12 || 12
//       return `${displayHour}:${minute} ${ampm}`
//     } catch (error) {
//       console.error("Timestamp conversion error:", error)
//       return ""
//     }
//   }

//   return chatUser ? (
//     <div className={`chat-box ${chatVisible ? "" : "hidden"}`}>
//       <div className="chat-user">
//         <div className='lss'> 
//           <img 
//             src={chatUser.userData?.avatar || assets.avatar_icon} 
//             alt="user" 
//             onError={(e) => e.target.src = assets.avatar_icon}
//           />
//           <p>{chatUser.userData?.name}</p>
//           {isOnline && (
//             <img src={assets.greendot} className='dot' alt="online" />
//           )}
          
//           <img src={assets.help} className='help' alt="help" />
//         </div>
//         <div>  
//           <img 
//             onClick={() => setChatVisible(false)} 
//             src={assets.close || ''} 
//             alt="close" 
//           />
//         </div>
//       </div>

//       <div className="chat-msg">
//         {messages?.map((msg, index) => (
//           <div key={index} className={msg.sId === userData?.id ? "s-msg" : "r-msg"}>
//             {msg.image ? (
//               typeof msg.image === 'string' && (
//                 msg.image.includes('.mp4') || 
//                 msg.image.includes('.mov') || 
//                 msg.image.includes('.webm') ||
//                 msg.image.includes('video') ? (
//                   <div className="video-container">
//                     <video 
//                       className='msg-video' 
//                       controls
//                     >
//                       <source src={msg.image} type="video/mp4" />
//                     </video>
//                   </div>
//                 ) : (
//                   <img 
//                     className='msg-img' 
//                     src={msg.image} 
//                     alt="image"
//                     onError={(e) => e.target.src = assets.avatar_icon}
//                   />
//                 )
//               )
//             ) : (
//               <p className='msg'>{msg.text}</p>
//             )}
//             <div>
//               <img 
//                 src={msg.sId === userData?.id ? userData?.avatar : chatUser.userData?.avatar || assets.avatar_icon} 
//                 alt="" 
//                 onError={(e) => e.target.src = assets.avatar_icon}
//               />
//               <p>{convertTimestamp(msg.createdAt)}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="chat-input">
//         <input
//           type="text"
//           placeholder='Send a message'
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//           disabled={sending}
//         />

//         <input
//           type="file"
//           id='image'
//           accept='image/*,video/*'
//           hidden
//           onChange={sendImage}
//         />

//         <label htmlFor="image">
//           <img src={assets.attach_icon || assets.attach} alt="attach" />
//         </label>

//         <button onClick={sendMessage} disabled={sending || !input.trim()} className='send-btn'>
//           {sending ? '...' : <img src={assets.send_icon || assets.send} alt="send" />}
//         </button>
//       </div>
//     </div>
//   ) : (
//     <div className={`chat-welcome ${chatVisible ? "" : "hidden"}`}>
//       <img src={assets.logo} alt="" />
//       <p>Chat anytime, anywhere</p>
//     </div>
//   )
// }

// export default ChatBox

import React, { useContext, useEffect, useState } from 'react'
import "./ChatBox.css"
import assets from '../../assets/assets'
import { upload } from '../../lib/upload'
import { db } from '../../config/firebase'
import { arrayUnion, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'

const ChatBox = () => {
  const { userData, messagesId, chatUser, messages, setMessages, setChatVisible, chatVisible } = useContext(AppContext);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  // Online status check with timer
  useEffect(() => {
    const checkStatus = () => {
      if (chatUser?.userData?.lastSeen) {
        const lastSeenTime = chatUser.userData.lastSeen?.toMillis 
          ? chatUser.userData.lastSeen.toMillis() 
          : chatUser.userData.lastSeen;
        const timeDiff = Date.now() - lastSeenTime;
        setIsOnline(timeDiff <= 10000);
      } else {
        setIsOnline(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [chatUser]);

  // Listen for messages
  useEffect(() => {
    if (!messagesId) return
    
    const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
      if (res.exists()) {
        const data = res.data()
        setMessages(data.messages?.reverse() || [])
      }
    }, (error) => {
      console.error("Message snapshot error:", error)
      toast.error("Failed to load messages")
    })
    
    return () => unSub()
  }, [messagesId])

  // Send text message
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
          
          if (chatIndex !== -1 && userChatData.chatsData[chatIndex]) {
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30)
            userChatData.chatsData[chatIndex].updatedAt = Date.now()
            
            if (userChatData.chatsData[chatIndex].rId !== userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false
            }
            
            await updateDoc(userChatRef, {
              chatsData: userChatData.chatsData
            })
          }
        }
      }
      
      setInput("")
      
    } catch (error) {
      console.error("Send message error:", error)
      toast.error(error.message)
    }
  }

  // Send image message
  const sendImage = async (e) => {
    const file = e.target.files[0]
    if (!file || !messagesId) return

    try {
      const result = await upload(file)

      if (result && result.url && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            image: result.url,
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
            
            if (chatIndex !== -1 && userChatData.chatsData[chatIndex]) {
              userChatData.chatsData[chatIndex].lastMessage = "📷 Image"
              userChatData.chatsData[chatIndex].updatedAt = Date.now()
              
              if (userChatData.chatsData[chatIndex].rId !== userData.id) {
                userChatData.chatsData[chatIndex].messageSeen = false
              }
              
              await updateDoc(userChatRef, {
                chatsData: userChatData.chatsData
              })
            }
          }
        }
        
        e.target.value = null
      }
    } catch (error) {
      console.error("Image upload error:", error)
      toast.error("Failed to send image")
    }
  }

  const convertTimestamp = (timestamp) => {
    if (!timestamp) return ""
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      const hour = date.getHours()
      const minute = date.getMinutes().toString().padStart(2, '0')
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      return `${displayHour}:${minute} ${ampm}`
    } catch (error) {
      console.error("Timestamp conversion error:", error)
      return ""
    }
  }

  // Early return if no chat selected
  if (!chatUser) {
    return (
      <div className={`chat-welcome ${chatVisible ? "" : "hidden"}`}>
        <img src={assets.logo} alt="" />
        <p>Chat anytime, anywhere</p>
      </div>
    );
  }

  return (
    <div className={`chat-box ${chatVisible ? "" : "hidden"}`}>
      <div className="chat-user">
      
      <div className='lss'> 
  <div className="avatar-wrapper">
    <img 
      className="main-avatar"
      src={chatUser.userData?.avatar || assets.avatar_icon} 
      alt="user" 
      onError={(e) => e.target.src = assets.avatar_icon}
    />
  </div>
  <p>{chatUser.userData?.name}</p>
     {isOnline && (
      <img src={assets.greendot} className='dot' alt="online" />
    )}

  <img src={assets.help} className='help' alt="help" />
</div>

        <div>  
          <img 
            onClick={() => setChatVisible(false)} 
            src={assets.close || ''} 
            alt="close" 
          />
        </div>
      </div>

      <div className="chat-msg">
        {messages?.map((msg, index) => (
          <div key={index} className={msg.sId === userData?.id ? "s-msg" : "r-msg"}>
            {msg.image ? (
              typeof msg.image === 'string' && (
                msg.image.includes('.mp4') || 
                msg.image.includes('.mov') || 
                msg.image.includes('.webm') ||
                msg.image.includes('video') ? (
                  <div className="video-container">
                    <video 
                      className='msg-video' 
                      controls
                    >
                      <source src={msg.image} type="video/mp4" />
                    </video>
                  </div>
                ) : (
                  <img 
                    className='msg-img' 
                    src={msg.image} 
                    alt="image"
                    onError={(e) => e.target.src = assets.avatar_icon}
                  />
                )
              )
            ) : (
              <p className='msg'>{msg.text}</p>
            )}
            <div>
              <img 
                src={msg.sId === userData?.id ? userData?.avatar : chatUser.userData?.avatar || assets.avatar_icon} 
                alt="" 
                onError={(e) => e.target.src = assets.avatar_icon}
              />
              <p>{convertTimestamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder='Send a message'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          disabled={sending}
        />

        <input
          type="file"
          id='image'
          accept='image/*,video/*'
          hidden
          onChange={sendImage}
        />

        <label htmlFor="image">
          <img src={assets.attach_icon || assets.attach} alt="attach" />
        </label>

        <button onClick={sendMessage} disabled={sending || !input.trim()} className='send-btn'>
          {sending ? '...' : <img src={assets.send_icon || assets.send} alt="send" />}
        </button>
      </div>
    </div>
  )
}

export default ChatBox
 