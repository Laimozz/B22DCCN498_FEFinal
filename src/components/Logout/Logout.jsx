import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function Logout({setTrigger}){
    const [message, setMessage] = useState("");
    const token = localStorage.getItem("token")
    const nav = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8081/api/admin/logout", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                if(!res.ok){
                    if(res.status === 401 || res.status === 403){
                        setTrigger((pre) => (!pre));
                        nav("/login");
                    }
                }
                const data = await res.json();
                setMessage(data.message);
                setTrigger((pre) => (!pre));
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                nav("/login");
                return;
            } catch (error) {
                setMessage(error);
            }
        }
        fetchData();
    }, [])

    return (<div>{message}</div>);
}

export default Logout;