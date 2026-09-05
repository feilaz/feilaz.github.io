/** Verify actual v2 CSS text tokens in both appearances, including button pairs. */
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const css=readFileSync(new URL('../src/app/theme.css',import.meta.url),'utf8');
function palette(selector){
 const block=css.slice(css.indexOf(selector)).split('{')[1].split('}')[0];
 const values=Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[\da-f]{6})/gi)].map(m=>[m[1],m[2]]));
 for(const key of ['ink','muted','blue','blue-dark','background','surface','raised','on-accent'])assert.ok(values[key],`Missing ${selector} ${key}`);
 return values;
}
function luminance(hex){
 const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
 return rgb.reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0);
}
function ratio(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
for(const [label,selector] of [['Light',':root {'],['Dark',':root[data-theme="dark"]']]){
 const colors=palette(selector);
 const pairs=['ink','muted','blue','blue-dark'].flatMap(fg=>['background','surface','raised'].map(bg=>[fg,bg]));
 pairs.push(['background','ink'],['on-accent','blue']);
 let minimum=Infinity;
 for(const [fg,bg] of pairs){const contrast=ratio(colors[fg],colors[bg]);minimum=Math.min(minimum,contrast);assert.ok(contrast>=4.5,`${label}: ${fg}/${bg} contrast ${contrast.toFixed(2)} < 4.5`);}
 console.log(`${label}: ${pairs.length} text pairs pass; minimum contrast ${minimum.toFixed(2)}:1.`);
}
