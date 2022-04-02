import { ActiveLink } from "raviger";
import React from "react";
import logo from "./logo.svg";

export default function Header(props: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={logo}
        className="h-16 w-16 animate-spin"
        alt="logo"
        style={{ animation: "spin 2s linear inifinite" }}
      />
      {/* <h1 className="flex-1 text-center text-xl">{props.title}</h1> */}
      <div className="flex items-center gap-2">
        {[
          { page: "Home", url: "/" },
          { page: "About", url: "/about" },
        ].map((link) => {
          return (
            <ActiveLink
              className="m-2 p-2 uppercase text-gray-800 hover:rounded-xl hover:bg-gray-200"
              exactActiveClass="rounded-xl bg-gray-100"
              key={link.url}
              href={link.url}
            >
              {link.page}
            </ActiveLink>
          );
        })}
      </div>
    </div>
  );
}
