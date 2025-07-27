import { useEffect, useState } from "react";
import axios from "axios";
import LoginPage from "./Login"; 
import RegisterPage from "./RegisterPage";
import "./App.css";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/movies`;

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({ title: "", genre: "", year: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [editingMovie, setEditingMovie] = useState(null);
  const [editMovieData, setEditMovieData] = useState({ title: "", genre: "", year: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMovies(res.data);
        setIsAuthenticated(true);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleInputChange = (e) => {
    setNewMovie({ ...newMovie, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditMovieData({ ...editMovieData, [e.target.name]: e.target.value });
  };

  const handleAddMovie = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!newMovie.title || !newMovie.genre || !newMovie.year) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const newMovieData = {
      title: newMovie.title,
      genre: newMovie.genre,
      year: Number(newMovie.year),
    };

    axios
      .post(API_URL, newMovieData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        return axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      })
      .then((res) => {
        setMovies(res.data);
        setNewMovie({ title: "", genre: "", year: "" });
        setSuccessMessage("¡Película añadida correctamente!");
        setTimeout(() => setSuccessMessage(""), 2000);
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteMovie = (movieId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .delete(`${API_URL}/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setMovies(movies.filter((movie) => movie._id !== movieId));
      })
      .catch((err) => console.error(err));
  };

  const handleEditClick = (movie) => {
    setEditingMovie(movie._id);
    setEditMovieData({ title: movie.title, genre: movie.genre, year: movie.year });
  };

  const handleCancelEdit = () => {
    setEditingMovie(null);
    setEditMovieData({ title: "", genre: "", year: "" });
  };

  const handleSaveChanges = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .put(`${API_URL}/${editingMovie}`, editMovieData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        return axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      })
      .then((res) => {
        setMovies(res.data);
        handleCancelEdit();
      })
      .catch((err) => console.error(err));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setShowLogin(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        {showLogin ? (
          <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} setShowLogin={setShowLogin} />
        ) : (
          <RegisterPage setShowLogin={setShowLogin} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-end mb-6">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Cerrar sesión
        </button>
      </div>

      <h1 className="text-5xl font-extrabold text-red-600 text-center mb-10 tracking-wide">
        🎬 Mi Almacén de Pelis
      </h1>

      <div className="max-w-2xl mx-auto bg-gray-900 rounded-xl shadow-lg p-8 mb-10">
        <div className="space-y-4">
          {successMessage && (
            <div className="text-green-400 text-center font-semibold animate-bounce">
              {successMessage}
            </div>
          )}
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={newMovie.title}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="text"
            name="genre"
            placeholder="Género"
            value={newMovie.genre}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="number"
            name="year"
            placeholder="Año"
            value={newMovie.year}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleAddMovie}
            className="w-full bg-gradient-to-r from-red-600 to-black hover:from-red-700 hover:to-gray-900 text-white font-bold py-2 rounded transition duration-300"
          >
            Añadir Película
          </button>
        </div>
      </div>

      {editingMovie && (
        <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-xl mb-10">
          <h2 className="text-xl font-bold mb-4">Editar Película</h2>
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={editMovieData.title}
            onChange={handleEditInputChange}
            className="w-full p-3 mb-3 bg-gray-700 border border-gray-600 rounded"
          />
          <input
            type="text"
            name="genre"
            placeholder="Género"
            value={editMovieData.genre}
            onChange={handleEditInputChange}
            className="w-full p-3 mb-3 bg-gray-700 border border-gray-600 rounded"
          />
          <input
            type="number"
            name="year"
            placeholder="Año"
            value={editMovieData.year}
            onChange={handleEditInputChange}
            className="w-full p-3 mb-3 bg-gray-700 border border-gray-600 rounded"
          />
          <div className="flex gap-4">
            <button
              onClick={handleSaveChanges}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
            >
              Guardar cambios
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {movies.map((movie) => (
          <div
            key={movie._id}
            className="bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col justify-between hover:scale-105 transition-transform border-2 border-transparent hover:border-red-600"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
              <p className="text-gray-400 mb-1">
                🍿 <span className="font-semibold text-white">Género:</span> {movie.genre}
              </p>
              <p className="text-gray-400 mb-4">
                📅 <span className="font-semibold text-white">Año:</span> {movie.year}
              </p>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => handleEditClick(movie)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteMovie(movie._id)}
                className="bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
