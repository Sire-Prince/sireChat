// {// import "./LeftSideBar.css"
// // import assets from '../../assets/assets'
// // import { useState } from "react"
// // import { useNavigate } from 'react-router-dom'
// // import { logout } from '../../config/firebase'
// // import { collection, query, where, getDocs, serverTimestamp, updateDoc, doc , setDoc, arrayUnion } from "firebase/firestore"
// // import { db } from "../../config/firebase"
// // import {AppContext} from "../../context/AppContext"
// // import { useContext } from "react"
// // import { toast } from "react-toastify"


// // const LeftSideBar = () => {

// //   const { userData, chatData } = useContext(AppContext);
// //   const [user, setUser] = useState(null);
// //   const [showSearch, setShowSearch] = useState(false);
// //   const navigate = useNavigate();

// //   const handleLogout = async () => {
// //     try {
// //       await logout();
// //       navigate("/");
// //     } catch (error) {
// //       console.error("Logout failed:", error);
// //     }
// //   };


// //   const inputHandler = async (e) => {
// //     try {
// //       const input = e.target.value;
// //       if (input) {
// //         setShowSearch(true)
// //         const userRef = collection(db, "users");
// //         const q = query(userRef, where("name", "==", input.toLowerCase()));
// //         const querySnap = await getDocs(q);
// //         if (!querySnap.empty && querySnap.docs[0].id !== userData.id) {
// //           let userExit = false
// //           chatData.map((user) => {
// //          if (user.rId === querySnap.docs[0].data().id) {
// //           userExit = true;
// //          }
// //           })
// //           if(!userExit){
// //     setUser(querySnap.docs[0].data().id )
// //           }
// //           setUser(querySnap.docs[0].data());
// //         } 
// //         else {
// //           setUser(null);
// //         }
// //       }
// //       else {
// //         setShowSearch(false);
// //         console.log("No user found with name:", input);
// //       }
// //     }
// //     catch (error) {
// //       console.error("Error searching for user:", error);
// //     }
// //   }



// //   const addChat = async() => {
// // const messagesRef = collection(db, "messages");
// // const chatsRef = collection(db, "chats");
// // try {
// //   const newMessageRef = doc(messagesRef);
  
// //   await setDoc(newMessageRef,{
// //     createAt:serverTimestamp(),
// //     messages:[]
// //   })

// //   await updateDoc(doc(chatsRef,userData.id),{
// //     chatData:arrayUnion({
// //       messageId:newMessageRef.id,
// //       lastMessage:"",
// //       rId:userData.id,
// //       updatedAt:Date.now(),
// //       messageSeen:true

// //    } )
// //     })

// //      await updateDoc(doc(chatsRef,userData.id),{
// //     chatData:arrayUnion({
// //       messageId:newMessageRef.id,
// //       lastMessage:"",
// //       rId:user.id,
// //       updatedAt:Date.now(),
// //       messageSeen:true

// //    } )
// //     })
// //   }
// //      catch (error) {
// //      toast.error(error);
// //      console.error(error)

// // }

// //   }



// // const setChat = (item) => {
// //   console.log("Selecting chat for:", item.rId);
// // }
// //   return (
// //     <div className='ls'>
// //       <div className='ls-top'>
// //         <div className='ls-nav'>
// //           <div className='logo'> <img src={assets.logo} className='logo-img' alt="logo" />Chat</div>

// //           <div className='menu'>
// //             <img src={assets.dots} alt="menu" />
// //             <div className="sub-menu">
// //               <p onClick={() => navigate("/profile")}>Edit Profile</p>
// //               <hr />
// //               <p onClick={handleLogout}>Logout</p>
// //             </div>
// //           </div>
// //         </div>
// //         <div className='ls-search'>
// //           <img src={assets.search_icon} alt="" />
// //           <input onChange={inputHandler} type="text" placeholder="Search here.." />
// //         </div>
// //       </div>
// //       <div className="ls-list">
// //         {showSearch && user 
// //         ? <div onClick={addChat} className="friends add-user">
// //           <img src={user.avatar} alt="" />
// //           <p>{user.name}</p>
// //         </div>
// //           : 
// //           chatData?.map((item, index) => (

// //           <div onClick={ ()=>{setChat(item)}} key={index} className='friends'>
// //             <img src={item.userData.avatar} alt="" />
// //             <div>
// //               <p>{item.userData.name}</p>
// //               <span>{item.lastMessage} </span>
// //             </div>
// //           </div>
// //         ))
// //        }
      
// //       </div>
// //     </div>
// //   )
// // }

// // export default LeftSideBar
// }

// import "./LeftSideBar.css"
// import assets from '../../assets/assets'
// import { useState, useContext, useEffect } from "react"
// import { useNavigate } from 'react-router-dom'
// import { logout, db } from '../../config/firebase'
// import { collection, query, where, getDocs, serverTimestamp, updateDoc, doc, setDoc, arrayUnion } from "firebase/firestore"
// import { AppContext } from "../../context/AppContext"
// import { toast } from "react-toastify"
// import { getDoc } from "firebase/firestore"
// const LeftSideBar = () => {

//   const { userData, chatData, chatUser, setChatUser,setMessagesId, messageId,chatVisible, setChatVisible } = useContext(AppContext);
//   const [user, setUser] = useState(null);
//   const [showSearch, setShowSearch] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate("/");
//     } catch (error) {
//       toast.error("Logout failed", error);
//     }
//   };

//   const inputHandler = async (e) => {
//     try {
//       const input = e.target.value.toLowerCase();
//       if (input) {
//         setShowSearch(true);
//         const userRef = collection(db, "users");
//         const q = query(userRef, where("name", "==", input));
//         const querySnap = await getDocs(q);

//         if (!querySnap.empty && querySnap.docs[0].id !== userData.id) {
//           const foundUserData = querySnap.docs[0].data();
//           const userExists = (chatData || []).some((chat) => chat.rId === foundUserData.id);

//           if (!userExists) {
//             setUser(foundUserData);
//           } else {
//             setUser(null);
//           }
//         } else {
//           setUser(null);
//         }
//       } else {
//         setShowSearch(false);
//         setUser(null);
//       }
//     } catch (error) {
//       console.error("Search error:", error);
//     }
//   };

//   const addChat = async () => {
//     const messagesRef = collection(db, "messages");
//     const chatsRef = collection(db, "chats");
//     try {
//       const newMessageRef = doc(messagesRef);
      
//       await setDoc(newMessageRef,
//          { createdAt: serverTimestamp(),
//            messages: [] 
//           });

//       // Update Recipient's Chat List
//       await updateDoc(doc(chatsRef, user.id), {
//         chatData: arrayUnion({
//           messageId: newMessageRef.id,
//           lastMessage: "",
//           rId: userData.id,
//           updatedAt: Date.now(),
//           messageSeen: true
//         })
//       });

//       // Update My Chat List
//       await updateDoc(doc(chatsRef, userData.id), {
//         chatData: arrayUnion({
//           messageId: newMessageRef.id,
//           lastMessage: "",
//           rId: user.id,
//           updatedAt: Date.now(),
//           messageSeen: true
//         })
//       });
//   const uSnap = await getDocs(doc(db,"users", user.id));
//   const uData = uSnap.data;
//   setChat({
//     messageId:newMessageRef.id,
//     lastMessage:"",
//     rId:user.id,
//     updatedAt: Date.now(),
//     messageSeen: true,
//     userData: uData
//   })
//       setShowSearch(false);
//        setChatVisible(true)

//       setUser(null);
//     } catch (error) {
//       toast.error(error.message);
//       console.log(error)
//     }
//   };

//   const setChat = async (item) => {
//     try {
//       setMessagesId(item.messageId);
//       setChatUser(item);
//       const userChatsRef = doc(db.app, 'chats', userData.id);
//       const userChatsSnapshot = await  getDoc(userChatsRef);
//       const userChatsData = userChatsSnapshot.data();
//       const chatIndex = userChatsData.chatsData.findIndex((c)=>c.messageId === item.messageId);
//       userChatsData.chatData[chatIndex].messageSeen = true;

//      await updateDoc(userChatsRef),{
//       chatsData: userChatsData.chatsData
//      }
//       setChatVisible(true)
//     } catch (error) {
//       toast.error(error);
//       console.log(error.message)
//     }
      
//   }
//   useEffect(()=>{
//   const updateChatUserData = async () => {
 
//       if (chatUser) {
//         const userRef = doc(db,"users",userData.id);
//         const userSnap = await getDocs(userRef);
//         const userData = userSnap.data();
//        setChatUser(prev => ({ ...prev, userData }));
//        }
//   }
//   updateChatUserData();
//   },[chatData])

//   return (
//     <div className={`ls ${chatVisible ? "hidden" : ""}`}>
//       <div className='ls-top'>
//         <div className='ls-nav'>
//           <div className='logo'><img src={assets.logo} className='logo-img' alt="logo" />Chat</div>
//           <div className='menu'>
//             <img src={assets.dots} alt="menu" />
//             <div className="sub-menu">
//               <p onClick={() => navigate("/profile")}>Edit Profile</p>
//               <hr />
//               <p onClick={handleLogout}>Logout</p>
//             </div>
//           </div>
//         </div>
//         <div className='ls-search'>
//           <img src={assets.search_icon} alt="" />
//           <input onChange={inputHandler} type="text" placeholder="Search here.." />
//         </div>
//       </div>
//       <div className="ls-list">
//         {showSearch && user ? (
//           <div onClick={addChat} className="friends add-user">
//             <img src={user.avatar} alt="avatar" />
//             <p>{user.name}</p>
//           </div>
//         ) : (
//           chatData?.map((item, index) => (
//             <div onClick={() => setChat(item)} key={index} className={`friends ${item.messageSeen || messageId ? "" : "border"}`}>
//               <img src={item.userData.avatar} alt="avatar" />
//               <div>
//                 <p>{item.userData.name}</p>
//                 <span>{item.lastMessage}</span>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default LeftSideBar;}}



import "./LeftSideBar.css";
import assets from '../../assets/assets';
import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { logout, db } from '../../config/firebase';
import { collection, query, where, getDocs, getDoc, serverTimestamp, updateDoc, doc, setDoc, arrayUnion } from "firebase/firestore";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const LeftSideBar = () => {
  const { userData, chatData, setChatUser, setMessagesId, messageId, setChatVisible } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const inputHandler = async (e) => {
    try {
      const input = e.target.value.toLowerCase();
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("name", "==", input));
        const querySnap = await getDocs(q);

        if (!querySnap.empty && querySnap.docs[0].id !== userData.id) {
          const foundUserData = querySnap.docs[0].data();
          const userExists = chatData?.some((chat) => chat.rId === foundUserData.id);

          if (!userExists) {
            setUser(foundUserData);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const addChat = async () => {
    try {
      const messagesRef = collection(db, "messages");
      const chatsRef = collection(db, "chats");
      const newMessageRef = doc(messagesRef);
      
      await setDoc(newMessageRef, { 
        createdAt: serverTimestamp(), 
        messages: [] 
      });

      const newChatEntry = {
        messageId: newMessageRef.id,
        lastMessage: "",
        updatedAt: Date.now(),
        messageSeen: true
      };

      // Update Recipient's List
      await updateDoc(doc(chatsRef, user.id), {
        chatData: arrayUnion({ ...newChatEntry, rId: userData.id })
      });

      // Update My List
      await updateDoc(doc(chatsRef, userData.id), {
        chatData: arrayUnion({ ...newChatEntry, rId: user.id })
      });

      const uSnap = await getDoc(doc(db, "users", user.id));
      const uData = uSnap.data();

      setChatUser({ ...newChatEntry, rId: user.id, userData: uData });
      setMessagesId(newMessageRef.id);
      setChatVisible(true);
      setShowSearch(false);
      setUser(null);
    } catch (error) {
      toast.error("Failed to add chat");
    }
  };

  const setChat = async (item) => {
    try {
      setMessagesId(item.messageId);
      setChatUser(item);
      
      const userChatsRef = doc(db, 'chats', userData.id);
      const userChatsSnapshot = await getDoc(userChatsRef);
      const userChatsData = userChatsSnapshot.data();
      
      const chatIndex = userChatsData.chatData.findIndex((c) => c.messageId === item.messageId);
      
      if (chatIndex !== -1) {
        userChatsData.chatData[chatIndex].messageSeen = true;
        await updateDoc(userChatsRef, {
          chatData: userChatsData.chatData
        });
      }
      setChatVisible(true);
    } catch (error) {
      console.error("Error setting chat:", error);
    }
  };

  return (
    <div className='ls'>
      <div className='ls-top'>
        <div className='ls-nav'>
          <div className='logo'><img src={assets.logo} className='logo-img' alt="logo" />Chat</div>
          <div className='menu'>
            <img src={assets.dots} alt="menu" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p onClick={handleLogout}>Logout</p>
            </div>
          </div>
        </div>
        <div className='ls-search'>
          <img src={assets.search_icon} alt="" />
          <input onChange={inputHandler} type="text" placeholder="Search here.." />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user ? (
          <div onClick={addChat} className="friends add-user">
            <img src={user.avatar} alt="" />
            <p>{user.name}</p>
          </div>
        ) : (
          chatData?.map((item, index) => (
            <div onClick={() => setChat(item)} key={index} className={`friends ${item.messageSeen || item.messageId === messageId ? "" : "unseen"}`}>
              <img src={item.userData?.avatar} alt="" />
              <div>
                <p>{item.userData?.name}</p>
                <span>{item.lastMessage}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;



