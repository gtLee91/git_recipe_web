import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../Css/Login.css';

export default function User_Register() {
  const [isLoading, setIsLoading] = useState(false);
  const history = useNavigate();

  function onSubmit(e) {
    e.preventDefault();

    if (!isLoading) {
      setIsLoading(true);
      fetch(`https://localhost:7230/api/User/Register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: idRef.current.value,
          password: pwRef.current.value,
        }),
      }).then((res) => {
        if (res.ok) {
          alert("Registration success.");
          history("/");
          setIsLoading(false);
        } else if (res.status === 422) {
          alert("Already Exist same ID.");
          if (idRef.current) idRef.current.value = "";
          if (pwRef.current) pwRef.current.value = "";
          history("/Register");

          setIsLoading(false);
        }
      });
    }
  }

  const idRef = useRef(null);
  const pwRef = useRef(null);

  return (
    <div className="container">
      <section id="content">
        <form onSubmit={onSubmit}>
          <h1>Register</h1>
          <div>
            <input type="text" placeholder="ID" required="" id="username" ref={idRef} />
          </div>
          <div>
            <input type="password" placeholder="Password" required="" id="password" ref={pwRef} />
          </div>
          <div>
            <input type="submit" style={{ opacity: isLoading ? 0.3 : 1 }} value={isLoading ? "Registering..." : "Register"} />
            <Link to="/">
              <button className="backbutton" type="button">
                Back to Login
              </button>
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
