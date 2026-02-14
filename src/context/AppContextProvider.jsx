import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AppContext } from "./AppContext";

const AppContextProvider = (props) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [chartData, setChatData] = useState(null);
    const [intervalId, setIntervalId] = useState(null);

    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, "users", uid); 
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            
            setUserData(userData);

            if (userData.avatar && userData.name) {
                navigate("/chat");
            } else {
                navigate("/profile");
            }

            await updateDoc(userRef, {
                lastSeen: Date.now() 
            });

            // Heartbeat to update lastSeen every minute - with cleanup
            if (intervalId) clearInterval(intervalId);
            const newIntervalId = setInterval(async () => {
                if (auth.currentUser) {
                    await updateDoc(userRef, {
                        lastSeen: Date.now()
                    });
                }
            }, 60000);
            setIntervalId(newIntervalId);

        } catch (error) {
            console.error("Error loading user data:", error);
        }
    }

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [intervalId]);

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
