import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
    return (
        <div className="flex h-screen w-screen font-sans relative">
            {/* Logo Kiri Atas */}
            <div className="absolute top-6 left-6 z-10">
                <img
                    src="/Logo Karisma Academy.png"
                    alt="Logo"
                    className="h-12 w-auto"
                />
            </div>

            {/* Kiri - Form Login */}
            <div className="w-full md:w-1/2 bg-white p-10 flex flex-col justify-center h-screen">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0A0A57] mb-8 text-center">
                    Login
                </h1>

                <form className="space-y-4">
                    <div className="relative w-full">
                        <input
                            type="email"
                            id="email"
                            placeholder=" "
                            className="text-black peer w-full border-2 border-[#0A0A57] rounded-xl px-4 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-[#0A0A57]"
                        />
                        <label
                            htmlFor="email"
                            className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-500"
                        >
                            Email
                        </label>
                    </div>
                    <div className="relative w-full">
                        <input
                            type="password"
                            id="password"
                            placeholder=" "
                            className="text-black peer w-full border-2 border-[#0A0A57] rounded-xl px-4 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-[#0A0A57]"
                        />
                        <label
                            htmlFor="password"
                            className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-500"
                        >
                            Password
                        </label>
                    </div>

                    <div className="text-lg text-[#0A0A57] cursor-pointer hover:underline">
                        Lupa kata sandi anda?
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-[#0A0A57] text-white font-semibold px-6 py-2 rounded-lg"
                        >
                            Log In
                        </button>
                    </div>
                </form>

                <div className="mt-4 text-lg text-center">
                    <span className="font-bold text-[#0A0A57]">Belum punya akun? </span>
                    <Link to="/register" className="text-[#0A0A57] underline cursor-pointer">Buat akun sekarang</Link>
                </div>
            </div>

            {/* Kanan - Brand */}
            <div className="hidden md:flex w-1/2 bg-[#0A0A57] text-white items-center justify-center flex-col px-6">
                <img
                    src="/Logo Karisma 2.png"
                    alt="Karisma Logo"
                    className="w-[550px] h-auto object-contain mb-4"
                />
            </div>
        </div>
    );
}

export default Login;
