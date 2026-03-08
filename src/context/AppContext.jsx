



// import { useState, useEffect, createContext } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { auth, db } from "../config/firebase";
// import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";

// export const AppContext = createContext();

// const AppContextProvider = (props) => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [userData, setUserData] = useState(null);
//     const [chatData, setChatData] = useState(null);
//     const [intervalId, setIntervalId] = useState(null);
//     const [messagesId, setMessagesId] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [chatUser, setChatUser] = useState(null);
//     const [chatVisible,setChatVisible] = useState(false)

//     const loadUserData = async (uid) => {
//         try {
//             const userRef = doc(db, "users", uid);
//             const userSnap = await getDoc(userRef);
//             const data = userSnap.data();
//             setUserData(data);

//             if (location.pathname === "/" || location.pathname === "/profile") {
//                 if (data.avatar && data.name) {
//                     navigate("/chat");
//                 } else {
//                     navigate("/profile");
//                 }
//             }

//             await updateDoc(userRef, { lastSeen: Date.now() });

//             if (intervalId) clearInterval(intervalId);
//             const id = setInterval(async () => {
//                 if (auth.currentUser) {
//                     await updateDoc(userRef, { lastSeen: Date.now() });
//                 }
//             }, 60000);
//             setIntervalId(id);

//         } catch (error) {
//             console.error("Error loading user data:", error);
//         }
//     }

//     // This Effect syncs the chat list in real-time
//     useEffect(() => {
//         if (userData) {
//             const chatRef = doc(db, "chats", userData.id);
//             const unSub = onSnapshot(chatRef, async (res) => {
//                 const data = res.data();
                
//                 // CRITICAL FIX: Ensure chatData is an array before looping
//                 if (data && Array.isArray(data.chatData)) {
//                     const chatItems = data.chatData;
//                     const tempData = [];
                    
//                     for (const item of chatItems) {
//                         const userRef = doc(db, "users", item.rId);
//                         const userSnap = await getDoc(userRef);
//                         const recipientData = userSnap.data();
//                         tempData.push({ ...item, userData: recipientData });
//                     }
//                     setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
//                 } else {
//                     setChatData([]); 
//                 }
//             });

//             return () => unSub();
//         }
//     }, [userData]); 

//     const value = { 
//         userData, setUserData, 
//         chatData, setChatData, 
//         loadUserData,
//         messages, setMessages,
//         messagesId, setMessagesId,
//         chatUser, setChatUser,
//         chatVisible,setChatVisible
//  };

//     return (
//         <AppContext.Provider value={value}>
//             {props.children}
//         </AppContext.Provider>
//     );
// }

// export default AppContextProvider;



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
    const [chatVisible, setChatVisible] = useState(false);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    // Add auth state listener
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                console.log("Auth state changed - user logged in:", user.uid);
                await loadUserData(user.uid);
            } else {
                console.log("Auth state changed - no user");
                setUserData(null);
                setChatData(null);
                setInitialLoadDone(true);
                navigate('/');
            }
        });

        return () => unsubscribe();
    }, []);

    const loadUserData = async (uid) => {
        try {
            console.log("Loading user data for uid:", uid);
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                const data = userSnap.data();
                console.log("User data loaded:", data);
                setUserData(data);
                setInitialLoadDone(true);

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
            } else {
                console.log("User document doesn't exist");
                setInitialLoadDone(true);
            }
        } catch (error) {
            console.error("Error loading user data:", error);
            setInitialLoadDone(true);
        }
    }

    // This Effect syncs the chat list in real-time
    useEffect(() => {
        if (userData) {
            console.log("🔍 Setting up chat listener for user:", userData.id);
            const chatRef = doc(db, "chats", userData.id);
            
            const unSub = onSnapshot(chatRef, 
                async (res) => {
                    console.log("🔍 Chat snapshot received:", res.exists());
                    
                    if (res.exists()) {
                        const data = res.data();
                        console.log("🔍 Raw chat data:", data);
                        
                        // FIX: Changed from data.chatData to data.chatsData
                        if (data && Array.isArray(data.chatsData)) {
                            console.log("🔍 Processing", data.chatsData.length, "chats");
                            const chatItems = data.chatsData;
                            const tempData = [];
                            
                            for (const item of chatItems) {
                                console.log("🔍 Fetching user for rId:", item.rId);
                                const userRef = doc(db, "users", item.rId);
                                const userSnap = await getDoc(userRef);
                                if (userSnap.exists()) {
                                    const recipientData = userSnap.data();
                                    tempData.push({ ...item, userData: recipientData });
                                }
                            }
                            const sortedData = tempData.sort((a, b) => b.updatedAt - a.updatedAt);
                            console.log("✅ Processed chat data:", sortedData);
                            setChatData(sortedData);
                        } else {
                            console.log("🔍 No chatsData array found, setting empty array");
                            setChatData([]); 
                        }
                    } else {
                        console.log("🔍 Chat document doesn't exist for user:", userData.id);
                        setChatData([]);
                    }
                },
                (error) => {
                    console.error("❌ Error in chat snapshot:", error);
                    setChatData([]);
                }
            );

            return () => unSub();
        }
    }, [userData]); 

    useEffect(() => {
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [intervalId]);

    const value = { 
        userData, 
        setUserData, 
        chatData, 
        setChatData, 
        loadUserData,
        messages, 
        setMessages,
        messagesId, 
        setMessagesId,
        chatUser, 
        setChatUser,
        chatVisible,
        setChatVisible,
        initialLoadDone
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;