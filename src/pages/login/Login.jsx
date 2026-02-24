import React from 'react'
import './Login.css'
import assets from '../../assets/assets.js'
import { useState } from 'react'
import {signup, login, resetPass} from "../../config/firebase.js"

const Login = () => {

    const [currState, setCurrState] = useState("Sign Up");
    const [userName,setuserName] = useState("");
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

const unSubmitHandler = async (event) => {
event.preventDefault();
setError("");

if (password.length < 6) {
  setError("Password must be at least 6 characters");
  return;
}

setLoading(true);
try {
  if (currState === "Sign Up") {
    if (!userName.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }
    await signup(userName, email, password);
  } else {
    await login(email, password);
  }
} catch (err) {
  setError(err.message || "Authentication failed");
} finally {
  setLoading(false);
}
}

  return (
    <div className="login">
        <div className='login-img'>
           <img src={assets.logo} alt="logo" />  
           <h2>sireChat</h2> 
        </div>
    
      <form onSubmit={unSubmitHandler} className='login-form' action="">
        <h2>{currState}</h2>
        {currState === "Sign Up"?  <input  onChange={(e)=> setuserName(e.target.value)} value={userName}  type="text" placeholder="Name" className="form-input" required />
 : null}
        <input onChange={(e)=> setEmail(e.target.value)} value={email} type="email" placeholder="Email" className="form-input" required/>
        <input onChange={(e)=> setPassword(e.target.value)} value={password} type="password" placeholder="Password" className="form-input" required/>
        {error && <p style={{color: 'red', fontSize: '12px', marginBottom: '10px'}}>{error}</p>}
        <button disabled={loading}>{loading ? "Loading..." : (currState === "Sign Up" ? "Create An Account" : "Login")}</button>
        <div className='login-term'>
            <input type="checkbox"/>
            <p>Agree to the terms of use & privacy policy</p>
        </div>
        <div className="login-forgot">
            {currState === "Sign Up" 
            ?  <p className="login-toggle"> Already have an account <span  onClick={()=> setCurrState("Log In")}> click here</span> </p> 
            : <p className="login-toggle">
                Create an account <span  onClick={()=> setCurrState("Sign Up")}> Sign up </span>
            </p> }
           
         {currState === "login" ?  <p className="login-toggle">
                Forgot Password <span  onClick={()=> resetPass(email)}> reset here </span>
            </p> : null }
        </div>
      </form>
     </div>
  )
}

export default Login
