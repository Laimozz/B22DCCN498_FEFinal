import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState([]);
  const token = localStorage.getItem("token");
  const nav = useNavigate();

  // Fetch user list from the backend API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/user/list', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
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
        console.error('Error fetching users:', error);
        setMessage(error);
      }
    };

    fetchUsers();
  }, []);


  return (
    <div className="user-list-container">
      <List component="nav" className="user-list">
        {users.map((item) => (
          <div key={item._id} className="user-list-item-wrapper">
            <ListItem
              component={Link}
              to={`/users/${item._id}`}
              className="user-list-item"
            >
              <ListItemText primary={`${item.last_name}`} className="user-list-text" />
            </ListItem>
            <Divider className="user-list-divider" />
          </div>
        ))}
      </List>
    </div>
  );
};

export default UserList;