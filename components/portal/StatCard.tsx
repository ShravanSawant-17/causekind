import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon?: React.ReactNode;
  badge?: string;
  accent?: "orange" | "neutral" | "peach";
}

export function StatCard({
  title,
  value,
  description,
  icon,
  badge,
  accent = "orange",
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm transition hover:border-[#dfcebf] hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#796c62]">
          {title}
        </span>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#faf0e8] text-[#ad5127] transition group-hover:bg-[#f8e7d8]">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <p
          className={`font-serif text-4xl font-bold tracking-tight ${
            accent === "orange" ? "text-[#ad5127]" : "text-[#211b17]"
          }`}
        >
          {value}
        </p>
        {badge && (
          <span className="rounded-full bg-[#f8e7d8] px-2.5 py-0.5 text-[11px] font-bold text-[#ad5127]">
            {badge}
          </span>
        )}
      </div>

      <p className="mt-2 text-xs leading-5 text-[#897a6e]">{description}</p>
    </div>
  );
}
