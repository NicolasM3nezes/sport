import {db} from './supabase';

export type MatchRow={
  id:string;kickoff_at:string;status_code:string;status_label:string;
  home_score:number|null;away_score:number|null;venue:string|null;country:string|null;
  league:any;home_team:any;away_team:any;round?:string|null;season?:number|null;
  referee?:string|null;venue_city?:string|null;provider?:string;last_synced_at?:string|null;
};

const selectMatch='id,kickoff_at,status_code,status_label,home_score,away_score,venue,country,round,season,referee,venue_city,provider,last_synced_at,league:leagues(name,country,logo_url),home_team:teams!matches_home_team_id_fkey(name,logo_url),away_team:teams!matches_away_team_id_fkey(name,logo_url)';

export async function todayMatches(){
  const now=new Date();
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
  const start=new Date(parts+'T00:00:00-03:00').toISOString();
  const end=new Date(parts+'T23:59:59-03:00').toISOString();
  const {data,error}=await db.from('matches').select(selectMatch).gte('kickoff_at',start).lte('kickoff_at',end).order('kickoff_at');
  if(error)throw error;
  return (data||[]) as unknown as MatchRow[];
}

export async function upcoming(limit=30){
  const {data,error}=await db.from('matches').select(selectMatch).gte('kickoff_at',new Date().toISOString()).order('kickoff_at').limit(limit);
  if(error)throw error;
  return (data||[]) as unknown as MatchRow[];
}

export async function dashboard(){
  const [m,p,o]=await Promise.all([
    todayMatches(),
    db.from('prediction_runs').select('*',{count:'exact',head:true}).gte('generated_at',new Date(Date.now()-864e5).toISOString()),
    db.from('predictions').select('*',{count:'exact',head:true}).gt('edge',0)
  ]);
  return {matches:m,predictions:p.count||0,opportunities:o.count||0};
}

export async function opportunities(){
  const {data,error}=await db.from('predictions').select('id,market,selection,probability,bookmaker_odd,implied_probability,edge,expected_value,created_at,prediction_run:prediction_runs(match:matches(kickoff_at,home_team:teams!matches_home_team_id_fkey(name),away_team:teams!matches_away_team_id_fkey(name)))').gt('edge',0).order('edge',{ascending:false}).limit(100);
  if(error)throw error;return data||[];
}

export async function matchById(id:string){
  const {data:match,error}=await db.from('matches').select(selectMatch).eq('id',id).maybeSingle();
  if(error)throw error;if(!match)return null;
  const [stats,runs]=await Promise.all([
    db.from('team_match_statistics').select('*,team:teams(name,logo_url)').eq('match_id',id),
    db.from('prediction_runs').select('id,status,data_quality_score,confidence_score,confidence_level,expected_home_goals,expected_away_goals,input_sample_size,factors,generated_at,model:model_versions(name,version),predictions(id,market,selection,line,probability,fair_odd,bookmaker_odd,implied_probability,edge,expected_value,rank)').eq('match_id',id).order('generated_at',{ascending:false}).limit(3)
  ]);
  return {match:match as unknown as MatchRow,stats:stats.data||[],analyses:runs.data||[]};
}

export async function analysisRows(){
  const {data,error}=await db.from('prediction_runs').select('id,status,confidence_level,confidence_score,data_quality_score,generated_at,model:model_versions(name,version),match:matches(id,kickoff_at,home_team:teams!matches_home_team_id_fkey(name),away_team:teams!matches_away_team_id_fkey(name))').order('generated_at',{ascending:false}).limit(100);
  if(error)throw error;return data||[];
}

export async function historyRows(){
  const {data,error}=await db.from('predictions').select('id,market,selection,probability,bookmaker_odd,edge,created_at,result:prediction_results(outcome,correct,profit_loss_one_unit,evaluated_at),prediction_run:prediction_runs(match:matches(id,kickoff_at,home_team:teams!matches_home_team_id_fkey(name),away_team:teams!matches_away_team_id_fkey(name)))').order('created_at',{ascending:false}).limit(150);
  if(error)throw error;return data||[];
}

export async function backtestRows(){
  const {data,error}=await db.from('backtest_runs').select('id,market,period_start,period_end,status,matches_analyzed,decisions,correct_count,accuracy,roi,brier_score,log_loss,created_at,model:model_versions(name,version),league:leagues(name)').order('created_at',{ascending:false}).limit(100);
  if(error)throw error;return data||[];
}

export async function metricRows(){
  const {data,error}=await db.from('model_metrics').select('id,market,sample_size,accuracy,brier_score,log_loss,calibration_error,roi,created_at,model:model_versions(name,version),league:leagues(name)').order('created_at',{ascending:false}).limit(100);
  if(error)throw error;return data||[];
}

export async function systemStatus(){
  const [{count:matches},{count:leagues},{count:teams},{data:last}]=await Promise.all([
    db.from('matches').select('*',{count:'exact',head:true}),
    db.from('leagues').select('*',{count:'exact',head:true}),
    db.from('teams').select('*',{count:'exact',head:true}),
    db.from('matches').select('last_synced_at,provider').not('last_synced_at','is',null).order('last_synced_at',{ascending:false}).limit(1)
  ]);
  return {matches:matches||0,leagues:leagues||0,teams:teams||0,lastSync:last?.[0]?.last_synced_at||null,provider:last?.[0]?.provider||null};
}
