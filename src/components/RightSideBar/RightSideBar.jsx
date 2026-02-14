import React from 'react'
import "./RightSideBar.css"
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'

const RightSideBar = () => {
  return (
    <div className='rs'>
      <div className="rs-profile">
        <img src={assets.profile_3} alt="" />
        <h3>Richard Stanford <img src=""className="dot" alt="dot" /></h3>
        <p>Hey, There i am Richard using sire chat app</p>
      </div>
      <hr />
      <div className='rs-media'>
        <p>Media</p>
        <div>
          <img src={assets.profile_2} alt="" />
          <img src={assets.profile_3} alt="" />
          <img src={assets.pro1} alt="" />
          <img src={assets.pro1} alt="" />
          <img src={assets.profile_2} alt="" />
          <img src={assets.profile_3} alt="" />
        </div>
      </div>
      <button onChange={()=>logout()}>Logout</button>
    </div>
  )
}

export default RightSideBar
