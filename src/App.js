import './App.css';

import React, { useState, useEffect } from "react";  
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginReigister from "./components/LoginRegister/LoginRegister";
import Logout from "./components/Logout/Logout";

const App = () => {
  const [user_id, setUser_id] = useState();
  const [token, setToken] = useState();
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    setUser_id(localStorage.getItem("user_id") ? localStorage.getItem("user_id") : null);
    setToken(localStorage.getItem("token") ? localStorage.getItem("token"): null);
    console.log(token);
  }, [trigger])

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar />
          </Grid>
          
          <div className="main-topbar-buffer" />
          
          <Grid item sm={3}>
            <Paper className="main-grid-item">
               {token && <UserList/>}
            </Paper>
          </Grid>

          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                <Route path="/" element={<Navigate to="/users" />} />
                {/* <Route path="/users" element={<UserList />} /> */}
                <Route path="/users/:userId" element={<UserDetail />} />
                <Route path="/photos/:userId" element={<UserPhotos/>} />
                <Route path='/login' element={<LoginReigister setTrigger={setTrigger}/>}/>
                <Route path='/logout' element={<Logout setTrigger={setTrigger}/>}/>
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
};

export default App;
