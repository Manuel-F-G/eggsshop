import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";

export default function ProductList() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "productos"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = [];
      snapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...doc.data() });
      });
      setProductos(prods);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#000",
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "'Orbitron', sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          textAlign: "center",
          padding: "2rem 1rem",
          borderBottom: "1px solid #fff700",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            color: "#fff700",
            textShadow: "0 0 8px #fff700",
          }}
        >
          Weboschop
        </h1>
      </header>

      {/* CONTENIDO */}
      <main style={{ maxWidth: 800, margin: "auto", padding: "2rem" }}>
        <h2 style={{ textShadow: "0 0 6px #fff700", color: "#fff700" }}>
          Productos disponibles
        </h2>

        {productos.length === 0 && <p>No hay productos por el momento.</p>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {productos
            .filter((p) => p.disponible)
            .map(({ id, nombre, descripcion, imagenURL, colorTexto }) => (
              <li
                key={id}
                style={{
                  border: "1px solid #fff700",
                  padding: "1rem",
                  marginBottom: "1.5rem",
                  borderRadius: "8px",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  backgroundColor: "#111",
                  boxShadow: "0 0 6px #fff70044",
                }}
              >
                <img
                  src={imagenURL}
                  alt={nombre}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <strong
                    style={{
                      fontSize: "1.3rem",
                      color: colorTexto || "#fff700",
                      textShadow: `0 0 6px ${colorTexto || "#fff700"}`,
                    }}
                  >
                    {nombre}
                  </strong>
                  <p style={{ color: "#fff" }}>{descripcion}</p>
                </div>
              </li>
            ))}
        </ul>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          textAlign: "center",
          padding: "1rem",
          borderTop: "1px solid #fff700",
          marginTop: "2rem",
          color: "#fff700",
          textShadow: "0 0 5px #fff700",
        }}
      >
        <p style={{ fontSize: "0.9rem" }}>
          © 2025 - Todos los derechos reservados
        </p>
      </footer>
    </div>
  );
}
