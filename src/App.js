import Login from "./component/Login";
import User_Register from "./component/User_Register";
import Recipe_List from "./component/Recipe_List";
import Recipe_Add from "./component/Recipe_Add";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={<User_Register />} />
          <Route path="/RecipeList" element={<Recipe_List />} />
          <Route path="/RecipeAdd" element={<Recipe_Add />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
