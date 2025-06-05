import React, { useEffect, useState } from "react";
import { Typography, Divider } from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import './styles.css';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString();
}

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [userComments, setUserComments] = useState({});
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const [content, setContent] = useState("");
  const [trigger, setTrigger] = useState(false);
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  const nav = useNavigate();

 const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState("");

const handleUpdate = async (photoId, commentId) => {
  const token = localStorage.getItem("token");
  await fetch(`http://localhost:8081/api/photo/${photoId}/comment/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ newComment: editText })
  });
  setEditing(null);
  setTrigger((pre) => !pre); // gọi lại ảnh để reload comment mới
};

const handleDelete = async (photoId, commentId) => {
  const confirm = window.confirm("Bạn có chắc muốn xóa comment này?");
  if (!confirm) return;
  try {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:8081/api/photo/${photoId}/comment/${commentId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    setTrigger(pre => !pre); // reload lại comment
  } catch (err) {
    console.error("Error deleting comment:", err);
  }
};

  //Fetch photos of the user
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const photoResponse = await fetch(`http://localhost:8081/api/photo/photosOfUser/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!photoResponse.ok) {
          if(photoResponse.status === 401 || photoResponse.status === 403){
            nav("/login");
          }
          else {
            const data = await photoResponse.json();
            setMessage(data.message);
            return;
          }
        }
        const photos = await photoResponse.json();
        setPhotos(photos);
      } catch (error) {
        setMessage(error);
      }
    };

    const fetchUser = async () => {
      try {
        const userResponse = await fetch(`http://localhost:8081/api/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!userResponse.ok){
          if(userResponse.status === 401 || userResponse.status === 403){
            nav("/login");
          }
          else {
            const data = await userResponse.json();
            setMessage(data.message);
            return;
          }
        }
        const user = await userResponse.json();
        setUser(user);
      } catch (error) {
        setMessage(error);
      }
    };

    fetchUser();
    fetchPhotos();
  }, [userId, trigger]);

  // Fetch user data for comments
  useEffect(() => {
    const userIds = new Set();

    photos.forEach((photo) => {
      photo.comments?.forEach((comment) => {
        if (comment.user_id && !userComments[comment.user_id]) {
          userIds.add(comment.user_id);
        }
      });
    });

    userIds.forEach(async (id) => {
      try {
        const res = await fetch(`http://localhost:8081/api/user/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) {
          if(res.status === 401 || res.status === 403){
            nav("/login");
          }
        }
        const user = await res.json();
        setUserComments((prev) => ({
          ...prev,
          [id]: user,
        }));
      } catch (error) {
        console.error("Error fetching user", id, error);
      }
    });
  }, [photos, trigger]);

  //
  const commentHandle = async (id) => {
    try {
      const res = await fetch(`http://localhost:8081/api/photo/commentsOfPhoto/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          comment: content,
          user_id: user_id
        })
      });
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
      setMessage(data.message);
      setTrigger((pre) => (!pre));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="photos-container">
      <h2 className="photos-title">Photos of User {user.last_name}</h2>
      {photos.map((photo) => (
        <div key={photo._id} className="photo-card">
          <img
            src={`http://localhost:8081/images/${photo.file_name}`}
            alt=""
            className="photo-image"
          />
          <p className="photo-date">Created: {formatDate(photo.date_time)}</p>
          <div className="photo-comments">
            {photo.comments?.map((comment) => {
              const user = userComments[comment.user_id];
              return (
                <div key={comment._id} className="photo-comment">
                  <p className="photo-comment-meta">
                    <strong>
                      <a
                        href={`/users/${comment.user_id}`}
                        className="photo-comment-user"
                      >
                        {user ? `${user.last_name}` : "Unknown User"}
                      </a>
                    </strong>{" "}
                    at {formatDate(comment.date_time)}:
                  </p>
                  <p className="photo-comment-text">{comment.comment}</p>
                 
                 {/*edit comment*/}
                  {user_id === comment.user_id && (
                  <button onClick={() => setEditing(comment._id)}>Edit</button>
                  )}
                  {editing === comment._id ? (
                  <div>
                  <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => handleUpdate(photo._id,comment._id)}>Save</button>
                  </div>
                  ) : (
                  <p>{comment.comment}</p> 
                  )}




              {user_id === comment.user_id && (
               <>
               <button onClick={() => handleDelete(photo._id, comment._id)}>Delete</button>
              </>
             )}
                </div>
              );
            })}
            <div className="comment-container">
              <label className="comment-label">
                Comment:
                <input
                  type="text"
                  className="comment-input"
                  onChange={(e) => setContent(e.target.value)}
                />
              </label>
              <button
                className="comment-button"
                onClick={() => commentHandle(photo._id)}
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserPhotos;
