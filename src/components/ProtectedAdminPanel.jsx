import { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import AdminPanel from "./AdminPanel";

export default function ProtectedAdminPanel() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError("Correo o contraseña incorrectos");
    }
  };

  if (user) {
    return <AdminPanel />;
  }

  return (
    <div style={{ maxWidth: 300, margin: "auto", padding: "2rem" }}>
      <h2>Login - Panel de Administración</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <button type="submit" style={{ width: "100%" }}>
          Entrar
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
