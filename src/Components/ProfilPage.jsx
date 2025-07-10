import React from "react";
import './ProfilePage.css';

const ProfilePage = () => {
  const user = {
    nama: "Kurnia Rizki Fadilah",
    email: "kurnia@example.com",
    telepon: "0812-3456-7890",
    bio: "Seorang developer yang berdedikasi membangun solusi berbasis web modern.",
    foto: "https://via.placeholder.com/120"
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-left">
          <img src={user.foto} alt="Foto Profil" className="profile-img" />
        </div>
        <div className="profile-right">
          <h2 className="profile-name">{user.nama}</h2>
          <p className="profile-email">📧 {user.email}</p>
          <p className="profile-phone">📱 {user.telepon}</p>
          <p className="profile-bio">{user.bio}</p>
          <button className="btn-edit">Edit Profil</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
