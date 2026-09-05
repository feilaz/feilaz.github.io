'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import ThemeSwitch from './ThemeSwitch';

export function Arrow({diagonal=false}:{diagonal?:boolean}) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal?'M6 18 18 6M6 6h12v12':'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> }
export function Header(){
 const path=usePathname();const mobile=useRef<HTMLDetailsElement>(null);
 const links=[['Work','/#work'],['Research','/#research'],['Publications','/publications/'],['About','/about/']];
 const items=()=> <>{links.map(([label,href])=><Link key={label} href={href} aria-current={path===href?'page':undefined} onClick={()=>mobile.current?.removeAttribute('open')}>{label}</Link>)}<a href="mailto:adamkostka002@gmail.com" className="nav-contact">Let’s talk <Arrow diagonal/></a></>;
 return <header className="site-header"><div className="container header-inner"><Link href="/" className="wordmark" onClick={()=>mobile.current?.removeAttribute('open')} aria-label="Adam Kostka home"><span>Adam Kostka</span></Link><div className="header-actions"><nav className="main-nav desktop-nav" aria-label="Main navigation">{items()}</nav><ThemeSwitch/><details className="mobile-menu" ref={mobile} onKeyDown={e=>{if(e.key==='Escape'){mobile.current?.removeAttribute('open');mobile.current?.querySelector('summary')?.focus()}}}><summary className="menu-button">Menu <span aria-hidden="true">+</span></summary><nav className="main-nav" aria-label="Mobile navigation">{items()}</nav></details></div></div></header>
}
export function Footer(){return <footer className="site-footer"><div className="container"><div className="footer-top"><div><p className="eyebrow">CONTACT</p><h2>Let’s talk<span> about what’s next.</span></h2></div><a className="contact-circle" href="mailto:adamkostka002@gmail.com" aria-label="Email Adam"><Arrow diagonal/></a></div><div className="footer-bottom"><span>Adam Kostka <span className="muted">© 2026</span></span><div className="footer-links"><a href="mailto:adamkostka002@gmail.com">Email <Arrow diagonal/></a><a href="https://github.com/feilaz">GitHub <Arrow diagonal/></a><a href="https://www.linkedin.com/in/adam-kostka-eng/">LinkedIn <Arrow diagonal/></a><a href="/adam-kostka-cv.pdf">CV <Arrow diagonal/></a></div><span className="muted">Warsaw, Poland</span></div></div></footer>}
