"use client";
import { useState } from "react";
import Image from "next/image";
import CX_Logo_Dark from "@images/logos/cx-logo-dark.svg";
import Arrow from "@images/icons/Arrow";
import Linkedin_Icon_Orange from "@images/icons/Linkedin_Icon_Orange";

export function Footer() {
  const [isArrowHovered, setIsArrowHovered] = useState<boolean>(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // This makes the scroll smooth
    });
  };

  return (
    <>
      <footer className="px-56 pt-6 pb-3 text-sm text-[var(--dark-gray)] font-[500] bg-[#061F36]">
        <div className="grid grid-cols-4 my-16 gap-44">
          {/* FOOTER LEFT */}
          <div className="col-span-1">
            <Image src={CX_Logo_Dark} width={228} height={62} alt="cx_footer_logo" />

            <div className="mt-7 text-[16px] w-[250px] text-white  ml-2">
              Registered in England & Wales
              <div className="mt-2">Company N. 08524460</div>
            </div>
          </div>

          {/* FOOTER RIGHT */}
          <div className=" w-full pl-10"></div>
          <div className=" w-full pl-8">
            <h2 className="font-medium text-[#F85545] uppercase text-sm mb-6">contact</h2>
            <ul className="list-none">
              <li className="mb-3">
                <span className="text-[var(--medium-gray)] hover:text-white text-[17px]">info@connextar.com</span>
              </li>
              <li className="mb-3">
                <span className="text-[var(--medium-gray)] hover:text-white text-[17px]">(+44) (0) 7968579492</span>
              </li>
              <li className="mb-3">
                <span className="text-[var(--medium-gray)] hover:text-white text-[17px]">Contact</span>
              </li>
            </ul>
          </div>

          <div className="w-full pl-[1.85rem]">
            <h2 className="font-medium text-[#F85545] uppercase text-sm mb-6">GET TO KNOW US</h2>
            <div className="flex items-center justify-between">
              <div className="flex">
                <div
                  className="
                transition-all duration-200 border-[0.5px] border-[var(--medium-gray)] py-4 px-2 rounded-[50%]
                  hover:bg-[#F85545] hover:border-transparent flex justify-center items-center
                mx-2 group/linkedin"
                >
                  <Linkedin_Icon_Orange className="footer-social-icon" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="mb-2 mt-12 w-[94%] border-gray-500" />

        <div className="flex items-left justify-between">
          <div className="flex items-center ">
            <div className="ml-50 text-[var(--medium-gray)] ">
              ©Copyright 2024, Connextar Technologies Ltd. All Rights Reserved.
            </div>
          </div>

          <div className="flex items-center">
            <div className="text-[var(--medium-gray)] hover:text-white cursor-pointer mx-10">Terms & Conditions</div>
            <div className="text-[var(--medium-gray)] hover:text-white cursor-pointer mr-10">Privacy Policy</div>

            <div
              onClick={scrollToTop}
              className="transition duration-200 border-[0.5px] border-[var(--medium-gray)] py-[13px] px-[14px] rounded-[50%]
                  hover:bg-[#F85545] cursor-pointer hover:border-transparent flex justify-center items-center
                 group/arrow"
              onMouseOver={() => setIsArrowHovered(true)}
              onMouseLeave={() => setIsArrowHovered(false)}
            >
              <Arrow
                className={`footer-up-right-arrow transition-all duration-100 ${isArrowHovered ? "increaseArrowHeight" : ""} `}
              />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
