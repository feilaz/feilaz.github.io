import {test} from 'node:test';
import assert from 'node:assert/strict';
import {signalModel} from '../src/lib/signalModel.ts';
import {rounds} from '../src/content/quorum.ts';
const average=ps=>ps.reduce((s,p)=>s+p.x,0)/ps.length;
const variance=ps=>{const m=average(ps);return ps.reduce((s,p)=>s+(p.x-m)**2,0)/ps.length};
test('independent errors average to truth; shared errors increase error while reducing spread',()=>{
 let previousError=-1,previousVariance=Infinity;
 for(const bias of [0,20,40,60,80,100]){
  const {points,mean}=signalModel(bias);const error=Math.abs(average(points)-240);
  assert.ok(Math.abs(mean-average(points))<1e-9,'consensus marker must equal the actual mean');
  if(bias===0)assert.ok(error<1e-9,'neutral ensemble should be unbiased');
  assert.ok(error>previousError);assert.ok(variance(points)<previousVariance);
  assert.ok(points.every(p=>p.x>=0&&p.x<=480&&p.y>=0&&p.y<=270),'agents remain in the plot');
  previousError=error;previousVariance=variance(points);
 }
});
test('out of range input cannot send the illustration outside its domain',()=>{
 assert.deepEqual(signalModel(-20),signalModel(0));assert.deepEqual(signalModel(400),signalModel(100));
});
test('the three-round lesson preserves its right / unanimous wrong / minority right arc',()=>{
 const majorities=rounds.map(r=>r.agents.filter(a=>a.verdict==='supported').length>=3?'supported':'refuted');
 assert.deepEqual(rounds.map((r,i)=>majorities[i]===r.truth),[true,false,false]);
 assert.equal(rounds[1].agents.length,5);assert.equal(rounds[1].agents.filter(a=>a.verdict==='supported').length,5);
 assert.equal(rounds[2].agents.filter(a=>a.verdict===rounds[2].truth).length,2);
});

test('appearance respects explicit choice, follows the device by default, and rejects stale preferences',async()=>{
 const {resolveTheme}=await import('../src/lib/theme.ts');
 assert.equal(resolveTheme('light',true),'light');
 assert.equal(resolveTheme('dark',false),'dark');
 assert.equal(resolveTheme(null,true),'dark');
 assert.equal(resolveTheme(null,false),'light');
 assert.equal(resolveTheme('invalid',true),'dark');
});
