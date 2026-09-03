import Link from 'next/link';
import {analysisRows} from '@/lib/data';
import {best1x2,pct,prediction,selectionLabel} from '@/lib/analysis-ui';
export const dynamic='force-dynamic';

export default async function Page(){
  const rows=await analysisRows();
  return <><div className="pagehead"><span className="eyebrow">MOTOR PROBABILÍSTICO</span><h2>Análises</h2><p>Probabilidades matemáticas salvas no Supabase. A fonte externa e o modelo interno permanecem separados para preservar transparência.</p></div>
  <div className="analysis-grid">{rows.length?rows.map((r:any)=>{
    const ps=r.predictions||[];
    const home=prediction(ps,'1X2','HOME'),draw=prediction(ps,'1X2','DRAW'),away=prediction(ps,'1X2','AWAY');
    const over=prediction(ps,'TOTAL_2.5','OVER'),under=prediction(ps,'TOTAL_2.5','UNDER');
    const yes=prediction(ps,'BTTS','YES'),no=prediction(ps,'BTTS','NO');
    const best=best1x2(ps);const m=r.match;
    return <Link className="analysis-card" href={`/matches/${m?.id}`} key={r.id}>
      <div className="analysis-card-head"><div><span className="league">{m?.league?.name||'Competição'}</span><h3>{m?.home_team?.name} × {m?.away_team?.name}</h3></div><span className="badge">{m?.status_label||'—'}</span></div>
      <div className="prob-three large"><span><small>Casa</small><b>{pct(home?.probability,1)}</b></span><span><small>Empate</small><b>{pct(draw?.probability,1)}</b></span><span><small>Fora</small><b>{pct(away?.probability,1)}</b></span></div>
      <div className="analysis-summary"><div><small>Sinal 1X2 mais forte</small><b>{selectionLabel(best?.selection)} · {pct(best?.probability,1)}</b>{best?.fair_odd?<em>Odd justa {Number(best.fair_odd).toFixed(2)}</em>:null}</div><div><small>Gols 2,5</small><b>Over {pct(over?.probability,1)} · Under {pct(under?.probability,1)}</b></div><div><small>Ambas marcam</small><b>Sim {pct(yes?.probability,1)} · Não {pct(no?.probability,1)}</b></div></div>
      <div className="analysis-source">Fonte: {r.model?.name||'modelo'} · cálculo probabilístico, não garantia de resultado.</div>
    </Link>;
  }):<div className="empty">Nenhuma análise calculada.</div>}</div></>;
}
