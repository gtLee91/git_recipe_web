import { Link, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import '../Css/Header.css';

export default function Header() {
  const navigate = useNavigate();
  const storedId = sessionStorage.getItem("userId");
  const userinfo = useFetch(`https://localhost:7230/api/User/${storedId}`);

  const logout = () => {
    sessionStorage.removeItem("userId");
    navigate("/");
  };
  return (
    <section id="hd_content">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          
          <h1>
            <Link to="/RecipeList" style={{fontSize:"45px"}}>Recipe Web</Link>
          </h1>
          
          <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/RecipeAdd">
              <button style={{ color: "black" }}>
                Add Recipe
              </button>
            </Link>
            <button onClick={logout} style={{ color: "black" }}>
              Logout
            </button>
          </div>

        </div>
    </section>
  );
}
