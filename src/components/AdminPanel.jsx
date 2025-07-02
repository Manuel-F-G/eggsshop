import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function AdminPanel() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [disponible, setDisponible] = useState(true);
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "productos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const prods = [];
      querySnapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...doc.data() });
      });
      setProductos(prods);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !descripcion || !imagen) {
      setMensaje("Completa todos los campos.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", imagen);
      formData.append("upload_preset", "unsigned_preset");
      formData.append("folder", "productos");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/davyruvih/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Error al subir la imagen a Cloudinary");
      }

      const imagenURL = data.secure_url;

      await addDoc(collection(db, "productos"), {
        nombre,
        descripcion,
        disponible,
        imagenURL,
        fecha: Timestamp.now(),
      });

      setMensaje("Producto subido con éxito ✅");
      setNombre("");
      setDescripcion("");
      setDisponible(true);
      setImagen(null);
    } catch (error) {
      console.error("Error al subir producto:", error);
      setMensaje("Error al subir producto ❌");
    }
  };

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "productos", id));
      setMensaje("Producto eliminado ✅");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setMensaje("Error al eliminar producto ❌");
    }
  };

  const toggleDisponible = async (id, nuevoEstado) => {
    try {
      const docRef = doc(db, "productos", id);
      await updateDoc(docRef, { disponible: nuevoEstado });
      setMensaje("Estado actualizado ✅");
    } catch (error) {
      console.error("Error al actualizar disponibilidad:", error);
      setMensaje("Error al actualizar disponibilidad ❌");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <div style={{ textAlign: "right", marginBottom: "1rem" }}>
        <button onClick={handleLogout} style={{ background: "#333", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: "4px" }}>
          Cerrar sesión
        </button>
      </div>

      <h2>Panel de Administración</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label style={{ display: "block", marginBottom: "1rem" }}>
          ¿Disponible?
          <input
            type="checkbox"
            checked={disponible}
            onChange={(e) => setDisponible(e.target.checked)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>

        <input
          type="file"
          onChange={(e) => setImagen(e.target.files[0])}
          accept="image/*"
          style={{ marginBottom: "1rem" }}
        />

        <button type="submit" style={{ width: "100%" }}>
          Subir producto
        </button>
      </form>

      <p>{mensaje}</p>

      <h3>Productos existentes</h3>
      {productos.length === 0 && <p>No hay productos aún.</p>}
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
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
            <div style={{ flex: 1 }}>
              <strong>{nombre}</strong>
              <p>{descripcion}</p>
              <label>
                <input
                  type="checkbox"
                  checked={disponible}
                  onChange={(e) => toggleDisponible(id, e.target.checked)}
                  style={{ marginRight: "0.5rem" }}
                />
                {disponible ? "Disponible" : "No disponible"}
              </label>
            </div>
            <button
              onClick={() => eliminarProducto(id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "0.5rem 1rem",
                cursor: "pointer",
              }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
