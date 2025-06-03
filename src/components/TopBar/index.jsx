import React, { useEffect, useState, useRef } from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import './styles.css';

function TopBar() {
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState();
  const inputRef = useRef(null);
  const nav = useNavigate();

  const addPhotoHandle = async () => {

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch("http://localhost:8081/api/photo/photos/new", {
        method: "POST" ,
        headers : {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      if(!res.ok){
        if(res.status === 401 || res.status === 403){
          nav("/login");
        }
        else {
          const data = await res.json();
          setMessage(data.message);
          return;
        }
      }
      const data = await res.json();
      setFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      nav(`/photos/${user_id}`)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
      const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/user/${user_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if(!response.ok){
          return;
        }
        const data = await response.json();
        setUser(data);
        return;
      } catch (error) {
        console.log(error);
      }
    }
    fetchUser();
  }, [user_id])


 return (
  <AppBar position="absolute" className="topbar-appbar">
    <Toolbar className="topbar-toolbar">
      {/* Trái: Username */}
      <Box className="topbar-left">
        <Typography variant="h6" className="topbar-username">
          {token ? "Hello " + user?.first_name : "PhotoShare"}
        </Typography>
      </Box>

      {/* Giữa: Add Photo */}
      {token && <Box className="topbar-center">
        <div className="photo-upload">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="photo-upload-input"
            ref={inputRef}
          />
          <button onClick={addPhotoHandle} className="photo-upload-button">
            Add Photo
          </button>
          <p>{message}</p>
        </div>
      </Box> }

      {/* Phải: Login / Logout */}
      <Box className="topbar-right">
        <Typography variant="h6" className="topbar-context">
          {!token ? (
            <Link to="/login" className="topbar-link">
              Please Login
            </Link>
          ) : (
            <Link to="/logout" className="topbar-link">
              Logout
            </Link>
          )}
        </Typography>
      </Box>
    </Toolbar>
  </AppBar>
);

}

export default TopBar;