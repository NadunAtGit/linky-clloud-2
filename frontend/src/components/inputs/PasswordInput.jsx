import React, { useState } from 'react';
import {FaRegEye,FaRegEyeSlash} from 'react-icons/fa6'

const PasswordInput = ({value,placeholder,onChange}) => {
    const[isShowPassword,setIsShowPassword]=useState(false);

    const togglePassword=()=>{
        setIsShowPassword(!isShowPassword);
    }
  return (
    <div className='flex items-center bg-cyan-600/5  px-5 py-3 rounded mb-6'>
            <input  value={value} onChange={onChange} placeholder={placeholder||"Password"} className='w-full outline-none text-sm bg-transparent mr-3 rounded' type={isShowPassword?"text" :"password"}/>

            {!isShowPassword?<FaRegEye  className='text-primary cursor-pointer' size={22} onClick={()=>togglePassword()}/>:<FaRegEyeSlash  className='text-red-500 cursor-pointer' size={22} onClick={()=>togglePassword()}/>}
    </div>
  )
}

export default PasswordInput