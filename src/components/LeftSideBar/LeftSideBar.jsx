



// // // import "./LeftSideBar.css";
// // // import assets from '../../assets/assets';
// // // import { useState, useContext } from "react";
// // // import { useNavigate } from 'react-router-dom';
// // // import { logout, db } from '../../config/firebase';
// // // import { collection, query, where, getDocs, getDoc, serverTimestamp, updateDoc, doc, setDoc, arrayUnion } from "firebase/firestore";
// // // import { AppContext } from "../../context/AppContext";
// // // import { toast } from "react-toastify";

// // // const LeftSideBar = () => {
// // //   const { userData, chatData, setChatUser, setMessagesId, messageId, setChatVisible } = useContext(AppContext);
// // //   const [user, setUser] = useState(null);
// // //   const [showSearch, setShowSearch] = useState(false);
// // //   const navigate = useNavigate();

// // //   const handleLogout = async () => {
// // //     try {
// // //       await logout();
// // //       navigate("/");
// // //     } catch (error) {
// // //       toast.error("Logout failed");
// // //     }
// // //   };

// // //   // const inputHandler = async (e) => {
// // //   //   try {
// // //   //     const input = e.target.value.toLowerCase();
// // //   //     if (input) {
// // //   //       setShowSearch(true);
// // //   //       const userRef = collection(db, "users");
// // //   //       // Changed from "name" to "usernname"
// // //   //       const q = query(userRef, where("usernname", "==", input));
// // //   //       const querySnap = await getDocs(q);

// // //   //       if (!querySnap.empty && querySnap.docs[0].id !== userData.id) {
// // //   //         const foundUserData = querySnap.docs[0].data();
// // //   //         const userExists = chatData?.some((chat) => chat.rId === foundUserData.id);

// // //   //         if (!userExists) {
// // //   //           setUser(foundUserData);
// // //   //         } else {
// // //   //           setUser(null);
// // //   //         }
// // //   //       } else {
// // //   //         setUser(null);
// // //   //       }
// // //   //     } else {
// // //   //       setShowSearch(false);
// // //   //       setUser(null);
// // //   //     }
// // //   //   } catch (error) {
// // //   //     console.error("Search error:", error);
// // //   //   }
// // //   // };


// // //   const inputHandler = async (e) => {
// // //   try {
// // //     const input = e.target.value.toLowerCase();
// // //     if (input) {
// // //       setShowSearch(true);
// // //       const userRef = collection(db, "users");
// // //       // FIXED: Changed from "name" to "usernname"
// // //       const q = query(userRef, where("usernname", "==", input));
// // //       const querySnap = await getDocs(q);

// // //       if (!querySnap.empty && querySnap.docs[0].id !== userData.id) {
// // //         const foundUserData = querySnap.docs[0].data();
// // //         console.log("Found user:", foundUserData); // Debug log
        
// // //         const userExists = chatData?.some((chat) => chat.rId === foundUserData.id);

// // //         if (!userExists) {
// // //           setUser(foundUserData);
// // //         } else {
// // //           setUser(null);
// // //         }
// // //       } else {
// // //         setUser(null);
// // //       }
// // //     } else {
// // //       setShowSearch(false);
// // //       setUser(null);
// // //     }
// // //   } catch (error) {
// // //     console.error("Search error:", error);
// // //   }
// // // };
// // //   const addChat = async () => {
// // //     try {
// // //       const messagesRef = collection(db, "messages");
// // //       const chatsRef = collection(db, "chats");
// // //       const newMessageRef = doc(messagesRef);
      
// // //       await setDoc(newMessageRef, { 
// // //         createdAt: serverTimestamp(), 
// // //         messages: [] 
// // //       });

// // //       const newChatEntry = {
// // //         messageId: newMessageRef.id,
// // //         lastMessage: "",
// // //         updatedAt: Date.now(),
// // //         messageSeen: true
// // //       };

// // //       await updateDoc(doc(chatsRef, user.id), {
// // //         chatsData: arrayUnion({ ...newChatEntry, rId: userData.id })
// // //       });

// // //       await updateDoc(doc(chatsRef, userData.id), {
// // //         chatsData: arrayUnion({ ...newChatEntry, rId: user.id })
// // //       });

// // //       const uSnap = await getDoc(doc(db, "users", user.id));
// // //       const uData = uSnap.data();

// // //       setChatUser({ ...newChatEntry, rId: user.id, userData: uData });
// // //       setMessagesId(newMessageRef.id);
// // //       setChatVisible(true);
// // //       setShowSearch(false);
// // //       setUser(null);
// // //     } catch (error) {
// // //       toast.error("Failed to add chat");
// // //     }
// // //   };

// // //   const setChat = async (item) => {
// // //     try {
// // //       setMessagesId(item.messageId);
// // //       setChatUser(item);
      
// // //       const userChatsRef = doc(db, 'chats', userData.id);
// // //       const userChatsSnapshot = await getDoc(userChatsRef);
// // //       const userChatsData = userChatsSnapshot.data();
      
// // //       const chatIndex = userChatsData.chatsData.findIndex((c) => c.messageId === item.messageId);
      
// // //       if (chatIndex !== -1) {
// // //         userChatsData.chatsData[chatIndex].messageSeen = true;
// // //         await updateDoc(userChatsRef, {
// // //           chatsData: userChatsData.chatsData
// // //         });
// // //       }
// // //       setChatVisible(true);
// // //     } catch (error) {
// // //       console.error("Error setting chat:", error);
// // //     }
// // //   };

// // //   return (
// // //     <div className='ls'>
// // //       <div className='ls-top'>
// // //         <div className='ls-nav'>
// // //           <div className='logo'><img src={assets.logo} className='logo-img' alt="logo" />Chat</div>
// // //           <div className='menu'>
// // //             <img src={assets.dots} alt="menu" />
// // //             <div className="sub-menu">
// // //               <p onClick={() => navigate("/profile")}>Edit Profile</p>
// // //               <hr />
// // //               <p onClick={handleLogout}>Logout</p>
// // //             </div>
// // //           </div>
// // //         </div>
// // //         <div className='ls-search'>
// // //           <img src={assets.search_icon} alt="" />
// // //           <input onChange={inputHandler} type="text" placeholder="Search by username..." />
// // //         </div>
// // //       </div>
// // //       <div className="ls-list">
// // //         {showSearch && user ? (
// // //           <div onClick={addChat} className="friends add-user">
// // //             <img src={user.avatar} alt="" />
// // //             <div>
// // //               <p>{user.usernname}</p>
// // //               <small>{user.name}</small>
// // //             </div>
// // //           </div>
// // //         ) : (
// // //           chatData?.map((item, index) => (
// // //             <div onClick={() => setChat(item)} key={index} className={`friends ${item.messageSeen || item.messageId === messageId ? "" : "unseen"}`}>
// // //               <img src={item.userData?.avatar} alt="" />
// // //               <div>
// // //                 <p>{item.userData?.usernname}</p>
// // //                 <span>{item.lastMessage}</span>
// // //               </div>
// // //             </div>
// // //           ))
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default LeftSideBar;

// // import "./LeftSideBar.css";
// // import assets from '../../assets/assets';
// // import { useState, useContext } from "react";
// // import { useNavigate } from 'react-router-dom';
// // import { logout, db } from '../../config/firebase';
// // import { collection, query, where, getDocs, getDoc, serverTimestamp, updateDoc, doc, setDoc, arrayUnion } from "firebase/firestore";
// // import { AppContext } from "../../context/AppContext";
// // import { toast } from "react-toastify";

// // const LeftSideBar = () => {
// //   const { userData, chatData, setChatUser, setMessagesId, messageId, setChatVisible } = useContext(AppContext);
// //   const [user, setUser] = useState(null);
// //   const [showSearch, setShowSearch] = useState(false);
// //   const navigate = useNavigate();

// //   const handleLogout = async () => {
// //     try {
// //       await logout();
// //       navigate("/");
// //     } catch (error) {
// //       toast.error("Logout failed");
// //     }
// //   };

// //   const inputHandler = async (e) => {
// //     try {
// //       const input = e.target.value.toLowerCase();
// //       if (input) {
// //         setShowSearch(true);
// //         const userRef = collection(db, "users");
        
// //         // Search by username first
// //         const usernameQuery = query(userRef, where("username", "==", input));
// //         let querySnap = await getDocs(usernameQuery);
        
// //         // If no results, search by name
// //         if (querySnap.empty) {
// //           const nameQuery = query(userRef, where("name", "==", input));
// //           querySnap = await getDocs(nameQuery);
// //         }

// //         if (!querySnap.empty && querySnap.docs[0].id !== userData.id) {
// //           const foundUserData = querySnap.docs[0].data();
// //           const userExists = chatData?.some((chat) => chat.rId === foundUserData.id);

// //           if (!userExists) {
// //             setUser(foundUserData);
// //           } else {
// //             setUser(null);
// //           }
// //         } else {
// //           setUser(null);
// //         }
// //       } else {
// //         setShowSearch(false);
// //         setUser(null);
// //       }
// //     } catch (error) {
// //       console.error("Search error:", error);
// //     }
// //   };

// //   const addChat = async () => {
// //     try {
// //       const messagesRef = collection(db, "messages");
// //       const chatsRef = collection(db, "chats");
// //       const newMessageRef = doc(messagesRef);
      
// //       await setDoc(newMessageRef, { 
// //         createdAt: serverTimestamp(), 
// //         messages: [] 
// //       });

// //       const newChatEntry = {
// //         messageId: newMessageRef.id,
// //         lastMessage: "",
// //         updatedAt: Date.now(),
// //         messageSeen: true
// //       };

// //       await updateDoc(doc(chatsRef, user.id), {
// //         chatsData: arrayUnion({ ...newChatEntry, rId: userData.id })
// //       });

// //       await updateDoc(doc(chatsRef, userData.id), {
// //         chatsData: arrayUnion({ ...newChatEntry, rId: user.id })
// //       });

// //       const uSnap = await getDoc(doc(db, "users", user.id));
// //       const uData = uSnap.data();

// //       setChatUser({ ...newChatEntry, rId: user.id, userData: uData });
// //       setMessagesId(newMessageRef.id);
// //       setChatVisible(true);
// //       setShowSearch(false);
// //       setUser(null);
// //     } catch (error) {
// //       toast.error("Failed to add chat");
// //     }
// //   };

// //   const setChat = async (item) => {
// //     try {
// //       setMessagesId(item.messageId);
// //       setChatUser(item);
      
// //       const userChatsRef = doc(db, 'chats', userData.id);
// //       const userChatsSnapshot = await getDoc(userChatsRef);
// //       const userChatsData = userChatsSnapshot.data();
      
// //       const chatIndex = userChatsData.chatsData.findIndex((c) => c.messageId === item.messageId);
      
// //       if (chatIndex !== -1) {
// //         userChatsData.chatsData[chatIndex].messageSeen = true;
// //         await updateDoc(userChatsRef, {
// //           chatsData: userChatsData.chatsData
// //         });
// //       }
// //       setChatVisible(true);
// //     } catch (error) {
// //       console.error("Error setting chat:", error);
// //     }
// //   };

// //   return (
// //     <div className='ls'>
// //       <div className='ls-top'>
// //         <div className='ls-nav'>
// //           <div className='logo'><img src={assets.logo} className='logo-img' alt="logo" />Chat</div>
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
// //           <input onChange={inputHandler} type="text" placeholder="Search by name or username..." />
// //         </div>
// //       </div>
// //       <div className="ls-list">
// //         {showSearch && user ? (
// //           <div onClick={addChat} className="friends add-user">
// //             <img src={user.avatar || assets.avatar_icon} alt="" />
// //             <div>
// //               <p>{user.name}</p>
// //               <small>@{user.username}</small>
// //             </div>
// //           </div>
// //         ) : (
// //           chatData?.map((item, index) => (
// //             <div onClick={() => setChat(item)} key={index} className={`friends ${!item.messageSeen && item.messageId !== messageId ? "unseen" : ""}`}>
// //               <img src={item.userData?.avatar || assets.avatar_icon} alt="" />
// //               <div>
// //                 <p>{item.userData?.name}</p>
// //                 <small>@{item.userData?.username}</small>
// //                 <span>{item.lastMessage || "No messages yet"}</span>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default LeftSideBar;
// import "./LeftSideBar.css";
// import assets from '../../assets/assets';
// import { useState, useContext, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
// import { logout, db } from '../../config/firebase';
// import { collection, query, where, getDocs, getDoc, serverTimestamp, updateDoc, doc, setDoc, arrayUnion } from "firebase/firestore";
// import { AppContext } from "../../context/AppContext";
// import { toast } from "react-toastify";

// const LeftSideBar = () => {
//   const { userData, chatData, setChatUser, setMessagesId, messageId, setChatVisible } = useContext(AppContext);
//   const [user, setUser] = useState(null);
//   const [showSearch, setShowSearch] = useState(false);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   // Debounce search to avoid too many requests
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchTerm) {
//         performSearch(searchTerm);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   const performSearch = async (input) => {
//     try {
//       setSearchLoading(true);
//       const userRef = collection(db, "users");
      
//       // Search by username
//       const usernameQuery = query(userRef, where("username", "==", input.toLowerCase()));
//       let querySnap = await getDocs(usernameQuery);
      
//       // If no results, search by name
//       if (querySnap.empty) {
//         const nameQuery = query(userRef, where("name", "==", input.toLowerCase()));
//         querySnap = await getDocs(nameQuery);
//       }
      
//       if (!querySnap.empty) {
//         // Filter out current user
//         const otherUsers = querySnap.docs.filter(doc => doc.id !== userData.id);
        
//         if (otherUsers.length > 0) {
//           const foundUserData = otherUsers[0].data();
//           const userExists = chatData?.some((chat) => chat.rId === foundUserData.id);

//           if (!userExists) {
//             setUser(foundUserData);
//           } else {
//             setUser(null);
//             toast.info("User already in your chats");
//           }
//         } else {
//           setUser(null);
//         }
//       } else {
//         setUser(null);
//       }
//     } catch (error) {
//       console.error("Search error:", error);
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   const inputHandler = (e) => {
//     const input = e.target.value;
//     setSearchTerm(input);
//     if (input) {
//       setShowSearch(true);
//     } else {
//       setShowSearch(false);
//       setUser(null);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate("/");
//     } catch (error) {
//       toast.error("Logout failed");
//     }
//   };

//   const addChat = async () => {
//     if (!user) return;
    
//     try {
//       const messagesRef = collection(db, "messages");
//       const chatsRef = collection(db, "chats");
//       const newMessageRef = doc(messagesRef);
      
//       await setDoc(newMessageRef, { 
//         createdAt: serverTimestamp(), 
//         messages: [] 
//       });

//       const newChatEntry = {
//         messageId: newMessageRef.id,
//         lastMessage: "",
//         updatedAt: Date.now(),
//         messageSeen: true
//       };

//       // Update Recipient's List
//       await updateDoc(doc(chatsRef, user.id), {
//         chatsData: arrayUnion({ ...newChatEntry, rId: userData.id })
//       });

//       // Update My List
//       await updateDoc(doc(chatsRef, userData.id), {
//         chatsData: arrayUnion({ ...newChatEntry, rId: user.id })
//       });

//       const uSnap = await getDoc(doc(db, "users", user.id));
//       const uData = uSnap.data();

//       setChatUser({ ...newChatEntry, rId: user.id, userData: uData });
//       setMessagesId(newMessageRef.id);
//       setChatVisible(true);
//       setShowSearch(false);
//       setSearchTerm("");
//       setUser(null);
      
//       toast.success("Chat started!");
//     } catch (error) {
//       toast.error("Failed to add chat");
//       console.error(error);
//     }
//   };

//   const setChat = async (item) => {
//     try {
//       setMessagesId(item.messageId);
//       setChatUser(item);
      
//       const userChatsRef = doc(db, 'chats', userData.id);
//       const userChatsSnapshot = await getDoc(userChatsRef);
//       const userChatsData = userChatsSnapshot.data();
      
//       const chatIndex = userChatsData.chatsData.findIndex((c) => c.messageId === item.messageId);
      
//       if (chatIndex !== -1) {
//         userChatsData.chatsData[chatIndex].messageSeen = true;
//         await updateDoc(userChatsRef, {
//           chatsData: userChatsData.chatsData
//         });
//       }
//       setChatVisible(true);
//     } catch (error) {
//       console.error("Error setting chat:", error);
//     }
//   };

//   return (
//     <div className='ls'>
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
//           <input 
//             onChange={inputHandler} 
//             value={searchTerm}
//             type="text" 
//             placeholder="Search by name or username..." 
//           />
//         </div>
//       </div>
//       <div className="ls-list">
//         {showSearch && (
//           <>
//             {searchLoading && <div className="search-status">Searching...</div>}
//             {!searchLoading && user && (
//               <div onClick={addChat} className="friends add-user">
//                 <img src={user.avatar || assets.avatar_icon} alt="" />
//                 <div>
//                   <p>{user.name}</p>
//                   <small>@{user.username}</small>
//                 </div>
//               </div>
//             )}
//             {!searchLoading && !user && searchTerm && (
//               <div className="no-results">No users found</div>
//             )}
//           </>
//         )}
        
//         {!showSearch && chatData?.map((item, index) => (
//           <div onClick={() => setChat(item)} key={index} className={`friends ${!item.messageSeen && item.messageId !== messageId ? "unseen" : ""}`}>
//             <img src={item.userData?.avatar || assets.avatar_icon} alt="" />
//             <div>
//               <p>{item.userData?.name}</p>
//               <small>@{item.userData?.username}</small>
//               <span>{item.lastMessage || "No messages yet"}</span>
//             </div>
//           </div>
//         ))}
        
//         {!showSearch && (!chatData || chatData.length === 0) && (
//           <div className="no-chats">
//             <p>No conversations yet</p>
//             <p className="hint">Search for users above to start chatting</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LeftSideBar;

import "./LeftSideBar.css";
import assets from '../../assets/assets';
import { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { logout, db } from '../../config/firebase';
import { collection, query, where, getDocs, getDoc, serverTimestamp, updateDoc, doc, setDoc, arrayUnion } from "firebase/firestore";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const LeftSideBar = () => {
  const { userData, chatData, setChatUser, setMessagesId, messageId, setChatVisible } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        performSearch(searchTerm);
      } else {
        setShowSearch(false);
        setUser(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const performSearch = async (input) => {
    try {
      const trimmedInput = input.trim().toLowerCase();
      
      if (!trimmedInput) {
        setUser(null);
        return;
      }
      
      setSearchLoading(true);
      const userRef = collection(db, "users");
      
      // Search by username
      const usernameQuery = query(userRef, where("username", "==", trimmedInput));
      let querySnap = await getDocs(usernameQuery);
      
      // If no results, search by name
      if (querySnap.empty) {
        const nameQuery = query(userRef, where("name", "==", trimmedInput));
        querySnap = await getDocs(nameQuery);
      }
      
      if (!querySnap.empty) {
        const foundUser = querySnap.docs[0];
        const foundUserData = foundUser.data();
        
        // Check if this is NOT the current user
        if (foundUser.id !== userData.id) {
          const userExists = chatData?.some((chat) => chat.rId === foundUser.id);
          
          if (!userExists) {
            setUser(foundUserData);
          } else {
            setUser(null);
            toast.info("User already in your chats");
          }
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const inputHandler = (e) => {
    const input = e.target.value;
    setSearchTerm(input);
    if (input.trim()) {
      setShowSearch(true);
    } else {
      setShowSearch(false);
      setUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      toast.error("Logout failed", error);
    }
  };

  // const addChat = async () => {
  //   if (!user) return;
    
  //   try {
  //     const messagesRef = collection(db, "messages");
  //     const chatsRef = collection(db, "chats");
  //     const newMessageRef = doc(messagesRef);
      
  //     await setDoc(newMessageRef, { 
  //       createdAt: serverTimestamp(), 
  //       messages: [] 
  //     });

  //     const newChatEntry = {
  //       messageId: newMessageRef.id,
  //       lastMessage: "",
  //       updatedAt: Date.now(),
  //       messageSeen: true
  //     };

  //     // Update Recipient's List
  //     await updateDoc(doc(chatsRef, user.id), {
  //       chatsData: arrayUnion({ ...newChatEntry, rId: userData.id })
  //     });

  //     // Update My List
  //     await updateDoc(doc(chatsRef, userData.id), {
  //       chatsData: arrayUnion({ ...newChatEntry, rId: user.id })
  //     });

  //     const uSnap = await getDoc(doc(db, "users", user.id));
  //     const uData = uSnap.data();

  //     setChatUser({ ...newChatEntry, rId: user.id, userData: uData });
  //     setMessagesId(newMessageRef.id);
  //     setChatVisible(true);
  //     setShowSearch(false);
  //     setSearchTerm("");
  //     setUser(null);
      
  //     toast.success("Chat started!");
  //   } catch (error) {
  //     toast.error("Failed to add chat");
  //     console.error(error);
  //   }
  // };
const addChat = async () => {
  if (!user) return;
  
  try {
    // Create message document
    const messagesRef = collection(db, "messages");
    const newMessageRef = doc(messagesRef);
    await setDoc(newMessageRef, { 
      createdAt: serverTimestamp(), 
      messages: [] 
    });

    const newChatEntry = {
      messageId: newMessageRef.id,
      lastMessage: "",
      updatedAt: Date.now(),
      messageSeen: true,
      rId: user.id
    };

    // Update current user's chats
    const myChatRef = doc(db, "chats", userData.id);
    const myChatSnap = await getDoc(myChatRef);
    
    if (myChatSnap.exists()) {
      await updateDoc(myChatRef, {
        chatsData: arrayUnion(newChatEntry)
      });
    } else {
      await setDoc(myChatRef, {
        chatsData: [newChatEntry]
      });
    }

    // Update recipient's chats
    const recipientChatRef = doc(db, "chats", user.id);
    const recipientEntry = { ...newChatEntry, rId: userData.id };
    
    const recipientSnap = await getDoc(recipientChatRef);
    if (recipientSnap.exists()) {
      await updateDoc(recipientChatRef, {
        chatsData: arrayUnion(recipientEntry)
      });
    } else {
      await setDoc(recipientChatRef, {
        chatsData: [recipientEntry]
      });
    }

    // Get recipient data and set chat
    const userSnap = await getDoc(doc(db, "users", user.id));
    setChatUser({ ...newChatEntry, userData: userSnap.data() });
    setMessagesId(newMessageRef.id);
    setChatVisible(true);
    
    // Clean up
    setShowSearch(false);
    setSearchTerm("");
    setUser(null);
    toast.success("Chat started!");
    
  } catch (error) {
    console.error("Chat error:", error);
    toast.error("Failed to start chat");
  }
};
  const setChat = async (item) => {
    try {
      setMessagesId(item.messageId);
      setChatUser(item);
      
      const userChatsRef = doc(db, 'chats', userData.id);
      const userChatsSnapshot = await getDoc(userChatsRef);
      const userChatsData = userChatsSnapshot.data();
      
      const chatIndex = userChatsData.chatsData.findIndex((c) => c.messageId === item.messageId);
      
      if (chatIndex !== -1) {
        userChatsData.chatsData[chatIndex].messageSeen = true;
        await updateDoc(userChatsRef, {
          chatsData: userChatsData.chatsData
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
              <p onClick={() => navigate("/profile")}>Profile</p>
              <hr />
              <p onClick={handleLogout}>Logout</p>
            </div>
          </div>
        </div>
        <div className='ls-search'>
          <img src={assets.search_icon} alt="" />
          <input 
            onChange={inputHandler} 
            value={searchTerm}
            type="text" 
            placeholder="Search by name or username..." 
          />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && (
          <>
            {searchLoading && <div className="search-status">Searching...</div>}
            {!searchLoading && user && (
              <div onClick={addChat} className="friends add-user">
                <img src={user.avatar || assets.avatar_icon} alt="" />
                <div>
                  <p>{user.name}</p>
                  <small>@{user.username}</small>
                </div>
              </div>
            )}
            {!searchLoading && !user && searchTerm.trim() && (
              <div className="no-results">No users found</div>
            )}
          </>
        )}
        
        {!showSearch && chatData?.map((item, index) => (
          <div onClick={() => setChat(item)} key={index} className={`friends ${!item.messageSeen && item.messageId !== messageId ? "unseen" : ""}`}>
            <img src={item.userData?.avatar || assets.avatar_icon} alt="" />
            <div>
              <p>{item.userData?.name}</p>
              <small>@{item.userData?.username}</small>
              <span>{item.lastMessage || "No messages yet"}</span>
            </div>
          </div>
        ))}
        
        {!showSearch && (!chatData || chatData.length === 0) && (
          <div className="no-chats">
            <p>No conversations yet</p>
            <p className="hint">Search for users above to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;