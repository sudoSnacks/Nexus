import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    color?: string;
}

export default function StatsCard({ title, value, icon: Icon, description, color = "indigo" }: StatsCardProps) {
    // Map simple color names to Tailwind classes (simplified approach)
    const colorClasses: Record<string, string> = {
        indigo: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
        green: "bg-green-500/20 text-green-400 border-green-500/30",
        blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    };

    const activeClass = colorClasses[color] || colorClasses.indigo;

    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
                <div className={`p-2 rounded-lg ${activeClass}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            {description && (
                <p className="text-gray-500 text-sm">{description}</p>
            )}
        </div>
    );
}
