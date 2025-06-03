import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Typography } from "@mui/material";
import './styles.css';

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const nav = useNavigate();
  const [message, setMessage] = useState("");

  // Fetch user details from the backend API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          if(response.status === 401 || response.status === 403){
            nav("/login");
          }
          else {
            const data = await response.json();
            setMessage(data.message);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setMessage(error);
      }
    };

    fetchUser();
  }, [userId]);

   return (
    <div className="user-detail-container">
      {user ? (
        <>
          <Typography variant="h5" className="user-detail-title">
            User Details
          </Typography>
          <Typography variant="body1" className="user-detail-field">
            <strong>Name:</strong> {user.last_name}
          </Typography>
          <Typography variant="body1" className="user-detail-field">
            <strong>Location:</strong> {user.location}
          </Typography>
          <Typography variant="body1" className="user-detail-field">
            <strong>Description:</strong> {user.description}
          </Typography>
          <Typography variant="body1" className="user-detail-field">
            <strong>Occupation:</strong> {user.occupation}
          </Typography>
          <Link to={`/photos/${user._id}`} className="user-detail-link">
            View Photos
          </Link>
        </>
      ) : (
        <Typography variant="body1" className="user-detail-not-found">
          User not found!
        </Typography>
      )}
    </div>
  );
}

export default UserDetail;