import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase"; // Added 'db'
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Added 'doc' and 'getDoc'

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [chartData, setChatData] = useState(null);

    const loadUserData = async (uid) => {
        try {
            // Added quotes around "users" and removed 'await' from doc()
            const userRef = doc(db, "users", uid); 
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            
            setUserData(userData);

            if (userData.avatar && userData.name) {
                navigate("/chat");
            } else {
                navigate("/profile");
            }

            // Fixed Date.now (it's a function)
            await updateDoc(userRef, {
                lastSeen: Date.now() 
            });

            // Heartbeat to update lastSeen every minute
            setInterval(async () => {
                if (auth.currentUser) { // Fixed check for current user
                    await updateDoc(userRef, {
                        lastSeen: Date.now()
                    });
                }
            }, 60000);

        } catch (error) {
            console.error("Error loading user data:", error);
        }
    }

    const value = {
        userData, setUserData,
        chartData, setChatData,
        loadUserData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;
