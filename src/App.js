import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useState, useEffect } from 'react';

function App() {
  const [pizzas, setPizzas] = useState([]); // Pizzák tárolása
  const [loading, setLoading] = useState(true); // Betöltés állapota
  const [error, setError] = useState(null); // Hibaüzenet

  // Pizzák lekérése (GET kérés)
  useEffect(() => {
    fetch("https://pizza.kando-dev.eu/Pizza")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Hiba történt az adatok betöltésekor!");
        }
        return response.json();
      })
      .then((data) => {
        setPizzas(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Pizza törlése (DELETE kérés)
  const handleDelete = (id) => {
    if (window.confirm("Biztosan törölni szeretnéd ezt a pizzát?")) {
      fetch(`https://pizza.kando-dev.eu/Pizza/${id}`, { method: 'DELETE' })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Nem sikerült törölni a pizzát.");
          }
          // Törölt pizza eltávolítása a listából
          setPizzas(pizzas.filter((pizza) => pizza.id !== id));
          alert("A pizza törölve lett!");
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  };

  // Ha még betölt
  if (loading) {
    return <div className="text-center">Betöltés...</div>;
  }

  // Ha hiba történt
  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Pizza Admin Felület</h1>
      <div className="row">
        {pizzas.map((pizza) => (
          <div className="col-md-4" key={pizza.id}>
            <div className="card mb-4">
              {pizza.kepURL && (
                <img
                  src={pizza.kepURL}
                  className="card-img-top"
                  alt={pizza.name}
                  style={{ maxHeight: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{pizza.name}</h5>
                <p className="card-text">
                  {pizza.isGlutenFree === 1 ? "Gluténmentes" : "Nem gluténmentes"}
                </p>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(pizza.id)}
                >
                  🗑️ Törlés
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;