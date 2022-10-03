import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "../../styles/Login.module.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const router = useRouter();

  const handleClick = async () => {
    try {
      await axios.post("http://localhost:3000/api/login", {
        username,
        password,
      });
      router.push("/admin");
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Admin</title>
        <meta name="description" content="Best pizza shop in town" />
        <link rel="icon" href="/img/pizza-icon.png" />
      </Head>

      <div className={styles.container}>
        <div className={styles.wrapper}>
          <h1>Admin Dashboard</h1>
          <input
            placeholder="username"
            className={styles.input}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="password"
            type="password"
            className={styles.input}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleClick} className={styles.button}>
            Sign In
          </button>
          {error && <span className={styles.error}>Wrong Credentials!</span>}
        </div>
      </div>
    </>
  );
};

export default Login;
