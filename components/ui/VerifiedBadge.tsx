import { BadgeCheck } from "lucide-react";

export default function VerifiedBadge({ className = "", size = 16 }: { className?: string, size?: number }) {
    return (
        <BadgeCheck
            className={`text-blue-500 fill-blue-500 text-white inline-block ml-1 ${className}`}
            size={size}
            strokeWidth={2.5}
        />
    );
}
