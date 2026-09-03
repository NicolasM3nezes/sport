export const clamp=(n:number,min=0,max=1)=>Math.min(max,Math.max(min,n));
export function poisson(k:number,lambda:number){let f=1;for(let i=2;i<=k;i++)f*=i;return Math.exp(-lambda)*Math.pow(lambda,k)/f}
export function matrix(home:number,away:number,max=8){const rows=[] as {h:number;a:number;p:number}[];for(let h=0;h<=max;h++)for(let a=0;a<=max;a++)rows.push({h,a,p:poisson(h,home)*poisson(a,away)});return rows}
export function markets(home:number,away:number){const m=matrix(home,away);const sum=(f:(x:{h:number;a:number})=>boolean)=>m.filter(f).reduce((s,x)=>s+x.p,0);return {home:sum(x=>x.h>x.a),draw:sum(x=>x.h===x.a),away:sum(x=>x.h<x.a),over25:sum(x=>x.h+x.a>=3),btts:sum(x=>x.h>0&&x.a>0),scores:[...m].sort((a,b)=>b.p-a.p).slice(0,5)}}
export const implied=(odd:number)=>odd>1?1/odd:null;
export const expectedValue=(prob:number,odd:number)=>odd>1?prob*odd-1:null;
export const brier=(prob:number,outcome:boolean)=>Math.pow(prob-(outcome?1:0),2);
export const logLoss=(prob:number,outcome:boolean)=>{const p=clamp(prob,1e-12,1-1e-12);return -(outcome?Math.log(p):Math.log(1-p))};
