import React, { useState } from 'react'
import "./ChatBox.css"
import assets from '../../assets/assets'
import { upload } from '../../lib/upload'
import { auth, db } from '../../config/firebase'
import { addDoc, collection } from 'firebase/firestore'

const ChatBox = () => {
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

  return (
    <div className='chat-box'>
      <div className="chat-user">
        <img src={assets.profile_3} alt="" />
        <p>Richard Sanford <img src={assets.green_dot} className='dot' alt="" /></p>
        <img src={assets.profile_4} alt="" />
      </div>

      <div className="chat-msg">
        {/* Messages rendering should be implemented elsewhere */}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder='Send a message'
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={sending}
        />

        <input
          type="file"
          id='image'
          accept='image/*,video/*'
          hidden
          onChange={(e) => setFile(e.target.files[0])}
        />

        <label htmlFor="image">
          <img src={assets.gallary_icon} alt="" />
        </label>

        <button onClick={handleSend} disabled={sending} className='send-btn'>
          {sending ? 'Sending...' : <img src={assets.send_button} alt="" />}
        </button>
      </div>
    </div>
  )
}

export default ChatBox
