import { useState } from "react";

export default function HomeNavbar() {
  return (
    <nav className="flex justify-between items-center px-12 py-6">

      <div className="text-xl font-semibold">
        DataEater
      </div>

      <div className="flex gap-8 text-gray-700">

        <a href="#" className="hover:text-black">
          Product
        </a>

        <a href="#" className="hover:text-black">
          Pricing
        </a>

        <a href="#" className="hover:text-black">
          Docs
        </a>

      </div>

      <div className="flex gap-4">

        <button className="text-gray-700 hover:text-black border border-gray-300 px-5 py-2 rounded-full transition">
          Login
        </button>

        <button className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition">
          Get Started
        </button>

      </div>

    </nav>
  );
}

function NavBar() {
    return (
        <div className="bg-slate-50 p-5 text-slate-900 border-b border-gray-300 shadow-md flex items-center">
            <h1 className="text-xl font-bold ml-5 pointer-events-none">DataEater</h1>
            <h1 className="text-slate-800 ml-6">Welcome Back, UserName</h1>
        </div>
    );
}

function ReportsNavBar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="w-full bg-slate-50 border-b border-gray-300 p-5 shadow-md flex items-center justify-between">

                {/* LEFT */}
                <div className="flex items-center gap-x-4">
                    <span className="font-bold text-lg text-slate-900 cursor-pointer">
                        DataEater
                    </span>
                </div>

                {/* CENTER */}
                <div className="flex items-center gap-x-8">
                    <span className="hover:text-indigo-500 cursor-pointer">Home</span>
                    <span className="hover:text-indigo-500 cursor-pointer">Recents</span>
                    <span className="hover:text-indigo-500 cursor-pointer">Report</span>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-x-4">
                    <button className="px-4 py-2 text-sm rounded bg-black text-white cursor-pointer">
                        Upgrade
                    </button>

                    {/* USER MENU (RELATIVE WRAPPER) */}
                    <div className="relative">
                        {/* USER BUTTON */}
                        <div
                            className="flex items-center gap-x-2 p-2 rounded hover:bg-gray-200 cursor-pointer"
                            onClick={() => setIsOpen(prev => !prev)}
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-300"></div>

                            <span className="text-sm text-gray-700">User</span>

                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"
                                    }`}
                            >
                                <path
                                    d="M4 6.5L8 10.5L12 6.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        {/* DROPDOWN */}
                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-56 rounded-md border bg-white shadow-lg z-50">
                                <div className="px-4 py-3 border-b">
                                    <p className="text-sm font-medium text-gray-900">
                                        Abz
                                    </p>
                                    <p className="text-xs text-gray-500">abdou@email.com</p>
                                </div>

                                <div className="py-1">
                                    <div className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                                        Account settings
                                    </div>
                                    <div className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                                        Log out
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

        </>
    );
}

export { NavBar, ReportsNavBar, HomeNavbar };
