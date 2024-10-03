"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <>
      {theme === "light" ? (
        <button onClick={() => setTheme("dark")} className="flex items-center w-full">
          <Moon className="h-[1.2rem] w-[1.2rem] " />
          <span className="ml-2">Dark mode</span>
        </button>
      ) : (
        <button onClick={() => setTheme("light")} className="flex items-center  w-full">
          <Sun className="h-[1.2rem] w-[1.2rem]" />
          <span className="ml-2">Light mode</span>
        </button>
      )}
    </>
  );
}
