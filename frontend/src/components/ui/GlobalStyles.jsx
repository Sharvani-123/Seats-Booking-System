const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body { background: #0a0f1e; color: #e2e8f0; font-family: 'DM Sans', 'Segoe UI', sans-serif; }

    ::-webkit-scrollbar         { width: 6px; }
    ::-webkit-scrollbar-track   { background: #0f172a; }
    ::-webkit-scrollbar-thumb   { background: #334155; border-radius: 3px; }

    /* utilities */
    .btn {
      cursor: pointer; border: none; border-radius: 8px;
      font-family: inherit; font-size: 13px; font-weight: 600;
      padding: 8px 16px; transition: all 0.2s;
    }
    .btn:hover  { transform: translateY(-1px); filter: brightness(1.1); }
    .btn:active { transform: translateY(0); }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; filter: none; }

    .card {
      background: #111827;
      border: 1px solid #1e293b;
      border-radius: 16px;
    }

    .badge {
      display: inline-flex; align-items: center;
      padding: 3px 10px; border-radius: 20px;
      font-size: 11px; font-weight: 600; letter-spacing: 0.5px;
    }

    .nav-btn {
      background: transparent; border: none; cursor: pointer;
      padding: 10px 20px; border-radius: 10px;
      font-family: inherit; font-size: 14px; font-weight: 500;
      color: #64748b; transition: all 0.2s;
    }
    .nav-btn.active  { background: #1e293b; color: #e2e8f0; }
    .nav-btn:hover   { color: #e2e8f0; background: #1a2332; }

    .seat-cell {
      width: 36px; height: 36px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 600; cursor: pointer;
      transition: all 0.2s; border: 1.5px solid transparent;
    }
    .seat-cell:hover { transform: scale(1.12); }

    .member-card {
      background: #0f172a; border: 1px solid #1e293b;
      border-radius: 12px; padding: 12px 16px;
      cursor: pointer; transition: all 0.2s;
    }
    .member-card:hover, .member-card.selected {
      border-color: #3b82f6;
      background: rgba(59,130,246,0.05);
    }

    .date-chip {
      padding: 6px 14px; border-radius: 20px;
      font-size: 12px; font-weight: 600; cursor: pointer;
      border: 1.5px solid #1e293b; background: transparent;
      color: #64748b; transition: all 0.2s; white-space: nowrap;
      font-family: inherit;
    }
    .date-chip.active { border-color: #3b82f6; color: #3b82f6; background: rgba(59,130,246,0.1); }
    .date-chip:hover  { border-color: #475569; color: #e2e8f0; }

    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
      z-index: 100; display: flex; align-items: center; justify-content: center;
    }
    .modal {
      background: #111827; border: 1px solid #1e293b;
      border-radius: 20px; padding: 28px;
      width: 480px; max-width: 95vw; max-height: 80vh; overflow-y: auto;
    }

    .stat-card {
      background: #0f172a; border: 1px solid #1e293b; border-radius: 14px; padding: 20px;
    }

    @keyframes fadeIn  { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes pulse   { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }

    .fade-in  { animation: fadeIn  0.3s ease; }
    .slide-in { animation: slideIn 0.25s ease; }
    .pulse    { animation: pulse 2s infinite; }
  `}</style>
);

export default GlobalStyles;
