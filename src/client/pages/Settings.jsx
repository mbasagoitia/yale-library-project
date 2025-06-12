import { useState } from "react";
import FolderSelectButton from "../components/FolderSelectButton";
import addNewAdmin from "../helpers/addNewAdmin";

const Settings = () => {

    const [adminInfo, setAdminInfo] = useState({
        name: "",
        netid: ""
    });

    const handleAddAdmin = (e) => {
        if (adminInfo.name && adminInfo.netid) {
            e.preventDefault();
            addNewAdmin(adminInfo);
        }
        else {
            alert("Please make sure to fill out all fields.")
        }
    }

   return (
    <div className="settings">
        <h1>Settings</h1>
        <div>
            <h2>Set Digital Catalogue Folder</h2>
            <FolderSelectButton />
        </div>
            <h2>Add New Admin</h2>
            <label htmlFor="nameInput">Name</label>
            <input type="text" name="name" id="nameInput" value={adminInfo.name} onChange={(e) => setAdminInfo({...adminInfo, name: e.target.value})} />
            <label htmlFor="netidInput">NetID   </label>
            <input type="text" name="netid" id="netidInput" value={adminInfo.netid} onChange={(e) => setAdminInfo({...adminInfo, netid: e.target.value})} />
            <button onClick={handleAddAdmin}>Add New Admin</button>
    </div>
   )
}

export default Settings;