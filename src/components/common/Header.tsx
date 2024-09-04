"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import "@assets/styles/globals.css";
import CX_Logo_Light from "@images/logos/cx-logo-light.svg";
import Linkedin_Icon from "@images/icons/Linkedin_Icon";

export function Header() {
  return (
    <>
      <header className="px-60">
        <div className="Header flex justify-between items-center py-8">
          {/* Left Side */}
          <div className="flex items-center">
            <Link href="/">
              <Image priority src={CX_Logo_Light} alt="connextar-logo" className="mr-20" width={230} />
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="px-3 py-2 group/linkedin">
                <Linkedin_Icon width={26} height={24} className="header-social-icons" />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
