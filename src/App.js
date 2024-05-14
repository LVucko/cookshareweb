import Navbar from './Navbar';
import Home from './Home';
import { BrowserRouter as Router,  Route, Switch } from 'react-router-dom';
import Create from './Create';
import RecipeDetails from './RecipeDetails';
import NotFound from './NotFound';
import Register from './Register';
import Login from './Login'
import UserDetails from './UserDetails'
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <div className = "content">
          <Switch>
            <Route exact path="/">
              <Home/>
            </Route>
            <Route exact path="/register">
              <Register/>
            </Route>
            <Route exact path="/login">
              <Login/>
            </Route>
            <Route exact path="/create">
              <Create/>
            </Route>
            <Route path="/recipes/:id">
              <RecipeDetails/>
            </Route >
            <Route path="/users/:id">
              <UserDetails/>
            </Route >
            <Route path="*">
             <NotFound/>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
