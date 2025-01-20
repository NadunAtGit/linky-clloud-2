import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaTrash, FaMediumM, FaWikipediaW, FaYoutube, FaLink } from 'react-icons/fa';  // Add new imports

const LinkCard = ({ id, title, link, icon, onDelete }) => {
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
      case 'medium':
        return <FaMediumM size={24} color="#00ab6c" />;
      case 'wikipedia':
        return <FaWikipediaW size={24} color="#000" />;
      case 'youtube':
        return <FaYoutube size={24} color="#FF0000" />;
      default:
        return <FaLink size={24} color="#000" />;  // Default link icon if platform is unknown
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center space-x-4 cursor-pointer shadow shadow-purple-500 hover:shadow-slate-300 transition-all ease-in-out">
      <div className="text-cyan-600">{getIcon(icon)}</div>
      <div className="flex flex-col flex-1 flex-nowrap">
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold hover:underline">
          {title}
        </a>
        <p className="text-sm text-gray-500 overflow-hidden">{link}</p>
      </div>
      <button
        onClick={() => onDelete(id)}
        className="text-red-600 hover:text-red-800 transition-all ease-in-out"
        aria-label="Delete Link"
      >
        <FaTrash size={20} />
      </button>
    </div>
  );
};

export default LinkCard;
