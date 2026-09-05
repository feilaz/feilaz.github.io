'use client';
import {useState} from 'react';
import {signalModel} from '@/lib/signalModel';

/** A conceptual counterexample, not experimental data or the paper's scoring rule.
 * Symmetric errors average to the truth; the control deliberately adds a shared
 * error while narrowing the answers. Correlation need not cause bias in general. */
export default function Signal(){
 const [shared,setShared]=useState(65);
 const {mean,points}=signalModel(shared);
 const level=shared===0?'None':shared<35?'Low':shared<70?'Moderate':'High';
 const explanation=shared===0?'In this example, independent errors cancel out.':shared<35?'A shared error begins to shift the group’s estimate.':shared<70?'The answers move closer together, but farther from the truth.':'Strong agreement. One shared mistake.';
 return <figure className="signal" aria-labelledby="signal-title">
  <div className="signal-top"><span className="eyebrow">RESEARCH NOTE / 01</span></div>
  <h2 id="signal-title">Agreement <span>≠ accuracy.</span></h2>
  <div className="signal-legend" aria-hidden="true"><span><i className="legend-dot"/>Agent answer</span><span><i className="legend-truth"/>Truth</span><span><i className="legend-mean"/>Group estimate</span></div>
  <svg viewBox="0 0 480 260" role="img" aria-label={`Shared error: ${level.toLowerCase()}. ${explanation} Dots represent illustrative agent answers; the solid line is truth and the dashed line is their mean.`}>
   <defs><pattern id="signal-grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="var(--plot-grid)"/></pattern></defs>
   <rect width="480" height="225" fill="url(#signal-grid)"/>
   <rect className="signal-error-area" x="240" y="36" width={mean-240} height="176" fill="var(--blue)" opacity=".045"/>
   <line x1="240" y1="28" x2="240" y2="215" stroke="var(--ink)" strokeWidth="1.5"/>
   {points.map((p,i)=><circle className="signal-agent" key={i} cx={p.x} cy={p.y} r="3.2" fill="var(--blue)" opacity={.58+(i%3)*.16}/>)}
   <g className="signal-mean" style={{transform:`translateX(${mean}px)`}}><line x1="0" y1="52" x2="0" y2="215" stroke="var(--blue)" strokeWidth="2" strokeDasharray="4 4"/><path d="M0 37 5 42 0 47 -5 42Z" fill="var(--blue)"/></g>
   <g opacity={shared>3?1:0} aria-hidden="true"><path className="signal-error-bracket" d={`M240 225v7H${mean}v-7`} fill="none" stroke="var(--blue)" strokeWidth="1.5"/></g>
  </svg>
  <div className="signal-control"><label htmlFor="shared-bias">Shared error <output htmlFor="shared-bias">{level}</output></label><input id="shared-bias" type="range" min="0" max="100" value={shared} aria-valuetext={`${level} shared error`} aria-describedby="signal-caption" onChange={e=>setShared(Number(e.target.value))}/><div className="range-ends"><span>Independent errors</span><span>The same mistake</span></div></div>
  <p className="signal-explanation">{explanation}</p>
  <figcaption id="signal-caption" className="signal-note"><span id="signal-instruction">Move the slider to compare.</span><br/>Conceptual illustration · not experimental results</figcaption>
 </figure>
}
