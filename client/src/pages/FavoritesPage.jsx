import React from "react";
import Favorites from "../components/Favorites";

export default function FavoritesPage() {
    console.log("FavoritesPage FavoritesPage");
  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-xl font-semibold">Your Favorites</h1>
      {/* Adjust the endpoint if your route is mounted differently (e.g. "/favorites") */}
      <Favorites endpoint="/favorites" />
    </div>
  );
}