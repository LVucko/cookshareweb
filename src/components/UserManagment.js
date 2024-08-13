import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Image } from "antd";
import { Space, Table, Tag, Input } from "antd";
import CommentList from "../components/CommentList";
import RecipeList from "../components/RecipeList";
import Loading from "./Loading";
import { Tabs, Select } from "antd";
import { isoDateToLocale, getJWT } from "../utils/utilities";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import UserEdit from "../pages/UserEdit";
const { TabPane } = Tabs;

const UserManagment = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [userComments, setUserComments] = useState("");
  const [userError, setUserError] = useState("");
  const [recipes, setRecipes] = useState("");
  const [newRole, setNewRole] = useState("USER");

  const history = useHistory();
  useEffect(() => {
    if (user) {
      fetchComments();
      fetchRecipes();
    }
  }, [user]);

  const handleRoleChange = (value) => {
    setNewRole(value);
  };

  function changeRole() {
    axios
      .post(
        "/api/users/" + user.id + "/role/" + newRole,
        {},
        {
          headers: { Authorization: "Bearer " + getJWT() },
        }
      )
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchComments() {
    axios
      .get("/api/users/" + user.id + "/comments", {
        headers: { Authorization: "Bearer " + getJWT() },
      })
      .then((response) => {
        setUserComments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchRecipes() {
    axios
      .get("/api/recipes/user/" + user.id)
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function getUser() {
    setUser(null);
    if (!username) {
      setUserError("Ime ne može biti prazno");
      return;
    }
    axios
      .get("/api/users/personal/username/" + username, {
        headers: { Authorization: "Bearer " + getJWT() },
      })
      .then((response) => {
        setUserError("");
        response.data.creationDate = isoDateToLocale(
          response.data.creationDate
        );
        setUser(response.data);
      })
      .catch((error) => {
        setUserError("Nepostoji korisnik s tim imenom!");
        setUser(null);
        console.log(error);
      });
  }
  return (
    <div className="user-information">
      <div className="tight-row">
        <label>Korisničko ime:</label>
        <Input
          style={{ width: "30%", marginLeft: "10px", marginRight: "10px" }}
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></Input>
        <Button onClick={getUser} type="primary">
          Dohvati
        </Button>
      </div>
      {userError && <h2>Greška: {userError}</h2>}
      {user && (
        <>
          {user && (
            <Tabs centered>
              <TabPane tab="Podaci o korisniku" key="1">
                <div className="row">
                  <div></div>
                  <div>
                    <h2>{user.username}</h2>
                    <p>Napravljen: {user.creationDate}</p>
                    <p>Email: {user.email}</p>
                    <p>Ime: {user.realName}</p>
                    <p>Telefon: {user.phone}</p>
                    <p>O meni: {user.about}</p>
                    <Image
                      width={200}
                      src={"/../../" + user.pathToPicture}
                      alt="Profile picture"
                    ></Image>
                  </div>
                  <div></div>
                </div>
              </TabPane>

              <TabPane tab="Komentari korisnika" key="2">
                {userComments && userComments.length !== 0 && (
                  <CommentList
                    comments={userComments}
                    fetchComments={fetchComments}
                    admin
                  />
                )}
              </TabPane>
              <TabPane tab="Recepti korisnika" key="3">
                {recipes && recipes.length !== 0 && (
                  <RecipeList recipes={recipes} />
                )}
              </TabPane>
              <TabPane tab="Uredi korisnika" key="4">
                <div className="tight-row">
                  <label>Nova uloga korisnika:</label>
                  <Select
                    defaultValue="USER"
                    style={{
                      width: 150,
                    }}
                    onChange={setNewRole}
                    options={[
                      {
                        value: "USER",
                        label: "USER",
                      },
                      {
                        value: "MODERATOR",
                        label: "MODERATOR",
                      },
                      {
                        value: "ADMIN",
                        label: "ADMIN",
                      },
                    ]}
                  ></Select>
                  <Button type="primary" onClick={changeRole}>
                    Promjeni
                  </Button>
                </div>
                <UserEdit id={user.id}></UserEdit>
              </TabPane>
            </Tabs>
          )}
        </>
      )}
    </div>
  );
};

export default UserManagment;
