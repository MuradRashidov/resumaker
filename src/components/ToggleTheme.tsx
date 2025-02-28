"use client";
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

export const ToggleTheme = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // İstemci tarafında bileşenin render edildiğinden emin olun
    useEffect(() => {
        setMounted(true);
    }, []);

    // Eğer bileşen henüz mount edilmediyse hiçbir şey render etme
    if (!mounted) return null;

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className='border border-yellow-300'
        >
            {theme === "dark" ? (
                <Sun className="size-[1.2rem] transition-all rotate-0 scale-100 text-yellow-300" />
            ) : (
                <Moon className="size-[1.2rem] transition-all rotate-0 scale-100 text-yellow-300" />
            )}
        </Button>
    );
};
