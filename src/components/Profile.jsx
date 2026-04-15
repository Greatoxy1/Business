import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function Profile() {
  const { user, login } = useContext(UserContext);

  const [profile, setProfile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

 useEffect(() => {
  console.log("USER:", user);

  if (!user?._id) return;

  axios
    .get(`https://business-3-zwsk.onrender.com/profile/${user._id}`)
    .then((res) => {
      console.log("PROFILE DATA:", res.data);
      setProfile(res.data);
    })
    .catch((err) => console.error("PROFILE ERROR:", err));
}, [user]);

  // 🔥 image compression (reuse your function)
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 300;

          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
      };
    });
  };

  const handleUpdate = async () => {
    try {
      let avatarBase64 = profile.avatar;

      if (avatarFile) {
        avatarBase64 = await compressImage(avatarFile);
      }

      const res = await axios.put(
        `https://business-3-zwsk.onrender.com/profile/${user || user._id}`,
        {
          ...profile,
          avatar: avatarBase64,
        }
      );

      setProfile(res.data);
      login(res.data); // update context

      alert("Profile updated ✅");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

if (!user) return <p>Please log in or Create Profile</p>;
if (!profile) {
  return <p>No profile found or still loading...</p>;
}
  return (
    <div style={{ padding: 20 }}>
      <h2>👤 My Profile</h2>

      {/* Avatar */}
      <div>
        <img
          src={profile.avatar || "https://via.placeholder.com/100"}
          alt="avatar"
          width="100"
          style={{ borderRadius: "50%" }}
        />
        <br />
        <input type="file" onChange={(e) => setAvatarFile(e.target.files[0])} />
      </div>

      {/* Info */}
      <input
        value={profile.username}
        onChange={(e) =>
          setProfile({ ...profile, username: e.target.value })
        }
      />

      <input
        value={profile.country || ""}
        placeholder="Country"
        onChange={(e) =>
          setProfile({ ...profile, country: e.target.value })
        }
      />

      <input
        value={profile.city || ""}
        placeholder="City"
        onChange={(e) =>
          setProfile({ ...profile, city: e.target.value })
        }
      />

      <input
        value={profile.town || ""}
        placeholder="Town"
        onChange={(e) =>
          setProfile({ ...profile, town: e.target.value })
        }
      />

      <textarea
        placeholder="Bio"
        value={profile.bio || ""}
        onChange={(e) =>
          setProfile({ ...profile, bio: e.target.value })
        }
      />

      <button onClick={handleUpdate}>Save Changes</button>
    </div>
  );
}