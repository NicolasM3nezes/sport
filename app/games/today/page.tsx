import {todayMatches} from '@/lib/data';
import {MatchCard} from '@/components/MatchCard';
export const dynamic='force-dynamic';
export default async function Page(){
  let data:any[]=[];let error='';
  try{data=await todayMatches()}catch(e){error=e instanceof Error?e.message:'Falha ao carregar partidas';}
  return <><div className="pagehead"><span className="eyebrow">AGENDA</span><h2>Jogos de hoje</h2><p>{data.length} partidas encontradas. Horários em America/Sao_Paulo.</p></div>{error?<div className="panel"><h3>Erro de dados</h3><p>{error}</p></div>:null}<section className="grid">{data.length?data.map(m=><MatchCard key={m.id} m={m}/>):<div className="empty">Nenhum jogo disponível para hoje.</div>}</section></>;
}
