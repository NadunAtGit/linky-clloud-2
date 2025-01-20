import React from 'react';
import LOGO  from '../assets/logo.svg';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {

  const navigate=useNavigate();
  const isToken=localStorage.getItem("token");

  const logout=()=>{
    localStorage.clear();
    navigate('/login');
  }
  return (
    <div className='py-2 px-6 flex items-center justify-between drop-shadow sticky top-0 2-10'>
        <img src={LOGO} className="h-9"/>
        <button className='bg-primary rounded-[50px] text-white font-semibold p-3 hover:bg-slate-100 hover:text-primary cursor-pointer' onClick={()=>logout()}>
          Logout
        </button>
    </div>
  )
}

export default NavBar