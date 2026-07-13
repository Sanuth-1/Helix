import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-helix-700 text-white transition-opacity duration-500">
      <i className="fas fa-dna text-6xl animate-spin-slow mb-4 text-purple-300"></i>
      <h2 className="text-3xl font-bold tracking-tight">Helix</h2>
      <p className="text-sm opacity-70 mt-2 font-light">Initializing Portal...</p>
    </div>
  );
}