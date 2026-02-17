import React, { useContext } from 'react'
import "./RightSideBar.css"
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const RightSideBar = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className='rs'>
      <div className="rs-profile">
        <img src={userData?.avatar || assets.profile_3} alt="profile" />
        <h3>{userData?.name || "User"} <img src={assets.green_dot}className="dot" alt="dot" /></h3>
        <p>{userData?.bio || "Hey there!"}</p>
      </div>
      <hr />
      <div className='rs-media'>
        <p>Media</p>
        <div>
          <img src={assets.profile_2} alt="media1" />
          <img src={assets.profile_3} alt="media2" />
          <img src={assets.pro1} alt="media3" />
          <img src={assets.pro1} alt="media4" />
          <img src={assets.profile_2} alt="media5" />
          <img src={assets.profile_3} alt="media6" />
        </div>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default RightSideBar
