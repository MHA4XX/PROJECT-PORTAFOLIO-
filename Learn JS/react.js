import React, { useState } from "react";
import Parse from "parse";

const CreateProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Manejador de cambios en el formulario
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Función para guardar el producto en Back4App
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const Product = new Parse.Object("Products");
      Product.set("name", product.name);
      Product.set("price", parseFloat(product.price));
      Product.set("description", product.description);
      Product.set("image", product.image);

      await Product.save();
      setMessage("Producto creado con éxito!");
      setProduct({ name: "", price: "", description: "", image: "" });
    } catch (error) {
      setMessage("Error al crear el producto.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Crear Nuevo Producto</h2>
      {message && <p className="text-green-500">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nombre del Producto</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Precio</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Descripción</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Imagen (URL)</label>
          <input
            type="text"
            name="image"
            value={product.image}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Crear Producto"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;