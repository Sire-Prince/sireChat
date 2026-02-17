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
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"hi, am using sire chat app",
            lastSeen:Date.now()
        })
        await setDoc(doc(db,"chats",user.uid),{
            chatData:[]
        })
        return { success: true };
    } catch (error) {
        console.error(error);
        throw new Error(error.code === 'auth/email-already-in-use' ? 'Email already in use' : 'Sign up failed');
    }
}

const login = async(email,password) =>{
try {
    await signInWithEmailAndPassword(auth,email,password);
    return { success: true };
} catch (error) {
    console.error(error);
    throw new Error(error.code === 'auth/user-not-found' ? 'User not found' : error.code === 'auth/wrong-password' ? 'Wrong password' : 'Login failed');
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