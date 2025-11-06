import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/style.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (password.length < 8) return "Password minimal 8 karakter.";
    if (!/[A-Z]/.test(password)) return "Harus mengandung huruf besar.";
    if (!/[a-z]/.test(password)) return "Harus mengandung huruf kecil.";
    if (!/[0-9]/.test(password)) return "Harus mengandung angka.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { email, password, confirmPassword } = formData;

    const validationError = validatePassword(password);
    if (validationError) return setError(validationError);
    if (password !== confirmPassword) return setError("Password tidak cocok.");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // setelah signup via email, arahkan ke halaman login atau langsung ke beranda
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  // === Google Sign-In ===
  const handleGoogleSignIn = async () => {
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // user berhasil login dengan Google
      // result.user berisi info user; kamu bisa simpan ke DB jika mau
      navigate("/"); // arahkan ke beranda / dashboard setelah login
    } catch (err) {
      // beberapa kemungkinan error: popup-closed-by-user, auth/popup-blocked, dll.
      setError(err.message || "Gagal login dengan Google.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        {/* Password */}
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="password-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({
                ...formData,
                confirmPassword: e.target.value,
              })
            }
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit">Daftar</button>
      </form>

      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="google-btn"
          style={{ cursor: "pointer" }}
        >
          Masuk dengan Google
        </button>
      </div>

      <p style={{ marginTop: 12 }}>
        Sudah punya akun? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignUp;
