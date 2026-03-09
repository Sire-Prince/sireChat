import React, { useEffect, useContext } from 'react'
import "./profileUpDate.css"
import assets from '../../assets/assets'
import { useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import {auth, db} from '../../config/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { upload } from '../../lib/upload'
import { updateDoc } from 'firebase/firestore'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'

const ProfileUpDate = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");  
  const [uid, setUid] = useState(null);
  const [prevImage, setPrevImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setUserData } = useContext(AppContext);

  const profileUpdate = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const docRef = doc(db, "users", uid);
      
      let imgURL = prevImage;

      // Upload new image if selected
      if (image instanceof File) {
        const uploadResult = await upload(image);
        if (uploadResult && uploadResult.url) {
          imgURL = uploadResult.url;
        } else {
          toast.error("Failed to upload image");
          setLoading(false);
          return;
        }
      }

      // Validate required fields
      if (!name.trim()) {
        toast.error("Name is required");
        setLoading(false);
        return;
      }

      if (!imgURL) {
        toast.error("Profile image is required");
        setLoading(false);
        return;
      }

      // Update all fields including avatar
      await updateDoc(docRef, {
        name: name.trim(),
        bio: bio.trim() || "hi, am using sire chat app",
        avatar: imgURL
      });

      // Fetch updated data
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      
      toast.success("Profile Updated Successfully!");
      navigate("/chat");

    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Error updating profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUid(user.uid);
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            
            setName(userData.name || "");
            setBio(userData.bio || "hi, am using sire chat app");
            
            if (userData.avatar) {
              setPrevImage(userData.avatar);
              setImage(userData.avatar);
            }
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Error loading profile");
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (image instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(image));
      }
    };
  }, [image]);

  const displayImage = image instanceof File 
    ? URL.createObjectURL(image) 
    : prevImage || assets.avatar;

  return (
    <div className='profile'>
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          
          <label htmlFor="avatar">
            <input 
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  // Validate file type and size
                  if (!file.type.startsWith('image/')) {
                    toast.error('Please select an image file');
                    return;
                  }
                  if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    toast.error('Image size should be less than 5MB');
                    return;
                  }
                  setImage(file);
                }
              }} 
              type="file" 
              id='avatar' 
              accept='.png,.jpg,.jpeg,.gif' 
              hidden
            />
            <img 
              src={displayImage} 
              alt="profile" 
            />
            <span>Upload profile image</span>
          </label>
          
          <input 
            type="text" 
            onChange={(e) => setName(e.target.value)} 
            value={name} 
            placeholder='Your name' 
            required 
          />
          
          <textarea 
            onChange={(e) => setBio(e.target.value)} 
            value={bio} 
            placeholder='Write profile bio' 
            rows="4"
            required
          />
          
          <button type='submit' disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>
        
        <img 
          className='profile-pic' 
          src={displayImage} 
          alt="profile preview" 
        />
      </div>
    </div>
  )
}

export default ProfileUpDate;