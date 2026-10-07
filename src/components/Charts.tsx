import React, { useState } from 'react';
import { REVENUE_TREND_DATA, PLATFORM_SALES_DATA } from '../data/initialData';

function createSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpx1 = p0.x + (p1.x - p0.x) * 0.45;
    const cpy1 = p0.y;
    const cpx2 = p0.x + (p1.x - p0.x) * 0.55;
    const cpy2 = p1.y;
    d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export const RevenueLineChart: React.FC<{ period: '7D' | '30D' | '90D' }> = ({ period }) => {
  const dataset = REVENUE_TREND_DATA[period];
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const width = 560;
  const height = 210;
  const padL = 48;
  const padR = 18;
  const padT = 18;
  const padB = 28;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const allVals = [...dataset.current, ...dataset.previous];
  const maxVal = Math.max(...allVals) * 1.1;
  const minVal = Math.min(...allVals) * 0.8;

  const getPoints = (arr: number[]) =>
    arr.map((v, i) => ({
      x: padL + (i / Math.max(1, arr.length - 1)) * chartW,
      y: padT + chartH - ((v - minVal) / (maxVal - minVal)) * chartH,
    }));

  const ptsCurrent = getPoints(dataset.current);
  const ptsPrev = getPoints(dataset.previous);
  const lineCurrent = createSmoothPath(ptsCurrent);
  const areaCurrent = `${lineCurrent} L ${ptsCurrent[ptsCurrent.length - 1].x} ${padT + chartH} L ${ptsCurrent[0].x} ${padT + chartH} Z`;
  const linePrev = createSmoothPath(ptsPrev);

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const val = minVal + t * (maxVal - minVal);
    return {
      y: padT + chartH - t * chartH,
      label: val >= 100000 ? `₹${(val / 100000).toFixed(1)}L` : `₹${Math.round(val / 1000)}K`,
    };
  });

  return (
    <div className="relative w-full h-full select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="revGoldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#c9a84c" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {yTicks.map((t, idx) => (
          <g key={idx}>
            <line x1={padL} y1={t.y} x2={width - padR} y2={t.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x={padL - 8} y={t.y + 3} textAnchor="end" fill="#7a7d8a" fontSize="10" className="font-mono-code">
              {t.label}
            </text>
          </g>
        ))}

        <path d={areaCurrent} fill="url(#revGoldGrad)" />
        <path d={linePrev} fill="none" stroke="rgba(79,142,247,0.65)" strokeWidth="1.75" strokeDasharray="4 4" />
        <path d={lineCurrent} fill="none" stroke="#c9a84c" strokeWidth="2.5" />

        {ptsCurrent.map((pt, i) => (
          <g
            key={i}
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
            className="cursor-pointer"
          >
            <rect
              x={pt.x - chartW / (ptsCurrent.length * 2)}
              y={padT}
              width={chartW / ptsCurrent.length}
              height={chartH}
              fill="transparent"
            />
            {hoverIdx === i && (
              <line x1={pt.x} y1={padT} x2={pt.x} y2={padT + chartH} stroke="rgba(201,168,76,0.35)" strokeDasharray="2 2" />
            )}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoverIdx === i ? 6 : 4}
              fill="#c9a84c"
              stroke="#0f1420"
              strokeWidth="2"
            />
            <text x={pt.x} y={height - 6} textAnchor="middle" fill="#7a7d8a" fontSize="10">
              {dataset.labels[i]}
            </text>
          </g>
        ))}
      </svg>

      {hoverIdx !== null && (
        <div
          className="absolute top-2 right-2 bg-[#161d2e] border border-[#c9a84c]/30 rounded-lg px-3 py-2 text-xs shadow-xl pointer-events-none"
        >
          <div className="font-semibold text-[#e8e6e0] mb-1">{dataset.labels[hoverIdx]}</div>
          <div className="flex items-center gap-2 text-[#c9a84c] font-mono-code">
            <span className="w-2 h-2 rounded-full bg-[#c9a84c]" />
            Current: ₹{(dataset.current[hoverIdx] / 1000).toFixed(1)}K
          </div>
          <div className="flex items-center gap-2 text-[#4f8ef7] font-mono-code mt-0.5">
            <span className="w-2 h-2 rounded-full bg-[#4f8ef7]" />
            Previous: ₹{(dataset.previous[hoverIdx] / 1000).toFixed(1)}K
          </div>
        </div>
      )}
    </div>
  );
};

export const PlatformDoughnutChart: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const slices = [
    { label: 'Amazon', value: 43, color: '#ff9900' },
    { label: 'Flipkart', value: 29, color: '#2874f0' },
    { label: 'Meesho', value: 19, color: '#e94560' },
    { label: 'ONDC', value: 9, color: '#3ecf8e' },
  ];

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <div className="flex flex-col items-center justify-between h-full select-none">
      <div className="relative w-[130px] h-[130px]">
        <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
          {slices.map((s, idx) => {
            const dash = (s.value / 100) * circumference;
            const offset = -cumulative;
            cumulative += dash;
            return (
              <circle
                key={s.label}
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={hovered === idx ? 19 : 16}
                strokeDasharray={`${Math.max(0, dash - 2)} ${circumference}`}
                strokeDashoffset={offset}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="font-serif-display text-xl font-bold text-[#c9a84c] leading-none">
            {hovered !== null ? `${slices[hovered].value}%` : '₹4.2L'}
          </span>
          <span className="text-[10px] text-[#7a7d8a] mt-0.5">
            {hovered !== null ? slices[hovered].label : '4 Channels'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-[#7a7d8a]">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: s.color }} />
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const StockMovementBarChart: React.FC = () => {
  const weeks = ['W1', 'W2', 'W3', 'W4'];
  const sold = [320, 410, 380, 440];
  const restocked = [200, 300, 250, 350];
  const returned = [18, 24, 15, 20];
  const maxVal = 480;

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      <div className="flex items-center justify-end gap-4 text-[10px] text-[#7a7d8a] mb-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#c9a84c]/80" /> Sold
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#3ecf8e]/65" /> Restocked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#f56565]/65" /> Returned
        </span>
      </div>
      <div className="flex-1 grid grid-cols-4 gap-4 items-end pt-2 pb-1 border-b border-white/6">
        {weeks.map((w, i) => (
          <div key={w} className="flex flex-col items-center h-full justify-end group">
            <div className="flex items-end justify-center gap-1.5 w-full h-[125px]">
              <div
                className="w-4 rounded-t bg-[#c9a84c]/80 hover:bg-[#c9a84c] transition-all"
                style={{ height: `${(sold[i] / maxVal) * 100}%` }}
                title={`${w} Sold: ${sold[i]} units`}
              />
              <div
                className="w-4 rounded-t bg-[#3ecf8e]/65 hover:bg-[#3ecf8e] transition-all"
                style={{ height: `${(restocked[i] / maxVal) * 100}%` }}
                title={`${w} Restocked: ${restocked[i]} units`}
              />
              <div
                className="w-4 rounded-t bg-[#f56565]/65 hover:bg-[#f56565] transition-all"
                style={{ height: `${Math.max(6, (returned[i] / maxVal) * 100)}%` }}
                title={`${w} Returned: ${returned[i]} units`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4 pt-1.5 text-center text-[10px] text-[#7a7d8a] font-mono-code">
        {weeks.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
    </div>
  );
};

export const PlatformSalesBarChart: React.FC<{ period: 'Monthly' | 'Quarterly' | 'Yearly' }> = ({ period }) => {
  const data = PLATFORM_SALES_DATA[period];
  const allVals = [...data.amazon, ...data.flipkart, ...data.meesho, ...data.ondc];
  const maxVal = Math.max(...allVals) * 1.08;

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      <div className="flex flex-wrap items-center justify-end gap-3 text-[10px] text-[#7a7d8a] mb-2">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-[#ff9900]/80" /> Amazon</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-[#2874f0]/75" /> Flipkart</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-[#e94560]/75" /> Meesho</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-[#3ecf8e]/75" /> ONDC</span>
      </div>

      <div className="flex-1 flex items-end gap-2 pt-2 pb-1 border-b border-white/6">
        {data.labels.map((label, i) => (
          <div key={label} className="flex-1 flex flex-col items-center h-full justify-end">
            <div className="flex items-end justify-center gap-[2px] w-full h-[185px]">
              <div
                className="flex-1 max-w-[10px] rounded-t-xs bg-[#ff9900]/80 hover:bg-[#ff9900] transition-all"
                style={{ height: `${(data.amazon[i] / maxVal) * 100}%` }}
                title={`${label} Amazon: ₹${data.amazon[i]}K`}
              />
              <div
                className="flex-1 max-w-[10px] rounded-t-xs bg-[#2874f0]/75 hover:bg-[#2874f0] transition-all"
                style={{ height: `${(data.flipkart[i] / maxVal) * 100}%` }}
                title={`${label} Flipkart: ₹${data.flipkart[i]}K`}
              />
              <div
                className="flex-1 max-w-[10px] rounded-t-xs bg-[#e94560]/75 hover:bg-[#e94560] transition-all"
                style={{ height: `${(data.meesho[i] / maxVal) * 100}%` }}
                title={`${label} Meesho: ₹${data.meesho[i]}K`}
              />
              <div
                className="flex-1 max-w-[10px] rounded-t-xs bg-[#3ecf8e]/75 hover:bg-[#3ecf8e] transition-all"
                style={{ height: `${(data.ondc[i] / maxVal) * 100}%` }}
                title={`${label} ONDC: ₹${data.ondc[i]}K`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-1.5 text-center text-[10px] text-[#7a7d8a] font-mono-code">
        {data.labels.map((label) => (
          <div key={label} className="flex-1 truncate">{label}</div>
        ))}
      </div>
    </div>
  );
};

export const CategoryDoughnutChart: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const categories = [
    { label: 'Sarees', value: 32, color: '#c9a84c' },
    { label: 'Kurtas', value: 24, color: '#4f8ef7' },
    { label: 'Lehengas', value: 18, color: '#3ecf8e' },
    { label: 'Tops', value: 12, color: '#f6a623' },
    { label: 'Shawls', value: 8, color: '#e94560' },
    { label: 'Others', value: 6, color: '#78788c' },
  ];

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <div className="flex items-center justify-around h-full gap-4 select-none">
      <div className="relative w-[170px] h-[170px] shrink-0">
        <svg viewBox="0 0 170 170" className="w-full h-full -rotate-90">
          {categories.map((c, idx) => {
            const dash = (c.value / 100) * circumference;
            const offset = -cumulative;
            cumulative += dash;
            return (
              <circle
                key={c.label}
                cx="85"
                cy="85"
                r={radius}
                fill="none"
                stroke={c.color}
                strokeWidth={hovered === idx ? 24 : 20}
                strokeDasharray={`${Math.max(0, dash - 2)} ${circumference}`}
                strokeDashoffset={offset}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="font-serif-display text-2xl font-bold text-[#c9a84c]">
            {hovered !== null ? `${categories[hovered].value}%` : '100%'}
          </span>
          <span className="text-[11px] text-[#7a7d8a]">
            {hovered !== null ? categories[hovered].label : '6 Categories'}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-xs">
        {categories.map((c, idx) => (
          <div
            key={c.label}
            className={`flex items-center gap-2 cursor-pointer transition-opacity ${
              hovered !== null && hovered !== idx ? 'opacity-50' : 'opacity-100'
            }`}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: c.color }} />
            <span className="text-[#a8aab8] w-20">{c.label}</span>
            <span className="font-mono-code text-[#c9a84c] text-[11px]">{c.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CampaignPerformanceChart: React.FC = () => {
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const roas = [2.8, 3.2, 3.8, 4.2];
  const spend = [12, 15, 14, 18];

  const width = 440;
  const height = 210;
  const padL = 36;
  const padR = 20;
  const padT = 26;
  const padB = 28;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const ptsRoas = roas.map((v, i) => ({
    x: padL + (i / 3) * chartW,
    y: padT + chartH - (v / 5) * chartH,
  }));
  const ptsSpend = spend.map((v, i) => ({
    x: padL + (i / 3) * chartW,
    y: padT + chartH - (v / 22) * chartH,
  }));

  const pathRoas = createSmoothPath(ptsRoas);
  const pathSpend = createSmoothPath(ptsSpend);

  return (
    <div className="w-full h-full select-none">
      <div className="flex items-center justify-end gap-4 text-[10px] text-[#7a7d8a] mb-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#c9a84c]" /> ROAS (x)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4f8ef7]" /> Spend (₹K)
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[195px]">
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <line
            key={i}
            x1={padL}
            y1={padT + chartH - t * chartH}
            x2={width - padR}
            y2={padT + chartH - t * chartH}
            stroke="rgba(255,255,255,0.06)"
          />
        ))}
        <path d={pathSpend} fill="none" stroke="#4f8ef7" strokeWidth="2" />
        <path d={pathRoas} fill="none" stroke="#c9a84c" strokeWidth="2.5" />
        {ptsRoas.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4.5" fill="#c9a84c" />
            <text x={p.x} y={p.y - 8} textAnchor="middle" fill="#c9a84c" fontSize="10" className="font-mono-code">
              {roas[i]}x
            </text>
            <circle cx={ptsSpend[i].x} cy={ptsSpend[i].y} r="3.5" fill="#4f8ef7" />
            <text x={p.x} y={height - 6} textAnchor="middle" fill="#7a7d8a" fontSize="10">
              {labels[i]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export const RoasTrendChart: React.FC = () => {
  const labels = ['W1', 'W2', 'W3', 'W4'];
  const series = [
    { name: 'Amazon', color: '#ff9900', data: [3.8, 4.1, 4.4, 4.6], dashed: false },
    { name: 'Flipkart', color: '#2874f0', data: [3.2, 3.5, 3.9, 4.1], dashed: false },
    { name: 'Meta', color: '#f6a623', data: [3.0, 3.3, 3.6, 3.8], dashed: false },
    { name: 'Meesho', color: '#e94560', data: [2.8, 3.0, 3.1, 3.2], dashed: true },
  ];

  const width = 440;
  const height = 185;
  const padL = 36;
  const padR = 16;
  const padT = 16;
  const padB = 24;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const minV = 2.0;
  const maxV = 5.0;

  return (
    <div className="w-full h-full select-none">
      <div className="flex flex-wrap items-center justify-end gap-3 text-[10px] text-[#7a7d8a] mb-1">
        {series.map((s) => (
          <span key={s.name} className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[170px]">
        {[2.5, 3.0, 3.5, 4.0, 4.5].map((val) => {
          const y = padT + chartH - ((val - minV) / (maxV - minV)) * chartH;
          return (
            <g key={val}>
              <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="rgba(255,255,255,0.06)" />
              <text x={padL - 6} y={y + 3} textAnchor="end" fill="#7a7d8a" fontSize="9" className="font-mono-code">
                {val.toFixed(1)}x
              </text>
            </g>
          );
        })}

        {series.map((s) => {
          const pts = s.data.map((v, i) => ({
            x: padL + (i / 3) * chartW,
            y: padT + chartH - ((v - minV) / (maxV - minV)) * chartH,
          }));
          return (
            <g key={s.name}>
              <path
                d={createSmoothPath(pts)}
                fill="none"
                stroke={s.color}
                strokeWidth="2"
                strokeDasharray={s.dashed ? '4 4' : undefined}
              />
              {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" fill={s.color} />
              ))}
            </g>
          );
        })}

        {labels.map((lbl, i) => (
          <text
            key={lbl}
            x={padL + (i / 3) * chartW}
            y={height - 4}
            textAnchor="middle"
            fill="#7a7d8a"
            fontSize="10"
            className="font-mono-code"
          >
            {lbl}
          </text>
        ))}
      </svg>
    </div>
  );
};
