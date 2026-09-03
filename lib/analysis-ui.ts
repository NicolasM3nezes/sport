export type PredictionLite={id?:string;market:string;selection:string;line?:number|null;probability:number;fair_odd?:number|null;rank?:number|null;bookmaker_odd?:number|null;edge?:number|null};

export const pct=(v:any,digits=0)=>v==null?'—':`${(Number(v)*100).toFixed(digits)}%`;

export function prediction(list:PredictionLite[]|undefined,market:string,selection:string){
  return list?.find(p=>p.market===market&&p.selection===selection);
}

export function best1x2(list:PredictionLite[]|undefined){
  const rows=(list||[]).filter(p=>p.market==='1X2');
  return rows.sort((a,b)=>Number(b.probability)-Number(a.probability))[0]||null;
}

export function selectionLabel(selection?:string|null){
  if(selection==='HOME')return 'Casa';
  if(selection==='DRAW')return 'Empate';
  if(selection==='AWAY')return 'Fora';
  if(selection==='OVER')return 'Mais de 2,5 gols';
  if(selection==='UNDER')return 'Menos de 2,5 gols';
  if(selection==='YES')return 'Ambas marcam';
  if(selection==='NO')return 'Ambas não marcam';
  return selection||'—';
}
