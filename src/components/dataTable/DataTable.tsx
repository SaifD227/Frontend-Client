"use client";

import { useState, useEffect } from "react";


interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

const DataTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: 0, quantity: 0 });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("https://backend-server-mkzqlowyp-saifd227s-projects.vercel.app/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const handleDelete = async (id: string) => {
    await fetch(`https://backend-server-mkzqlowyp-saifd227s-projects.vercel.app/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((product) => product._id !== id));
  };

  const handleAdd = async () => {
    const res = await fetch("https://backend-server-mkzqlowyp-saifd227s-projects.vercel.app/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    const data = await res.json();
    setProducts([...products, data]);
    setNewProduct({ name: "", description: "", price: 0, quantity: 0 });
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;
    await fetch(`https://backend-server-mkzqlowyp-saifd227s-projects.vercel.app/api/products/${editingProduct._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingProduct),
    });
    setProducts(products.map((p) => (p._id === editingProduct._id ? editingProduct : p)));
    setEditingProduct(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Product List</h2>

      {/* Add Product Form */}
      <div className="mb-4 flex gap-2">
        <input className="border p-2" type="text" placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
        <input className="border p-2" type="text" placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
        <input className="border p-2" type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: +e.target.value })} />
        <input className="border p-2" type="number" placeholder="Quantity" value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: +e.target.value })} />
        <button className="bg-blue-500 text-white px-4 py-2" onClick={handleAdd}>Add</button>
      </div>

      {/* Product Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border">
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">{product.description}</td>
              <td className="border p-2">${product.price}</td>
              <td className="border p-2">{product.quantity}</td>
              <td className="border p-2 flex gap-2">
                <button className="bg-red-500 text-white px-2 py-1" onClick={() => handleDelete(product._id)}>Delete</button>
                <button className="bg-yellow-500 text-white px-2 py-1" onClick={() => setEditingProduct(product)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Form */}
      {editingProduct && (
        <div className="mt-4 flex gap-2">
          <input className="border p-2" type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
          <input className="border p-2" type="text" value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />
          <input className="border p-2" type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: +e.target.value })} />
          <input className="border p-2" type="number" value={editingProduct.quantity} onChange={(e) => setEditingProduct({ ...editingProduct, quantity: +e.target.value })} />
          <button className="bg-green-500 text-white px-4 py-2" onClick={handleUpdate}>Update</button>
          <button className="bg-gray-500 text-white px-4 py-2" onClick={() => setEditingProduct(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
