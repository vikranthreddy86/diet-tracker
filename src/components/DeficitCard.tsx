export default function DeficitCard({
  burned,
  consumed,
}: {
  burned: number;
  consumed: number;
}) {
  const deficit = Math.round(burned - consumed);
  const isDeficit = deficit >= 0;

  return (
    <section
      className={`rounded-2xl p-4 text-white shadow-md ${
        isDeficit
          ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-900/10"
          : "bg-gradient-to-r from-amber-500 to-orange-500 shadow-orange-900/10"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs opacity-80">Burned (Whoop)</p>
          <p className="text-xl font-bold">{Math.round(burned)} kcal</p>
        </div>
        <div className="text-center">
          <p className="text-xs opacity-80">Consumed</p>
          <p className="text-xl font-bold">{Math.round(consumed)} kcal</p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-80">{isDeficit ? "Deficit" : "Surplus"}</p>
          <p className="text-xl font-bold">{Math.abs(deficit)} kcal</p>
        </div>
      </div>
    </section>
  );
}
