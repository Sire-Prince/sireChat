import React, { useContext, useEffect, useState } from 'react'
import "./ChatBox.css"
import assets from '../../assets/assets'
import { upload } from '../../lib/upload'
import { auth, db } from '../../config/firebase'
import { addDoc, arrayUnion, collection, onSnapshot, updateDoc } from 'firebase/firestore'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify/unstyled'
import { doc, getDoc } from 'firebase/firestore/lite'


const ChatBox = () => {
  const { userData, messagesId, chatUser, messages, setMessages, setMessagesId, chatVisible , setChatVisible } = useContext(AppContext);
  const [input, setInput] = useState("");
  const [text, setText] = useState("")
  const [file, setFile] = useState(null)
  const [sending, setSending] = useState(false)


  const handleSend = async () => {
    if (!auth.currentUser) return alert('You must be signed in to send messages')
    if (!text && !file) return

    setSending(true)
    try {
      let mediaUrl = null
      if (file instanceof File) {
        const result = await upload(file)
        if (result && result.url) mediaUrl = result.url
        else {
          alert('Failed to upload media')
          setSending(false)
          return
        }
      }

      await addDoc(collection(db, 'messages'), {
        senderId: auth.currentUser.uid,
        text: text || null,
        media: mediaUrl,
        createdAt: Date.now()
      })

      setText("")
      setFile(null)
    } catch (err) {
      console.error('Send message error', err)
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
        setMessages(res.data().messages.reverse())
      })
      return () => {
        unSub();
      }
    }
  },[messagesId])


  const sendMessage = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date()
          })
        })
        const userIDs = [chatUser.rId = userData.id];

        userIDs.forEach(async (id) => {
          const userChatRef = doc(db, 'chats', id);
          const userChatSnapshot = await getDoc(userChatRef);

          if (userChatSnapshot.exists()) {
            const userChatData = userChatSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex((c) => c.messagesId === messagesId);
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            } await updateDoc(userChatRef, {
              chatsData: userChatData.chatsData
            })


          }
        })
      }
    } catch (error) {
      toast, error(error.message);
    }
    setInput("");
  }

  const sendImage = async (e) => {
    try {
      const fileUrl = await upload(e.target.files[0]);

      if (fileUrl && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            image: input,
            createdAt: new Date()
          })
        })
        const userIDs = [chatUser.rId = userData.id];

        userIDs.forEach(async (id) => {
          const userChatRef = doc(db, 'chats', id);
          const userChatSnapshot = await getDoc(userChatRef);

          if (userChatSnapshot.exists()) {
            const userChatData = userChatSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex((c) => c.messagesId === messagesId);
            userChatData.chatsData[chatIndex].lastMessage = "Image";
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            } await updateDoc(userChatRef, {
              chatsData: userChatData.chatsData
            })


          }
        })

      }

    }
    catch (error) {
      toast.error(error);
      console.log(error)
    }
  }

  const convertTimestamp = (timestamp) => {
    let date = timestamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    if (hour > 12) {
      return hour - 12 + ":" + minute + "PM"
    }
    else {
      return hour + ":" + minute + "AM"

    }
  }
  return chatUser ? (
    <div className={`chat-box ${chatVisible ? "": "hidden"}`}>
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p>{chatUser.userData.name} {Date.now() - chatUser.userData.lastSeen <= 7000 ? <img src={assets.green_dot} className='dot' alt="" /> : null}</p>
        <img src={assets.help} className='dot' alt="" />
        <img onClick={()=>setChatVisible()} src="" alt="" />
      </div>

      <div className="chat-msg">
        {messages.map((msg, index) => {
          <div key={index} className={msg.sId === userData.id ? "s-msg" : "r-msg"}>
            {msg["image"]
              ? <img className='msg-img' src={msg.image} />
              : <p className='msg'> {msg.text} </p>
            }
            <div>
              <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
              <p>{convertTimestamp(msg.createdAt)}</p>
            </div>
          </div>
        })}

        {/* <div className="s-msg">
        <img className="msg-img" src={assets.hello} alt="" />
         <div>
          <img src={assets.profile_4} alt="" />
          <p>2:30 PM</p>
         </div>
        </div>

        <div className="r-msg">
          <p className='msg'>   Lorem ipsum dolor, sit amet consectetur adipisicing elit. Provident
           ad inventore expedita! Debitis neque facilis voluptatibus quibusdam
         </p>
         <div>
          <img src={assets.profile_4} alt="" />
          <p>2:30 PM</p>
         </div>
        </div> */}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder='Send a message'
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
          <img src={assets.attach} alt="" onClick={sendMessage} />
        </label>

        <button onClick={handleSend} disabled={sending} className='send-btn'>
          {sending ? 'Sending...' : <img src={assets.send} alt="" />}
        </button>
      </div>
    </div>
  ) :
    <div  className={`chat-welcome ${chatVisible ? "": "hidden"}`}>
      <img src={assets.logo} alt="" />
      <p>Chat anytime, anywhere</p>
    </div>
}

export default ChatBox
