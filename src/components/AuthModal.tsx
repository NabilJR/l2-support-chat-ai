"use client";

import { useState, FormEvent } from 'react';

interface AuthModalProps {
  onAuthenticate: (token: string) => void;
}

export default function AuthModal({ onAuthenticate }: AuthModalProps) {
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onAuthenticate(token);
      setError(null);
    } else {
      setError('Token tidak boleh kosong.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-96 max-w-full m-4">
        <h2 className="text-2xl font-bold text-white mb-4">Masukkan Token Akses</h2>
        <p className="text-gray-300 mb-6">Untuk melanjutkan, silakan masukkan token akses Anda.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Token Akses"
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}