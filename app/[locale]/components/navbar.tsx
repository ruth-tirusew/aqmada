
'use client'
import { useState } from "react";
import Image from "next/image";
import { FaLinkedinIn } from "react-icons/fa";
import { GoRocket } from "react-icons/go";
import { FaTelegramPlane } from "react-icons/fa";
import ThemeSwitch from "./theme-switch";
import JoinWaitlist from "./joinwaitlist";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className=" sticky items-center top-0 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl py-4 z-40 backdrop-blur">
      <div className="flex justify-between ">
        <div className="flex items-center">
          <Image src={"/aqmada-03.png"} width={50} height={40} alt="logo" />
          <span className="text-lg font-bold text-[#021044] dark:text-white">
            Aqmada
          </span>
        </div>



        <div className="flex items-center space-x-3">
          <div className="text-black text-xl dark:text-white ">
            <ThemeSwitch />
          </div>
          <div className="rounded-lg text-white text-md bg-[#021044] dark:bg-white dark:text-[#021044] p-3 hidden sm:block">
            <a href="https://t.me/aqmada" className="">
              <FaTelegramPlane />
            </a>
          </div>
          <div className="">
            <div className="rounded-lg text-white text-md bg-[#021044] p-3 dark:bg-white dark:text-[#021044] hidden sm:block">
              <a href="https://www.linkedin.com/company/aqmada-by-perbytes/" className="">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
          <button className="bg-[#021044] px-2 py-1.5 md:px-4 md:py-2 text-sm text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#021044] rounded-lg dark:bg-white dark:text-[#021044] hidden sm:block">
            <GoRocket className="inline-block ml-2 text-md mx-2" /> Join the waitlist
          </button>
      <div className="flex sm:hidden">
          <button
            type="button"
            className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 dark:text-white  focus:outline-none  focus:ring-none transition"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className={`block h-6 w-6 ${isMobileMenuOpen ? "hidden" : "block"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <svg
              className={`block h-6 w-6 ${isMobileMenuOpen ? "block" : "hidden"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        </div>


      </div>
      <div className={`sm:hidden ${isMobileMenuOpen ? "block" : "hidden"} h-screen w-full absolute px-10 py backdrop-blur-xl bg-white/50 dark:bg-black/70`} id="mobile-menu">
        <div className="space-y-1 px-2 pb-3 pt-2 w-full flex flex-col">
          <a href="#" className="dark:text-white block px-3 py-2 text-base font-medium flex gap-2 items-center" aria-current="page">
            <FaTelegramPlane /><span>Telegram</span> 
          </a>
          <a href="#" className="dark:text-white px-3 py-2 text-base font-medium flex gap-2 items-center my-2">
            <FaLinkedinIn /> <span>Linked In</span>
          </a>
          <JoinWaitlist />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;