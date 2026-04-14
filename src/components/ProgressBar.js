import React from "react";

function ProgressBar({ percentage, label }) {
  // Amélioration : on vérifie si percentage est un nombre fini, sinon on met 0
  // Cela évite d'obtenir NaN si percentage est undefined, null ou non numérique
  const raw = Number.isFinite(percentage) ? percentage : 0;
  const safePercentage = Math.max(0, Math.min(100, Math.round(raw)));

  return (
    <section className="space-y-2" aria-label={label}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-on-surface-variant">{label}</p>
        <span className="text-sm font-semibold text-on-surface">{safePercentage}%</span>
      </div>

      <div
        className="h-3 w-full overflow-hidden rounded-full bg-white"
        role="progressbar"
        aria-label={label ?? "Pourcentage"}
        aria-valuenow={safePercentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${safePercentage}%` }}
        />
      </div>
    </section>
  );
}

export default ProgressBar;
