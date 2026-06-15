const cities = [
  { name: 'Almaty', alerts: 12, max: 20, color: '#FF4444' },
  { name: 'Astana', alerts: 7, max: 20, color: '#FF8C00' },
  { name: 'Shymkent', alerts: 4, max: 20, color: '#FFD700' },
];

export default function CityAlertCards() {
  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg p-5">
      <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4">Alerts by City — KZ</div>
      <div className="space-y-4">
        {cities.map((city) => {
          const pct = (city.alerts / city.max) * 100;
          const bars = 10;
          const filled = Math.round((city.alerts / city.max) * bars);

          return (
            <div key={city.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-sm text-gray-300">{city.name}</span>
                <span className="font-mono text-sm font-bold" style={{ color: city.color }}>
                  {city.alerts} alerts
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: bars }).map((_, i) => (
                  <div
                    key={i}
                    className="h-3 flex-1 rounded-sm transition-all"
                    style={{
                      backgroundColor: i < filled ? city.color : 'rgba(255,255,255,0.05)',
                      boxShadow: i < filled ? `0 0 4px ${city.color}60` : 'none',
                    }}
                  />
                ))}
              </div>
              <div className="mt-1 font-mono text-xs text-gray-600">{pct.toFixed(0)}% of threshold</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
