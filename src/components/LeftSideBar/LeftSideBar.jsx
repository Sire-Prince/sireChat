import React, { useContext } from 'react'
import "./LeftSideBar.css" 
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../config/firebase'
import { AppContext } from '../../context/AppContext'

const LeftSideBar = () => {
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
    <div className='ls'>
<div className='ls-top'>
    <div className='ls-nav'>
        <div className='logo'> <img src={assets.logo} className='logo-img' alt="logo" />Chat</div>
       
        <div className='menu'>
            <img src={assets.dots} alt="menu"/>
            <div className="sub-menu">
                <p onClick={() => navigate("/profile")}>Edit Profile</p>
                <hr />
                <p onClick={handleLogout}>Logout</p>
            </div>
        </div>
    </div>
    <div className='ls-search'>
        <img src={assets.search_icon} alt="" />
         <input type="text" placeholder="Search here.." />
    </div>
    </div>     
    <div className="ls-list">
      {Array(12).fill("").map((item,index)=>(

          <div key={index} className='friends'>
            <img src={assets.profile_2} alt="" />
            <div>
                <p>Richard</p>
                <span>Hello, how are you </span>
            </div>
        </div>
      ))}
        </div> 
    </div>
  )
}

export default LeftSideBar
