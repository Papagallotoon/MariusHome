export default function Rating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(value);
        const half = !filled && i < value;
        return (
          <svg key={i} width="18" height="18" viewBox="0 0 20 20" className={filled || half ? "star-filled" : "star-empty"}>
            <path
              d="M10 1l2.39 4.84L17.82 6.5l-3.91 3.81.92 5.38L10 13.01l-4.83 2.68.92-5.38L2.18 6.5l5.43-.66L10 1z"
              fill="currentColor"
            />
          </svg>
        );
      })}
      <span className="ml-1 text-sm font-semibold text-gray-700">{value.toFixed(1)}</span>
    </div>
  );
}
