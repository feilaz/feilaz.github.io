/** Shared 24px geometry avoids font-dependent glyph sizing and baselines. */
export function FeatureIcon({kind}:{kind:'cache'|'dashboard'|'conversation'}) {
 return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
  {kind==='cache'?<><path d="M4 5h16v4H4zM5 9v11h14V9M9 13h6"/><path d="M8 2h8"/></>:kind==='dashboard'?<><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M10 9v12M14 17v-3M17 17v-5"/></>:<><path d="M4 4h16v12H9l-5 4V4Z"/><path d="M8 8v4h8m-3-3 3 3-3 3"/></>}
 </svg>;
}
