/** Illustrative shared-error model; no empirical or live model outputs. */
export function signalModel(shared:number){
 const bias=Math.min(100,Math.max(0,shared))/100;
 const mean=240+bias*126;
 const spread=122*(1-bias)+12;
 const points=Array.from({length:80},(_,i)=>{
  const pair=Math.floor(i/2);const z=(pair+.5)/40;
  return {x:mean+(i%2?1:-1)*Math.pow(z,1.4)*spread,y:146+Math.sin(pair*2.4)*42*(1-z*.6)+(i%2?10:-10)};
 });
 return {mean,points};
}
