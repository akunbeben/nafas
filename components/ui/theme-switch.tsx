"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonWithTooltip } from "./button-with-tooltip";

export default function ThemeSwitch() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <ButtonWithTooltip
            variant="outline"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            tooltipContent={theme === "dark" ? 'Light Mode' : 'Dark Mode'}
        >
            {theme === "dark" ? <Moon /> : <Sun />}
        </ButtonWithTooltip>
    );
}