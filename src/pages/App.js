import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { decodeToken } from "react-jwt";
import Navbar from "./Navbar";
import Home from "./Home";
import Create from "./Create";
import RecipeDetails from "./RecipeDetails";
import NotFound from "./NotFound";
import Register from "./Register";
import Login from "./Login";
import UserDetails from "./UserDetails";
import UserContext from "../contexts/UserContext";
import RecipeEdit from "./RecipeEdit";
import AdminPanel from "./AdminPanel";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const login = (userData) => {
    setUserInfo(userData);
  };
  const logout = () => {
    Cookies.remove("JWT");
    console.log(userInfo);
    setUserInfo(null);
  };

  useEffect(() => {
    if (Cookies.get("JWT")) {
      login({
        userId: decodeToken(Cookies.get("JWT")).UserId,
        role: decodeToken(Cookies.get("JWT")).Role,
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, login, logout }}>
      <Router>
        <div className="App">
          <Navbar />
          <div className="content">
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/register">
                <Register />
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/create">
                <Create />
              </Route>
              <Route path="/recipes/:id">
                <RecipeDetails />
              </Route>
              <Route path="/users/:id">
                <UserDetails />
              </Route>
              <Route path="/edit/:id">
                <RecipeEdit />
              </Route>
              <Route path="/admin">
                <AdminPanel />
              </Route>
              <Route path="*">
                <NotFound />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
