import React, { useContext, useEffect, useState } from 'react'
import "./RightSideBar.css"
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const RightSideBar = ({ setShowInfo }) => {
  const navigate = useNavigate();
  const { userData, chatUser, messages } = useContext(AppContext);
  const [msgImages, setMsgImages] = useState([]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    let tempVar = [];
    messages?.forEach((msg) => {
      if (msg.image) {
        tempVar.push(msg.image);
      }
    });
    setMsgImages(tempVar);
  }, [messages]);

  return (
    <div className='rs'>
      {/* HEADER WITH BACK ARROW FOR MOBILE */}
      <div className="rs-header">
        <img 
          src={assets.arrow || assets.close} 
          className="back-arrow" 
          onClick={() => setShowInfo(false)} 
          alt="back" 
        />
        <p>User Info</p>
      </div>

      {/* DISPLAY SELECTED CHAT USER INFO (If a chat is open) */}
      {chatUser ? (
        <div className="rs-profile">
          <img src={chatUser.userData?.avatar || assets.avatar_icon} alt="profile" />
          <h3>
            {chatUser.userData?.name}
            {Date.now() - chatUser.userData?.lastSeen <= 60000 && <span className="dot"></span>}
          </h3>
          <p>{chatUser.userData?.bio || "No bio yet"}</p>
        </div>
      ) : (
        /* FALLBACK: SHOW MY OWN PROFILE IF NO CHAT SELECTED */
        <div className="rs-profile">
          <img src={userData?.avatar || assets.avatar_icon} alt="profile" />
          <h3>{userData?.name}</h3>
          <p>{userData?.bio}</p>
        </div>
      )}

      <hr />

      <div className='rs-media'>
        <p>Media</p>
        <div>
          {msgImages.length > 0 ? (
            msgImages.map((url, index) => (
              <img 
                onClick={() => window.open(url)} 
                key={index} 
                src={url} 
                alt="media" 
              />
            ))
          ) : (
            <span className="no-media">No media shared</span>
          )}
        </div>
      </div>

      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default RightSideBar;