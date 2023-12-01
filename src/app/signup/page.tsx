import Link from "next/link";
import Image from 'next/image';
import { getPieceSrc } from '@/helpers/images';
import { useState } from 'react';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User registered:', data.user);
        // Optionally, you can redirect the user to a success page or perform other actions
      } else {
        console.error('Registration failed:', response.statusText);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
        <div className="w-full p-6 bg-white rounded-md shadow-xl lg:max-w-xl border">
        <div className="flex justify-center">
            <div className="text-4xl font-extrabold text-center text-gray-800 not-italic">Next Chess</div>
            <Image
                className="flex-none rounded-full ml-2"
                src={getPieceSrc("b", "q")}
                alt="Chess Piece"
                width={45}
                height={45}
            />
        </div>
        <form className="mt-4" onSubmit={handleSubmit}>
            <div className="mb-4">
                <div className="mb-4">
                    <label
                    htmlFor="username"
                    className="block text-lg font-bold text-gray-700"
                    >
                    Username
                    </label>
                    <input
                    type="username"
                    className="block w-full px-2 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:border-gray-800 focus:ring-gray-300"
                    />
                </div>
            </div>
            <div className="mb-">
                <label
                htmlFor="password"
                className="block text-lg font-bold text-gray-700"
                >
                Password
                </label>
                <input
                type="password"
                className="block w-full px-2 py-2 mt-2 mb-2 text-gray-700 bg-white border rounded-lg focus:border-gray-800 focus:ring-gray-300"
                />
            </div>
            <div className="mb-">
            <label
              htmlFor="password"
              className="block text-lg font-bold text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              className="block w-full px-2 py-2 mt-2 mb-2 text-gray-700 bg-white border rounded-lg focus:border-gray-800 focus:ring-gray-300"
            />
          </div>
            <div className="mb-">
            <label
              htmlFor="email"
              className="block text-lg font-bold text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              className="block w-full px-2 py-2 mt-2 mb-2 text-gray-700 bg-white border rounded-lg focus:border-gray-800 focus:ring-gray-300"
            />
          </div>
          <div className="mt-2">
           <Link href="/">
                <button className="w-full mt-6 px-4 py-2 font-bold text-white bg-gray-700 rounded-md hover:bg-gray-500">
                    Sign Up
                </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}