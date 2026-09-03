import Link from 'next/link';
import type {MatchRow} from '@/lib/data';
import {best1x2,pct,prediction,selectionLabel} from '@/lib/analysis-ui';

const fmt=(d:string)=>new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(d));

export function MatchCard({m}:{m:MatchRow}){
  const list=m.analysis?.predictions||[];
  const home=prediction(list,'1X2','HOME');
  const draw=prediction(list,'1X2','DRAW');
  const away=prediction(list,'1X2','AWAY');
  const over=prediction(list,'TOTAL_2.5','OVER');
  const btts=prediction(list,'BTTS','YES');
  const best=best1x2(list);
  return <Link className="match" href={`/matches/${m.id}`}>
    <div className="league">{m.league?.name||'Competição'}</div>
    <div className="teams"><b>{m.home_team?.name||'Mandante'}</b><span>{m.home_score??'–'} × {m.away_score??'–'}</span><b>{m.away_team?.name||'Visitante'}</b></div>
    {m.analysis?<div className="analysis-mini">
      <div className="prob-three"><span><small>Casa</small><b>{pct(home?.probability)}</b></span><span><small>Empate</small><b>{pct(draw?.probability)}</b></span><span><small>Fora</small><b>{pct(away?.probability)}</b></span></div>
      <div className="signal-line"><span>Maior 1X2: <b>{selectionLabel(best?.selection)} {pct(best?.probability)}</b></span><span>Over 2,5: <b>{pct(over?.probability)}</b></span><span>BTTS: <b>{pct(btts?.probability)}</b></span></div>
    </div>:<div className="analysis-missing">Sem cobertura de análise para esta partida</div>}
    <div className="meta"><span>{fmt(m.kickoff_at)}</span><span className="badge">{m.status_label}</span></div>
  </Link>;
}
