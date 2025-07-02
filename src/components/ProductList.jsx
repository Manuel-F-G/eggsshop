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
    <div style={{ maxWidth: 800, margin: "auto", padding: "2rem" }}>
      <h2>Productos disponibles</h2>
      {productos.length === 0 && <p>No hay productos por el momento.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {productos.map(({ id, nombre, descripcion, disponible, imagenURL }) => (
          <li
            key={id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <img
              src={imagenURL}
              alt={nombre}
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
            <div style={{ flex: 1 }}>
              <strong>{nombre}</strong>
              <p>{descripcion}</p>
              <p>
                <em>{disponible ? "Disponible" : "No disponible"}</em>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
