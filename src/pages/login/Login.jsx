import React from 'react'
import './Login.css'
import assets from '../../assets/assets.js'
import { useState } from 'react'
import {signup, login} from "../../config/firebase.js"

const Login = () => {

    const [currState, setCurrState] = useState("Sign Up");
    const [userName,setuserName] = useState("");
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");


const unSubmitHandler = (event) => {
event.preventDefault();
  if (currState === "Sign Up") {
  signup(userName,email,password)
}
else{
  login(email,password)
}
}

  return (
    <div className="login">
        <div className='login-img'>
           <img src={assets.logo} alt="logo" />  
           <h2>Chat App</h2> 
        </div>
    
      <form onSubmit={unSubmitHandler} className='login-form' action="">
        <h2>{currState}</h2>
        {currState === "Sign Up"?  <input  onChange={(e)=> setuserName(e.target.value)} value={userName}  type="text" placeholder="Name" className="form-input" required />
 : null}
        <input onChange={(e)=> setEmail(e.target.value)} value={email} type="email" placeholder="Email" className="form-input" required/>
        <input onChange={(e)=> setPassword(e.target.value)} value={password} type="password" placeholder="Password" className="form-input" required/>
        <button>{currState === "Sign Up" ? "Create An Account" : "Login"}</button>
        <div className='login-term'>
            <input type="checkbox"/>
            <p>Agree to the terms of use & privacy policy</p>
        </div>
        <div className="login-forgot">
            {currState === "Sign Up" 
            ?  <p className="login-toggle"> Already have an account <span  onClick={()=> setCurrState("LogIn")}> click here</span> </p> 
            : <p className="login-toggle">
                Create an account <span  onClick={()=> setCurrState("Sign Up")}> Sign up </span>
            </p> }
           
         
        </div>
      </form>
     </div>
  )
}

export default Login
