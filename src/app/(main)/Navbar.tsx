"use client"
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import logo from "@/assets/logo.png"
import { UserButton } from '@clerk/nextjs';
import { CreditCard } from 'lucide-react';
import { ToggleTheme } from '@/components/ToggleTheme';
import { useTheme } from 'next-themes';
import { dark } from '@clerk/themes'

interface NavbarProps {

}

export const Navbar = ({ }: NavbarProps) => {
    const { theme } = useTheme();
    return (<header className='shadow-sm'>
        <div className='max-w-7xl mx-auto flex items-center justify-between p-3 gap-3'>
            <Link href="/resumes" className=' flex items-center gap-2'>
                <Image src={logo} alt='resume' width={35} height={35} className='rounded-full' />
                <span className='text-xl font-bold tracking-tight'>AI Resume Builder</span>
            </Link>
            <div className='flex items-center gap-3'>
                <ToggleTheme />
                <UserButton appearance={{
                    baseTheme: theme === "dark"? dark : undefined,
                    elements: {
                        avatarBox: {
                            width: 35,
                            height: 35
                        }
                    }
                }}>
                    <UserButton.MenuItems>
                        <UserButton.Link
                            label='billing'
                            labelIcon={<CreditCard />}
                            href='/billing'
                        >
                            Billing
                        </UserButton.Link>
                    </UserButton.MenuItems>
                </UserButton>
            </div>
        </div>

    </header>);
};