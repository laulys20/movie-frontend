import { useState } from "react";
import axios from "axios";

function LoginPage({ onLoginSuccess, setShowLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/users/login`, { email, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        onLoginSuccess();
      })
      .catch(() => {
        setError("Email o contraseña incorrectos");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold text-center mb-6 text-red-600">Iniciar Sesión</h2>

        {error && <div className="text-red-400 text-center mb-4">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-red-600 to-black hover:from-red-700 hover:to-gray-900 text-white font-bold py-2 rounded transition duration-300"
        >
          Entrar
        </button>

        <p className="text-center text-gray-400 mt-4">
          ¿No tienes una cuenta?{" "}
          <button
            type="button"
            onClick={() => setShowLogin(false)}
            className="text-purple-400 hover:underline"
          >
            Registrarse
          </button>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
