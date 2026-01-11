'use client';

import Link from "next/link";

interface ButtonProps {
    icon?: string;
    text?: string;
    href: string;
}

export default function Button({ icon, text, href }: ButtonProps) {
  return (
    <Link href={href} className="pl-8 w-full py-6 bg-green flex gap-2 items-center rounded-md hover:opacity-80 text-lg text-white no-underline">
        <span className="font-semibold material-symbols-outlined">
            {icon}
        </span>
        <span className="text-2xl font-semibold ml-2 text-white">{text}</span>
    </Link>
  );
}
