import type {Metadata} from 'next';
import PaperLibrary from '@/components/v2/PaperLibrary';
import {Arrow} from '@/components/v2/Chrome';
import {site} from '@/content/site';
export const metadata:Metadata={title:'Publications',description:'Research on multi-agent systems, uncertainty, logic and learning by Adam Kostka.',alternates:{canonical:'/publications/'}};
export default function Publications(){return <div className="container page-content"><header className="page-heading"><p className="eyebrow">THE RESEARCH RECORD / 2024–2026</p><h1>Questions worth<br/><span>working on.</span></h1><div className="page-heading-bottom"><p>Multi-agent reliability, belief harmonization, and the systems that help machines reason together.</p><a className="text-link" href={site.links.scholar.href}>Google Scholar <Arrow diagonal/></a></div></header><PaperLibrary/></div>}
