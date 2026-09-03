import {notFound} from 'next/navigation';
import {matchById} from '@/lib/data';
export const dynamic='force-dynamic';
const pct=(n:any)=>n==null?'—':`${(Number(n)*100).toFixed(1)}%`;
const dt=(d:string)=>new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',dateStyle:'medium',timeStyle:'short'}).format(new Date(d));
export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params;const data=await matchById(id);if(!data)notFound();
  const {match,stats,analyses}=data;
  return <><div className="pagehead"><span className="eyebrow">PARTIDA</span><h2>{match.home_team?.name} × {match.away_team?.name}</h2><p>{match.league?.name||'Competição'} · {dt(match.kickoff_at)}</p></div>
  <div className="kpis"><div><small>Status</small><strong>{match.status_label}</strong></div><div><small>Placar</small><strong>{match.home_score??'–'} × {match.away_score??'–'}</strong></div><div><small>Rodada</small><strong>{match.round||'—'}</strong></div></div>
  <section className="panel"><h3>Informações gerais</h3><p>Estádio: {match.venue||'Dado indisponível'} · Árbitro: {match.referee||'Dado indisponível'} · País: {match.country||'Dado indisponível'}</p></section>
  <section className="panel"><h3>Estatísticas da partida</h3>{stats.length?<div className="table">{stats.map((s:any)=><div className="tr" key={s.id}><span>{s.team?.name}</span><span>Finalizações: {s.shots??'—'}</span><span>No alvo: {s.shots_on_target??'—'}</span><span>Posse: {s.possession??'—'}{s.possession!=null?'%':''}</span><span>xG: {s.xg??'—'}</span></div>)}</div>:<p>Dados indisponíveis.</p>}</section>
  <section className="panel"><h3>Análise do modelo</h3>{analyses.length?analyses.map((r:any)=><div key={r.id}><p>Confiança: <b>{r.confidence_level||'—'}</b> · qualidade dos dados {pct(r.data_quality_score)} · gols esperados {r.expected_home_goals??'—'} × {r.expected_away_goals??'—'}</p>{r.predictions?.length?<div className="table">{r.predictions.slice(0,12).map((p:any)=><div className="tr" key={p.id}><span>{p.market}</span><span>{p.selection}</span><span>{pct(p.probability)}</span><span>Odd {p.bookmaker_odd??'—'}</span><span>Edge {p.edge==null?'—':`${(Number(p.edge)*100).toFixed(1)} pp`}</span></div>)}</div>:<p>Sem probabilidades calculadas.</p>}</div>):<p>Dados insuficientes para análise neste momento.</p>}</section></>;
}
