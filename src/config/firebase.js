import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { getFirestore, setDoc, doc, collection, query, where, getDoc } from "firebase/firestore"; 
import { toast } from "react-toastify/unstyled";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
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
            chatsData:[]
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

const resetPass = async (email)=>{
    if(!email){
        toast.error("Enter your E-mail");
        return null
    }
    try {
        const userRef = collection(db, "user");
        const q = query(userRef, where("email","==",email));
       const querSnap = await getDoc(q);
     if(!querSnap.empty){
        await sendPasswordResetEmail(auth,email);
        toast.success("Reset Email Sent")
     }
     else{
          toast.error("Email doesn't exist")
     }
    } catch (error) {
        toast.error(error);
        console.error(error.message)
    }
}
export {signup,login,logout,auth,db,resetPass}