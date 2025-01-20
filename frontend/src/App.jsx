import React from 'react';
import { Route,Routes,Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from "./pages/Auth/Login";
import SignIn from "./pages/Auth/SignIn";
import LinkTreePage from './pages/LinkTreePage';
import './index.css';
const App = () => {
  return (
  <div>
  <Routes>
       <Route path="/" exact element={<Root/>}/>
      <Route path="/dashboard" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path='/signin' element={<SignIn/>}/>
      <Route path="/:username" element={<LinkTreePage />} />
      
  </Routes>
    
  </div>
  )
}

const Root=()=>{
  const isAuthenticated=!!localStorage.getItem("token");

  return isAuthenticated?(
    <Navigate to="/dashboard"/>
  ):(
    <Navigate to="/login"/>
  )
}

export default App;