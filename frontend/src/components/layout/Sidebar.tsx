import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Overview', icon: '⬡' },
  { path: '/detectors', label: 'Detectors', icon: '◈' },
  { path: '/incidents', label: 'Incidents', icon: '◉' },
  { path: '/assistant', label: 'AI Assistant', icon: '◆' },
  { path: '/response', label: 'Response', icon: '◇' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-cyber-card border-r border-cyber-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-cyber-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center text-cyber-green text-lg">
            🛡️
          </div>
          <div>
            <div className="text-cyber-green font-mono font-bold text-sm tracking-wider">KZ CYBER</div>
            <div className="text-gray-500 font-mono text-xs">FUSION v1.0</div>
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="px-6 py-3 border-b border-cyber-border">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse-slow"></span>
          <span className="text-cyber-green font-mono text-xs">SYSTEM ACTIVE</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/20 shadow-cyber'
                  : 'text-gray-400 hover:text-cyber-green hover:bg-cyber-green/5 border border-transparent'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom info */}
      <div className="p-4 border-t border-cyber-border">
        <div className="text-xs font-mono text-gray-600 space-y-1">
          <div>AFM AI Hackathon 2026</div>
          <div>Track 2: AI Shield</div>
          <div className="text-cyber-green/50">Almaty, June 24</div>
        </div>
      </div>
    </aside>
  );
}
