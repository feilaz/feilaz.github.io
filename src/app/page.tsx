import { Hero } from "@/components/sections/Hero";
import { Now } from "@/components/sections/Now";
import { Research } from "@/components/sections/Research";
import { Work } from "@/components/sections/Work";
import { Publications } from "@/components/sections/Publications";
import { Experience } from "@/components/sections/Experience";
import { About } from "@/components/sections/About";

/**
 * Section order is the argument of the site:
 *
 *   hero + now      who this is, in under fifteen seconds, with the CV one click away
 *   research        the one interactive thing, on the one dark surface
 *   work            back to paper; conventional, legible case studies
 *   publications    a real academic list
 *   experience      canvas off, motion off, just the facts
 *   about           a person
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Now />
      <Research />
      <Work />
      <Publications />
      <Experience />
      <About />
    </>
  );
}
