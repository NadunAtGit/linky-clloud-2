import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LinkCardShare = ({ title, link, icon }) => {
  const getIcon = (platform) => {
    switch (platform) {
      case 'facebook':
        return <FaFacebook size={24} color="#4267B2" />;
      case 'twitter':
        return <FaTwitter size={24} color="#1DA1F2" />;
      case 'instagram':
        return <FaInstagram size={24} color="#C13584" />;
      case 'linkedin':
        return <FaLinkedin size={24} color="#0077B5" />;
      case 'github':
        return <FaGithub size={24} color="#333" />;
      default:
        return null; // No icon for unsupported platforms
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center space-x-4 cursor-pointer shadow shadow-purple-500 hover:shadow-slate-300 transition-all ease-in-out">
      <div className="text-cyan-600">{getIcon(icon)}</div>
      <div className="flex flex-col flex-1 flex-nowrap">
        <Link to={link} className="text-lg font-semibold hover:underline" target="_blank" rel="noopener noreferrer">
          {title}
        </Link>
        <p className="text-sm text-gray-500 overflow-hidden">{link}</p>
      </div>
    </div>
  );
};

export default LinkCardShare;
