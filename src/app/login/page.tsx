"use client";
import Link from "next/link";
import {useContext, useEffect, useState} from 'react';
import BlackQueen from "@/components/icons/ChessPiece/BlackQueen";
import { useRouter } from "next/navigation";
import {UserContext} from "@/context/UserContext";

function Login() {

  const [formData, setFormData] = useState({
    "user_name": "",
    "password": ""
  });

  const [havepw, sethavepw] = useState(true);
  const [haveun, sethaveun] = useState(true);
  const [check, setcheck] = useState(true);
  const router = useRouter();
  const {checkLogin} = useContext(UserContext);
  
  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      router.push('/profile');
    }
  },[])
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let err = false;
    if(formData['user_name'] == "") {
      sethaveun(false);
      err = true
    }
    else sethaveun(true);
    if(formData['password'] == "") {
      sethavepw(false);
      err = true;
    }
    else sethavepw(true);
    if(err) return;
    try {
      const response = await fetch(`http://localhost:8000` + "/api/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        const token = data.data.accessToken;
        if (token) {
          localStorage.setItem('accessToken', token);
        }
        setcheck(true);
        if (checkLogin) {
          await checkLogin();
        }
      } else {
        console.error('Login failed:', response.statusText);
        setcheck(false);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
    router.push('/profile');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
        <div className="w-full p-6 bg-white rounded-md shadow-xl lg:max-w-xl border">
        <div className="flex justify-center">
            <div className="text-4xl font-extrabold text-center text-gray-800 not-italic">Next Chess</div>
          <BlackQueen width={45} height={45} />
        </div>
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-lg font-bold text-gray-700"
            >
              Username
            </label>
            <input
              type="username"
              name="user_name"
              onChange={handleChange}
              className="block w-full px-2 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:border-gray-800 focus:ring-gray-300"
            />
            {!haveun && (<p className="text-red-500 text-sm">Enter your Username.</p>)}
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
              name="password"
              onChange={handleChange}
              className="block w-full px-2 py-2 mt-2 mb-2 text-gray-700 bg-white border rounded-lg focus:border-gray-800 focus:ring-gray-300"
            />
            {!havepw && (<p className="text-red-500 text-sm">Enter your Password.</p>)}
            {!check && (<p className="text-red-500 text-sm">UserName or Password is wrong.</p>)}
          </div>
          <Link
            href="/forget"
            className="text-base text-blue-700 hover:underline font-semibold"
          >
            Forget Password?
          </Link>
          <div className="mt-2">
                <button className="w-full px-4 py-2 font-bold text-white bg-gray-700 rounded-md hover:bg-gray-500">
                    Login
                </button>
          </div>
        </form>
        <div className="relative flex items-center justify-center w-full mt-6 border border-t">
            <div className="absolute px-5 bg-white font-bold">Or</div>
        </div>
        <div className="flex mt-6 gap-x-6">
            <button
                type="button"
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-slate-400 duration-300 flex items-center justify-center w-full p-2  border border-gray-800 rounded-lg"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    className="w-5 h-5 fill-current"
                >
                    <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
                </svg>
            </button>
            <button className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-slate-400 duration-300 flex items-center justify-center w-full p-2  border border-gray-800 rounded-lg">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    className="w-5 h-5 fill-current"
                >
                    <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z"></path>
                </svg>
            </button>
        </div>

        <p className="mt-4 text-base text-center text-gray-700">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-base text-blue-700 hover:underline font-semibold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
