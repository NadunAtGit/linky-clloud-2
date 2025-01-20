import React, { useState } from 'react';
import PasswordInput from '../../components/inputs/PasswordInput';
import { useNavigate } from 'react-router-dom';
import ImageSelector from '../../components/inputs/ImageSelector';
import uploadImage from '../../Utils/uploadImage';
import { validateEmail } from '../../Utils/helper';
import axiosInstance from '../../Utils/axiosInstance';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUsername] = useState('');
  const[storyImage,setStoryImage]=useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
  
    if (!userName) {
      setError('Please enter your username');
      return;
    }
  
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
  
    if (!password) {
      setError('Please enter a password');
      return;
    }
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    setError('');
    setLoading(true);
  
    try {
      let imageUrl="";
        //upload image if present
      if(storyImage){
        console.log("Uploading file:", storyImage);
        const imageUploadRes = await uploadImage(storyImage);
        imageUrl = imageUploadRes.profilePicUrl || "";

      }
  
      // Send signup request
      const response = await axiosInstance.post('/signup', {
        userName,
        email,
        password,
        profilePicUrl: imageUrl ||"",
      });
  
      if (response.data && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'An error occurred. Please try again.');
      } else {
        setError('An error occurred. Please check your network connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImg=async()=>{
    console.log("Removing image");
    setStoryImage("");
  }
  

  return (
    <div className="h-screen overflow-hidden relative bg-cyan-50">
      <div className="container h-screen px-30 mx-auto flex items-center justify-center">
        {/* Left image */}
        <div className="w-1/3 flex flex-col items-start justify-end h-[70vh] border-purple-400 rounded-xl p-10 z-50 bg-signup-bg-img bg-cover bg-center shadow-xl shadow-purple-400">
          <h4 className="text-7xl font-semibold leading-[50px] text-white">Linky</h4>
          <p className="text-[20px] text-white leading-6 pr-7 mt-6">
            "Connect Your World,<br />All Your Links, One Place."
          </p>
        </div>

        {/* Right form */}
        <div className="w-1/3 h-[80vh] bg-white rounded-lg relative p-16 shadow-lg shadow-cyan-200">
          <form onSubmit={handleSignIn}>
            <h1 className="text-3xl font-semibold mb-3">Sign Up</h1>
            <ImageSelector
              image={storyImage} setImage={setStoryImage} handleDeleting={handleDeleteImg}
            />

            <input
              type="text"
              className="input-box"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="email"
              className="input-box"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />

            {error && <p className="text-red-500 text-sm pb-1">{error}</p>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Signing Up...' : 'SIGN UP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
