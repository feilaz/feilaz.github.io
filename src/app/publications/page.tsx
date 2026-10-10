import type {Metadata} from 'next';
import PaperLibrary from '@/components/v2/PaperLibrary';
import {Arrow} from '@/components/v2/Chrome';
import {site} from '@/content/site';
export const metadata:Metadata={title:'Publications',description:'Research on multi-agent systems, uncertainty, logic and learning by Adam Kostka.',alternates:{canonical:'/publications/'}};
export default function Publications(){return <div className="container page-content"><header className="page-heading"><p className="eyebrow">THE RESEARCH RECORD / 2024–2026</p><h1>Publications.</h1><div className="page-heading-bottom"><p>Research on LLM-based multi-agent systems, uncertainty, belief revision and AI tutoring.</p><a className="text-link" href={site.links.scholar.href}>Google Scholar <Arrow diagonal/></a></div></header><PaperLibrary/></div>}
