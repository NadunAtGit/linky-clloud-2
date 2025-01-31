import React, { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../Utils/axiosInstance';
import UserDetailsCard from '../../components/Cards/UserDetailsCard';
import LinkCard from '../../components/Cards/LinkCard';
import { MdAdd } from 'react-icons/md';
import Modal from "react-modal";
import AddLink from '../../components/inputs/AddLink';
import { ToastContainer, toast } from 'react-toastify';

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState();
  const [allLinks, setAllLinks] = useState([]);
  const[openAddModal,setOpenAddModal]=useState({
    isShown:false,
    data:null,
  })

  // Get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data?.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  // Get all links
  const getAllLinks = async () => {
    try {
      const response = await axiosInstance.get('/get-all-links');
      if (response.data?.links) {
        setAllLinks(response.data.links);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error.message);
    }
  };

  // Delete link
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/delete-link/${id}`);
      setAllLinks((prev) => prev.filter((link) => link._id !== id)); // Update the state
    } catch (error) {
      console.error('Error deleting link:', error.message);
    }
  };

  //generate linktree

  const generateLinkTree = async () => {
    try {
        const response = await axiosInstance.post('/generate-linktree');
        if (response.data?.linkTreeUrl) {
            toast.success('LinkTree generated successfully!');
            // Redirect to the generated LinkTree URL
            getUserInfo();
            // navigate(`/linktree/${response.data.linkTreeUrl.split('/').pop()}`);
        }
    } catch (error) {
        console.error('Error generating LinkTree:', error.message);
        toast.error('Failed to generate LinkTree. Please try again.');
    }
};

  useEffect(() => {
    getUserInfo();
    getAllLinks();
  }, []);

  return (
    <>
      <NavBar />
      <div className="container py-10 mx-auto">
        <UserDetailsCard userInfo={userInfo} />
        <div className="flex flex-col items-center">
          {allLinks && allLinks.length > 0 ? (
            allLinks.map((item) => (
              <div key={item._id} className="w-full max-w-md">
                <LinkCard
                  id={item._id}
                  title={item.name}
                  link={item.url}
                  icon={item.name.toLowerCase()}
                  onDelete={handleDelete}
                />
              </div>
            ))
          ) : (
            <p>No links available.</p>
          )}

          <button
    onClick={generateLinkTree} // Add this click handler
    className="bg-primary rounded-[50px] text-white font-semibold p-3 hover:bg-slate-100 hover:text-primary cursor-pointer"
>
    Generate Linktree
</button>

        </div>

        

        
      </div>
<Modal
  isOpen={openAddModal.isShown}
  onRequestClose={() => setOpenAddModal({ isShown: false, data: null })}
  style={{
    overlay: {
      backgroundColor: "rgba(0,0,0,0.2)",
      zIndex: 999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    
  }}
  className={"model-box"}
>
  <AddLink
    onClose={() => setOpenAddModal({ isShown: false, data: null })}
    refreshLinks={getAllLinks} // Refresh the list after adding
  />
</Modal>

  <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-400 hover:bg-purple-900 fixed right-10 bottom-10"
        onClick={()=>setOpenAddModal({isShown:true,data:null})}
        >
        <MdAdd className="text-[32px] text-white" />
      </button>
    </>
  
  );
};

export default Home;
