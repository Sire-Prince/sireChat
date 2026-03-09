import "./LeftSideBar.css";
import assets from '../../assets/assets';
import { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { logout, db } from '../../config/firebase';
import { collection, query, where, getDocs, getDoc, serverTimestamp, updateDoc, doc, setDoc, arrayUnion } from "firebase/firestore";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const LeftSideBar = () => {
  const { userData, chatUser, chatData, setChatUser, setMessagesId, messageId, setChatVisible } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOnline, setIsOnline] = useState(false);
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

  useEffect(() => {
    const checkStatus = () => {
      const lastSeen = chatUser?.userData?.lastSeen;
  
      if (lastSeen) {
        const lastSeenTime = lastSeen.toMillis ? lastSeen.toMillis() : lastSeen;
        const timeDiff = Date.now() - lastSeenTime;
        setIsOnline(timeDiff <= 60000); 
      } else {
        setIsOnline(false);
      }
    };
  
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [chatUser]);

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
                  <p>{user.name}  {isOnline && (
                      <img 
                        src={assets.greendot} 
                        className='dot' 
                        alt="online" 
                        style={{ display: 'block' }} 
                      />
                    )}</p>
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