import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../Utils/axiosInstance';
import UserDetailsCard from '../components/Cards/UserDetailsCard';
import LinkCardShare from '../components/Cards/LinkCardShare';

const LinkTreePage = () => {
    const { username } = useParams(); // Extract username from route params
    const [links, setLinks] = useState([]);
    const [userInfo, setUserInfo] = useState();
    const [loading, setLoading] = useState(true);


    const getUserInfo = async () => {
      try {
          // Fetch user details (adjust API as needed)
          const response = await axiosInstance.get(`/get-user`);
          if (response.data?.user) {
              setUserInfo(response.data.user);
          }
      } catch (error) {
          console.error('Error fetching user info:', error.message);
      }
  };

const fetchLinks = async () => {
    try {
        // Fetch all links for the user by username
        const response = await axiosInstance.get(`/get-links-by-username/${username}`);
        setLinks(response.data.links);
    } catch (error) {
        console.error('Error fetching links:', error.message);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        // Fetch user info based on the username
        

        // Fetch all links for the user based on username
        

        getUserInfo();
        fetchLinks();
    }, [username]);

    if (loading) return <p>Loading...</p>;
    if (!userInfo) return <p>User not found</p>;

    return (
        <div className="text-center py-10">
            <h1 className="text-2xl font-bold mb-5">{username}'s Links</h1>
            {userInfo && <UserDetailsCard userInfo={userInfo} />}
            {links && links.length > 0 ? (
                <div className="flex flex-col items-center">
                    {links.map((link) => (
                        <div key={link._id} className="w-full max-w-md">
                            <LinkCardShare
                                id={link._id}
                                title={link.name}
                                link={link.url}
                                icon={link.name.toLowerCase()} // Adjust as per your data
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p>No links available.</p>
            )}
        </div>
    );
};

export default LinkTreePage;
