import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import '../Css/Login.css';

export default function Login() {
  const Navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();

    fetch("https://localhost:7230/api/User/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: IdRef.current.value,
        password: PasswordRef.current.value,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message === "Login successful") {
          alert(`welcome ${IdRef.current.value}`);
          console.log(data.id);
          Navigate("/RecipeList", { state: { Id: data.id } });
        }
      });
  }

  const IdRef = useRef(null);
  const PasswordRef = useRef(null);

  return (
    <div className="container">
      <section id="content">
        <form onSubmit={onSubmit}>
          <h1>Login</h1>
          <div>
            <input type="text" placeholder="ID" required="" id="username" ref={IdRef} />
          </div>
          <div>
            <input type="password" placeholder="Password" required="" id="password" ref={PasswordRef} />
          </div>
          <div>
            <input type="submit" value="Log in" />
            <Link to="/Register" className="button_reg">Register</Link>
          </div>
        </form>
      </section>
    </div>
  );
}
