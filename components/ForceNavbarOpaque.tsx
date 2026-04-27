"use client";
import { useEffect } from "react";

export default function ForceNavbarOpaque() {
  useEffect(() => {
    document.documentElement.setAttribute("data-navbar-opaque", "true");
    return () => {
      document.documentElement.removeAttribute("data-navbar-opaque");
    };
  }, []);
  return null;
}