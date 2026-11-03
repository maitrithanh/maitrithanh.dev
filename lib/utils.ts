import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Remote images bypass next/image optimization: images.remotePatterns only
// lists a couple of hosts, and opening it to "**" would make an open proxy.
export const isExternal = (src: string) => /^https?:\/\//.test(src)
