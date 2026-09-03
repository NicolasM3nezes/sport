import {notFound} from 'next/navigation';
import {matchById} from '@/lib/data';
import {best1x2,pct,prediction,selectionLabel} from '@/lib/analysis-ui';
export const dynamic='force-dynamic';
const dt=(d:string)=>new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',dateStyle:'medium',timeStyle:'short'}).format(new Date(d));

export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params;const data=await matchById(id);if(!data)notFound();
  const {match,stats,analyses}=data;const r:any=analyses[0];const ps=r?.predictions||[];
  const home=prediction(ps,'1X2','HOME'),draw=prediction(ps,'1X2','DRAW'),away=prediction(ps,'1X2','AWAY');
  const over=prediction(ps,'TOTAL_2.5','OVER'),under=prediction(ps,'TOTAL_2.5','UNDER');
  const yes=prediction(ps,'BTTS','YES'),no=prediction(ps,'BTTS','NO');const best=best1x2(ps);
  return <><div className="pagehead"><span className="eyebrow">PARTIDA</span><h2>{match.home_team?.name} × {match.away_team?.name}</h2><p>{match.league?.name||'Competição'} · {dt(match.kickoff_at)}</p></div>
  <div className="kpis"><div><small>Status</small><strong>{match.status_label}</strong></div><div><small>Placar</small><strong>{match.home_score??'–'} × {match.away_score??'–'}</strong></div><div><small>Rodada</small><strong>{match.round||'—'}</strong></div></div>
  {r?<section className="panel analysis-focus"><div className="analysis-card-head"><div><span className="eyebrow">ANÁLISE PRÉ-JOGO</span><h3>Probabilidades calculadas</h3></div><span className="badge">{r.model?.name||'Modelo'}</span></div>
    <div className="prob-three large"><span><small>{match.home_team?.name}</small><b>{pct(home?.probability,1)}</b></span><span><small>Empate</small><b>{pct(draw?.probability,1)}</b></span><span><small>{match.away_team?.name}</small><b>{pct(away?.probability,1)}</b></span></div>
    <div className="analysis-summary"><div><small>Resultado mais provável</small><b>{selectionLabel(best?.selection)} · {pct(best?.probability,1)}</b>{best?.fair_odd?<em>Odd justa teórica {Number(best.fair_odd).toFixed(2)}</em>:null}</div><div><small>Total de gols</small><b>Over 2,5 {pct(over?.probability,1)}</b><em>Under 2,5 {pct(under?.probability,1)}</em></div><div><small>Ambas marcam</small><b>Sim {pct(yes?.probability,1)}</b><em>Não {pct(no?.probability,1)}</em></div></div>
    <p className="muted">“Odd justa” é apenas 1/probabilidade do modelo. Não é cotação de bookmaker e não representa promessa de lucro.</p>
  </section>:<section className="panel"><h3>Análise pré-jogo</h3><p>Esta partida não possui cobertura de previsão matemática na fonte atual. Nenhuma probabilidade foi inventada.</p></section>}
  <section className="panel"><h3>Informações gerais</h3><p>Estádio: {match.venue||'Dado indisponível'} · Árbitro: {match.referee||'Dado indisponível'} · País: {match.country||'Dado indisponível'}</p></section>
  <section className="panel"><h3>Estatísticas da partida</h3>{stats.length?<div className="table">{stats.map((s:any)=><div className="tr" key={s.id}><span>{s.team?.name}</span><span>Finalizações: {s.shots??'—'}</span><span>No alvo: {s.shots_on_target??'—'}</span><span>Posse: {s.possession??'—'}{s.possession!=null?'%':''}</span><span>xG: {s.xg??'—'}</span></div>)}</div>:<p>Estatísticas detalhadas ainda não foram coletadas para esta partida.</p>}</section></>;
}
