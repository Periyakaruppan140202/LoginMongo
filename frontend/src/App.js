import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [datas, setDatas] = useState({ message: "Forbidden" });
  return (
    <div className="App">
      <header className="App-header">
        <div className="h-32">
          <div className="float-left">
            <label htmlFor="username" className="px-2 float-left my-2">
              Username:
            </label>
            <br />
            <label htmlFor="password" className="px-2 float-left my-2">
              Password:
            </label>
          </div>
          <div className="float-right">
            <input
              type="text"
              name="username"
              className="float-right my-2 rounded-sm text-black"
              id="username"
            />
            <br></br>
            <input
              type="password"
              name="password"
              className="float-right my-2 rounded-sm text-black"
              id="password"
            />
            <br></br>
          </div>
        </div>

        <button
          className="px-3 py-1 border-2 bg-react border-react rounded-sm"
          onClick={async () => {
            const response = await fetch("http://localhost:3000/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: document.getElementById("username").value,
                password: document.getElementById("password").value,
              }),
            });
            const json = await response.json().then((data) => {
              localStorage.setItem("token", data.token);
              console.log(data.token);
            });
          }}
        >
          Login
        </button>
        <button
          className="px-3 my-2 py-1 border-2 bg-react border-react rounded-sm"
          onClick={async () => {
            const response = await fetch("http://localhost:3000/api", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            const json = await response.json();
            console.log(json);
            setDatas(json);
          }}
        >
          Go to Post
        </button>
        <div id="space">
          {datas.message != "Forbidden"
            ? datas.authData.user.username
            : `Logged Out`}
        </div>
      </header>
    </div>
  );
}

export default App;
