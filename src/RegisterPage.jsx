import { useState } from "react";
import axios from "axios";

function RegisterPage({ setShowLogin }) {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/users/register`, formData)
      .then((res) => {
        console.log("Registro exitoso:", res.data);
        alert("Registro exitoso, ahora puedes iniciar sesión");
        setShowLogin(true);
      })
      .catch((err) => {
        console.error("Error al registrar:", err.response?.data || err.message);
        setError("Error al registrar. Intenta con otro email.");
      });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center text-purple-400 mb-6">Registrarse</h2>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-6 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded transition duration-300"
        >
          Registrarse
        </button>

        <p className="text-center text-gray-400 mt-4">
          ¿Ya tienes una cuenta?{" "}
          <button
            type="button"
            onClick={() => setShowLogin(true)}
            className="text-red-400 hover:underline"
          >
            Iniciar Sesión
          </button>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
