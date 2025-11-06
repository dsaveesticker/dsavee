import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/style.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/products");
    } catch (err) {
      console.error("Email login error:", err);
      setError("Email atau password salah.");
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      // membuka popup Google -> Firebase akan membuat user jika pertama kali
      await signInWithPopup(auth, provider);
      navigate("/products");
    } catch (err) {
      console.error("Google sign-in error:", err);
      // Pesan error yang lebih ramah
      if (err.code === "auth/popup-closed-by-user") {
        setError("Popup ditutup. Coba lagi.");
      } else if (err.code === "auth/cancelled-popup-request") {
        setError("Permintaan popup dibatalkan. Coba lagi.");
      } else if (err.code === "auth/account-exists-with-different-credential") {
        setError(
          "Akun sudah ada dengan metode sign-in lain. Silakan gunakan metode tersebut dan link akun di pengaturan."
        );
      } else {
        setError("Gagal login dengan Google. Coba lagi.");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit">Login</button>
      </form>

      <div style={{ marginTop: 12 }}>
        {/* Tombol Google */}
        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleSignIn}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          {/* Bisa ganti dengan icon Google jika mau */}
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            width="20"
            height="20"
            style={{ display: "inline-block" }}
          />
          Sign in with Google
        </button>
      </div>

      <p style={{ marginTop: 12 }}>
        Belum punya akun? <Link to="/signup">Daftar</Link>
      </p>
    </div>
  );
};

export default Login;
