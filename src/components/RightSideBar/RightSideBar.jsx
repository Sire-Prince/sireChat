// import React, { useContext } from 'react'
// import "./RightSideBar.css"
// import assets from '../../assets/assets'
// import { logout } from '../../config/firebase'
// import { useNavigate } from 'react-router-dom'
// import { AppContext} from '../../context/AppContext'
// import { useEffect } from 'react'
// import { useState } from 'react'

// const RightSideBar = () => {
//   const navigate = useNavigate();
//   const { chatUser,messages } = useContext(AppContext);
// const [msgImages, setMsgImages] = useState([]);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate("/");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   useEffect(()=>{
//    let tempVar = [];
//    messages.map((msg)=>{
//     if (msg.image) {
//       tempVar.push(msg.image)
//     }
//    })
//   setMsgImages(tempVar)
//   },[messages])

//   return chatUser ? (

//     <div className='rs'>
//       <div className="rs-profile">
//         <img src={chatUser.userData?.avatar || assets.pro1} alt="profile" />

//         <h3> {Date.now() - chatUser.userData.lastSeen <= 7000 ? <img src={assets.green_dot} className='dot' alt="" /> : null}
// {chatUser.userData?.name || "User"} </h3>
//         <p>{chatUser.userData?.bio || "Try unitl it fa!"}</p>
//       </div>
//       <hr />
//       <div className='rs-media'>
//         <p>Media</p>
//         <div>
//          {msgImages.map((url,index)=>(<img onClick={(()=>{window.open(url)
//          })} key={index} src={url} alt="" />))}
//         </div>
//       </div>
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   )
//   : (
//     <div className='rs'>
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   )
// }

// export default RightSideBar
import React, { useContext } from 'react'
import "./RightSideBar.css"
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'
import { useNavigate } from 'react-router-dom'
import { AppContext} from '../../context/AppContext'
import { useEffect } from 'react'
import { useState } from 'react'

const RightSideBar = () => {
  const navigate = useNavigate();
  const { userData, chatUser, messages } = useContext(AppContext);
  const [msgImages, setMsgImages] = useState([]);
const [online, setOnline] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  // Check if online
useEffect(() => {
  if (chatUser?.userData?.lastSeen) {
    setOnline(Date.now() - chatUser.userData.lastSeen < 10000);
  }
}, [chatUser]);

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
      {/* MY PROFILE - Always visible */}
      <div className="rs-profile">
        <img src={userData?.avatar || assets.pro1} alt="profile" />
        <h3>{userData?.name || "User"}</h3>
        <p>{userData?.bio || "No bio yet"}</p>
      </div>
      <hr />
      {chatUser && (
        <>
          {/* MEDIA */}
          <div className='rs-media'>
            <p>Media</p>
            <div>
              {msgImages.map((url, index) => (
                <img 
                  onClick={() => window.open(url)} 
                  key={index} 
                  src={url} 
                  alt="" 
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* LOGOUT BUTTON */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default RightSideBar;

