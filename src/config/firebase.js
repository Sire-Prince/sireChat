import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { getFirestore, setDoc, doc } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyAAMCU8s8hfJ9dubkHFeb5QSuonJYbvVmI",
  authDomain: "sire-chat-app.firebaseapp.com",
  projectId: "sire-chat-app",
  storageBucket: "sire-chat-app.firebasestorage.app",
  messagingSenderId: "8692111827",
  appId: "1:8692111827:web:805510688d17a3a8bfb726",
  measurementId: "G-VLRYH6SGPV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username,email,password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth,email,password);
        const user = res.user;
        await setDoc(doc(db,"users",user.uid),{
            id:user.uid,
            usernname:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"hi, am using sire cat app",
            lastSeen:Date.now()
        })
        await setDoc(doc(db,"charts",user.uid),{
            chatData:[]
        })
    } catch (error) {
        console.error(error)
    }
}

const login = async(email,password) =>{
try {
    await signInWithEmailAndPassword(auth,email,password);

} catch (error) {
    console.error(error)
}
}


const logout = async () => {
try {
     await signOut(auth,)
} catch (error) {
    console.error(error)
}      
  
}
export {signup,login,logout,auth,db}