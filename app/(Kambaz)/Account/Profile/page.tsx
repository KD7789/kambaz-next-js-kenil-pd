"use client";
import { redirect } from "next/dist/client/components/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import { Button, FormControl } from "react-bootstrap";
import * as client from "../client";   

interface UserProfile {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  role: "USER" | "ADMIN" | "FACULTY" | "STUDENT" | "TA";
  loginId?: string;
  section?: string;
  lastActivity?: string;
  totalActivity?: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const fetchProfile = () => {
    if (!currentUser) return redirect("/Account/Signin");
    setProfile(currentUser as UserProfile);
  };

  const updateProfile = async () => {
    if (!profile) return;
    const updatedProfile = await client.updateUser(profile);
    dispatch(setCurrentUser(updatedProfile));
    alert("Profile updated successfully!");
  };

  const signout = async () => {
    await client.signout();           
    dispatch(setCurrentUser(null));    
    redirect("/Account/Signin");       
  };  

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="wd-profile-screen" style={{ marginLeft: "30px" }}>
        <h3>Profile</h3>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="wd-profile-screen" style={{ marginLeft: "30px" }}>
      <h3>Profile</h3>

      <FormControl
        id="wd-username"
        className="mb-2"
        value={profile.username}
        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
      />

      <FormControl
        id="wd-password"
        className="mb-2"
        type="password"
        value={profile.password}
        onChange={(e) => setProfile({ ...profile, password: e.target.value })}
      />

      <FormControl
        id="wd-firstname"
        className="mb-2"
        value={profile.firstName}
        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
      />

      <FormControl
        id="wd-lastname"
        className="mb-2"
        value={profile.lastName}
        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
      />

      <FormControl
        id="wd-dob"
        className="mb-2"
        type="date"
        value={profile.dob?.split("T")[0] ?? profile.dob}
        onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
      />

      <FormControl
        id="wd-email"
        className="mb-2"
        value={profile.email}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
      />

      <select
        className="form-control mb-2"
        id="wd-role"
        value={profile.role}
        onChange={(e) =>
          setProfile({
            ...profile,
            role: e.target.value as UserProfile["role"],
          })
        }
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
        <option value="TA">TA</option>
      </select>

      <Button className="w-100 mb-2 btn-primary" onClick={updateProfile}>
        Update
      </Button>

      <Button onClick={signout} className="w-100 mb-2" id="wd-signout-btn">
  Sign out
</Button>

    </div>
  );
}