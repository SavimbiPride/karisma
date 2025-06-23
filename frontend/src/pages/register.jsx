import React from 'react';
import { Link } from 'react-router-dom';

function Register() {
    return (
        <div className="flex h-screen w-screen font-sans">
            {/* Kiri - Gambar Maskot */}
            <div className="hidden md:flex w-1/2 bg-[#0A0A57] items-center justify-center flex-col px-6 relative">
                <div className="absolute top-6 left-6">
                    <img
                        src="/Logo Karisma 2.png"
                        alt="Logo"
                        className="h-12"
                    />
                </div>
                <img
                    src="/maskot Karisma.png"
                    alt="Maskot Karisma"
                    className="h-auto object-contain mb-4"
                />
            </div>

            {/* Kanan - Form Sign Up */}
            <div className="w-full md:w-1/2 bg-white p-10 flex flex-col justify-center h-screen">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0A0A57] mb-8 text-center">
                    Sign Up
                </h1>
                <form className="space-y-4">
                    <div className="relative w-full">
                        <input
                            type="text"
                            id="username"
                            className="text-black peer w-full border-2 border-[#0A0A57] rounded-xl px-4 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-[#0A0A57]"
                            placeholder=" "
                        />
                        <label
                            htmlFor="username"
                            className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-500"
                        >
                            Username
                        </label>
                    </div>
                    <div className="relative w-full">
                        <input
                            type="email"
                            id="email"
                            className="text-black peer w-full border-2 border-[#0A0A57] rounded-xl px-4 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-[#0A0A57]"
                            placeholder=" "
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
                            className="peer w-full border-2 border-[#0A0A57] rounded-xl px-4 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-[#0A0A57]"
                            placeholder=" "
                        />
                        <label
                            htmlFor="password"
                            className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-500"
                        >
                            Password
                        </label>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-[#0A0A57] text-white font-semibold px-6 py-2 rounded-lg"
                        >
                            Submit
                        </button>
                    </div>
                    <div className="mt-4 text-lg">
                        <span className="font-bold text-[#0A0A57]">Sudah punya akun? </span>
                        <Link to="/login" className="text-[#0A0A57] underline cursor-pointer">Login sekarang</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
