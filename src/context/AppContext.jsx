
//  import { useState, useEffect, createContext } from "react";
//  import { useNavigate, useLocation } from "react-router-dom";
//  import { auth, db } from "../config/firebase";
//  import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";


//  export const AppContext = createContext();

//  const AppContextProvider = (props) => {

//      const navigate = useNavigate();
//      const location = useLocation();
//      const [userData, setUserData] = useState(null);
//      const [chatData, setChatData] = useState(null);
//      const [intervalId, setIntervalId] = useState(null);

//      const loadUserData = async (uid) => {
//          try {
//              const userRef = doc(db, "users", uid); 
//              const userSnap = await getDoc(userRef);
//              const userData = userSnap.data();
//              setUserData(userData);

//              if (location.pathname === "/") {
//                  if (userData.avatar && userData.name) {
//                      navigate("/chat");
//                  } else {
//                      navigate("/profile");
//                  }
//              }

//              await updateDoc(userRef, {
//                  lastSeen: Date.now() 
//              });

//              if (intervalId) clearInterval(intervalId);
//              const newIntervalId = setInterval(async () => {
//                  if (auth.currentUser) {
//                         await updateDoc(userRef, {
//                             lastSeen: Date.now()
//                         });
//            }
//              }, 15000);
//              setIntervalId(newIntervalId);

//          } catch (error) {
//              console.error("Error loading user data:", error);
//          }
//      }

//      useEffect(() => {
//          return () => {
//              if (intervalId) clearInterval(intervalId);
//          };
//      }, [intervalId]);

//      const value = {
//          userData, setUserData,
//          chatData, setChatData,
//          loadUserData,
        
//      };
//   useEffect(() => {
//     if (userData){
//         const chartRef = doc(db, "chats", userData.id);
//         const unSub = onSnapshot(chartRef, async (res) => {
//             const chatItems = res.data().chatData;
//             const tempData = [];
//             for (const item of chatItems){
//                 const userRef = doc(db, "users", item.rId);
//                 const userSnap = await getDoc(userRef);
//                 const userData = userSnap.data();
//                 tempData.push({...item, userData});
//             }
//             setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
//         })
//  return () => {
//      unSub();
//     }
//     }}
//   )
//      return (
//          <AppContext.Provider value={value}>
//              {props.children}
//          </AppContext.Provider>
//      );
//  }

//  export default AppContextProvider;






import { useState, useEffect, createContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);
    const [intervalId, setIntervalId] = useState(null);
    const [messagesId, setMessagesId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatUser, setChatUser] = useState(null);
    const [chatVisible,setChatVisible] = useState(false)

    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);
            const data = userSnap.data();
            setUserData(data);

            if (location.pathname === "/" || location.pathname === "/profile") {
                if (data.avatar && data.name) {
                    navigate("/chat");
                } else {
                    navigate("/profile");
                }
            }

            await updateDoc(userRef, { lastSeen: Date.now() });

            if (intervalId) clearInterval(intervalId);
            const id = setInterval(async () => {
                if (auth.currentUser) {
                    await updateDoc(userRef, { lastSeen: Date.now() });
                }
            }, 60000);
            setIntervalId(id);

        } catch (error) {
            console.error("Error loading user data:", error);
        }
    }

    // This Effect syncs the chat list in real-time
    useEffect(() => {
        if (userData) {
            const chatRef = doc(db, "chats", userData.id);
            const unSub = onSnapshot(chatRef, async (res) => {
                const data = res.data();
                
                // CRITICAL FIX: Ensure chatData is an array before looping
                if (data && Array.isArray(data.chatData)) {
                    const chatItems = data.chatData;
                    const tempData = [];
                    
                    for (const item of chatItems) {
                        const userRef = doc(db, "users", item.rId);
                        const userSnap = await getDoc(userRef);
                        const recipientData = userSnap.data();
                        tempData.push({ ...item, userData: recipientData });
                    }
                    setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
                } else {
                    setChatData([]); 
                }
            });

            return () => unSub();
        }
    }, [userData]); 

    const value = { 
        userData, setUserData, 
        chatData, setChatData, 
        loadUserData,
        messages, setMessages,
        messagesId, setMessagesId,
        chatUser, setChatUser,
        chatVisible,setChatVisible
 };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;

