import { useEffect, useState } from "react";
import CommentList from "./CommentList";

const AdminPanel = () => {
    const [username, setUsername] = useState('')
    const [userComments, setUserComments] = useState();

    return (
        <div>
            <div>
                <h3>Dohvati korisnika:  </h3>
                <label>ID:</label>
                <input
                    type = "radio"
                    required
                    checked = {true}
                ></input>
                <label>Username:</label>
                <input
                    type = "radio"
                    required
                    checked = {true}
                ></input>
                <input 
                    type = "text" 
                    required 
                    value = {username} 
                    onChange = {(e) => setUsername(e.target.value)}
                ></input>
                <button >Pronađi korisnika</button>
            </div>
        </div>
    );
}
 
export default AdminPanel;