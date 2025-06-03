import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {useForm} from "react-hook-form";
import './styles.css';

function LoginRegister({setTrigger}){
    const [tab, setTab] = useState("login");
    const [password, setPassword] = useState("");
    const [login_name, setLogin_name] = useState("");
    const [message, setMessage] = useState("");
    const nav = useNavigate();
    const {
        register: registerRegister,
        handleSubmit: handleRegisterSubmit,
        formState: { errors: registerErrors },
        reset: resetRegister,
    } = useForm();

    const loginHandle = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/admin/login`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    login_name: login_name,
                    password: password,
                })
            })
            if(!response.ok){
                setMessage("Failed to login.");
                return;
            }
            const data = await response.json();
            if(data.token){
                localStorage.setItem("token", data.token);
                localStorage.setItem("user_id", data.id);
                setTrigger((pre) => (!pre));
                console.log(localStorage.getItem("token"));
                console.log(data.id);
                nav(`/users/${data.id}`);
            }
            setMessage(data.message);
            return;
        } catch (error) {
            setMessage("Failed to login.");
        }
    }

    const onRegisterSubmit = async (data) => {
    try {
      const response = await fetch(`http://localhost:8081/api/user/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            login_name: data.login_name,
            first_name: data.first_name,
            last_name: data.last_name,
            password: data.password,
            repassword: data.repassword,
            location: data.location,
            occupation: data.occupation,
            description: data.description
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.message);
        return;
      }
      const responseData = await response.json();
      setMessage(`Register Successfull! Login name: ${responseData.login_name}`);
      localStorage.setItem("token", responseData.token);
      localStorage.setItem("user_id", responseData.id);
      resetRegister(); 
    } catch (error) {
      setMessage("Failed to register.");
    }
  };

    return (
        <div className="login-register-container">
            {tab === "login" && (
                <div className="login-form">
                    <p>
                        Login_name: 
                        <input type="text" className="login-input" onChange={(e) => setLogin_name(e.target.value)} />
                    </p>
                    <p>
                        Password: 
                        <input type="password" className="login-input" onChange={(e) => setPassword(e.target.value)} />
                    </p>
                    <button className="login-button" onClick={() => loginHandle()}>Login</button>
                    <p className="message">{message}</p>
                </div>
            )}

            {tab === "register" && (
                <div className="register-form">
                    <form onSubmit={handleRegisterSubmit(onRegisterSubmit)}>
                        <p>
                            Login name: 
                            <input type="text" className="register-input" {...registerRegister("login_name", { required: "Login name is required." })} />
                            {registerErrors.login_name && <span className="error">{registerErrors.login_name.message}</span>}
                        </p>
                        <p>
                            Password: 
                            <input type="password" className="register-input" {...registerRegister("password", { required: "Password is required." })} />
                            {registerErrors.password && <span className="error">{registerErrors.password.message}</span>}
                        </p>
                        <p>
                            Xác nhận password: 
                            <input type="password" className="register-input" {...registerRegister("repassword", { required: "Repassword is required." })} />
                            {registerErrors.repassword && <span className="error">{registerErrors.repassword.message}</span>}
                        </p>
                        <p>
                            First name: 
                            <input type="text" className="register-input" {...registerRegister("first_name", { required: "First name is required." })} />
                            {registerErrors.first_name && <span className="error">{registerErrors.first_name.message}</span>}
                        </p>
                        <p>
                            Last name: 
                            <input type="text" className="register-input" {...registerRegister("last_name", { required: "Last name is required." })} />
                            {registerErrors.last_name && <span className="error">{registerErrors.last_name.message}</span>}
                        </p>
                        <p>
                            Location: 
                            <input type="text" className="register-input" {...registerRegister("location")} />
                        </p>
                        <p>
                            Description: 
                            <input type="text" className="register-input" {...registerRegister("description")} />
                        </p>
                        <p>
                            Occupation: 
                            <input type="text" className="register-input" {...registerRegister("occupation")} />
                        </p>
                        <p>
                            <button type="submit" className="register-button">Register</button>
                        </p>
                    </form>
                    <p className="message">{message}</p>
                </div>
            )}

            <div className="switch-tab">
                <button className="tab-button" onClick={() => setTab("login")}>Login</button>
                <button className="tab-button" onClick={() => setTab("register")}>Register</button>
            </div>
        </div>
    );
}

export default LoginRegister;