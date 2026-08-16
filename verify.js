'use strict';
const assert=require('node:assert/strict');
global.window={};
require('./data.js');
const D=window.APPLE_DATA;

assert.equal(D.snapshot,'2026-08-17');
assert.equal(Math.min(...D.products.map(p=>p.year)),2016);
assert.equal(Math.max(...D.products.map(p=>p.year)),2026);
assert.deepEqual(Object.fromEntries(['iphone','ipad','mac'].map(c=>[c,D.products.filter(p=>p.category===c).length])),{iphone:40,ipad:34,mac:43});

const referenced=new Set(D.products.flatMap(p=>p.chipOptions.map(c=>c.bench)));
for(const id of referenced){
  const b=D.benchmarks[id];
  assert.ok(b,`缺少 benchmark profile: ${id}`);
  for(const [path,value] of [['cpu.gbS',b.cpu.gbS],['cpu.gbM',b.cpu.gbM],['gpu.gb',b.gpu.gb],['gpu.flops',b.gpu.flops]])assert.ok(Number.isFinite(value)&&value>0,`${id} 缺少 ${path}`);
}

const valueNumber=value=>{
  const match=String(value||'').match(/[\d.]+/);
  if(!match)return 0;
  const number=Number(match[0]);
  return /TB/.test(value)?number*1024:number;
};
const optionFor=(productId,bench)=>{
  const product=D.products.find(p=>p.id===productId);
  assert.ok(product,`缺少产品: ${productId}`);
  const option=product.chipOptions.find(item=>item.bench===bench);
  assert.ok(option,`${productId} 缺少配置: ${bench}`);
  return option;
};

const ids=new Set();
let legalConfigCount=0;
for(const product of D.products){
  assert.ok(!ids.has(product.id),`产品 id 重复: ${product.id}`);ids.add(product.id);
  const pairKeys=new Set();
  for(const option of product.chipOptions){
    assert.ok(Number.isFinite(option.bundleDelta)&&option.bundleDelta>=0,`${product.id}/${option.bench} bundleDelta 非法`);
    assert.equal('priceDelta' in option,false,`${product.id}/${option.bench} 不应再使用旧 priceDelta`);
    assert.ok(!option.memory.some(value=>value.includes('||')),`${product.id} 内存值含保留分隔符`);
    assert.ok(!option.storage.some(value=>value.includes('||')),`${product.id} 存储值含保留分隔符`);
    assert.deepEqual(option.memory.map(valueNumber),[...option.memory].map(valueNumber).sort((a,b)=>a-b),`${product.id}/${option.bench} 内存未按升序`);
    assert.deepEqual(option.storage.map(valueNumber),[...option.storage].map(valueNumber).sort((a,b)=>a-b),`${product.id}/${option.bench} 存储未按升序`);
    const memories=option.memory.length?option.memory:[''];
    const storages=option.storage.length?option.storage:[''];
    for(const memory of memories)for(const storage of storages){
      const key=`${option.bench}|${memory}|${storage}`;
      assert.ok(!pairKeys.has(key),`${product.id} 重复合法组合: ${key}`);pairKeys.add(key);
    }
  }
  assert.ok(pairKeys.size>0,`${product.id} 没有可复位的默认组合`);
  legalConfigCount+=pairKeys.size;
}

const mbp14=D.products.find(p=>p.id==='mbp14_2021');
const mbp16=D.products.find(p=>p.id==='mbp16_2021');
assert.deepEqual(mbp14.chipOptions.map(x=>x.bench),['m1pro_8_14','m1pro_10_14','m1pro_10_16','m1max_10_24','m1max_10_32']);
assert.deepEqual(mbp16.chipOptions.map(x=>x.bench),['m1pro_10_16','m1max_10_24','m1max_10_32']);
assert.deepEqual(mbp14.chipOptions[0].memory,['16GB','32GB']);
assert.deepEqual(mbp14.chipOptions[0].storage,['512GB','1TB','2TB','4TB','8TB']);
assert.equal(D.products.find(p=>p.id==='mbp15_2016').chipOptions.length,7);
assert.equal(D.products.find(p=>p.id==='mbp15_2017').chipOptions.length,5);
assert.equal(D.products.find(p=>p.id==='mbp15_2018').chipOptions.length,9);
assert.equal(D.products.find(p=>p.id==='mbp15_2019').chipOptions.length,9);
assert.equal(D.products.find(p=>p.id==='mbp16_2019').chipOptions.length,11);
const intel16=D.products.find(p=>p.id==='mbp16_2019');
assert.equal(intel16.chipOptions.filter(option=>D.benchmarks[option.bench].name.includes('5500M (8GB GDDR6)')).length,3,'2019 16 英寸应有三个 CPU 对应的 5500M 8GB 档');
assert.ok(intel16.chipOptions.every(option=>option.specs.gpuMemory),'Intel 独显 bundle 必须显式记录显存');
assert.equal(intel16.specs.refresh,'47.95 / 48 / 50 / 59.94 / 60Hz');
assert.equal(D.products.find(p=>p.id==='mbp13_intel_2020_2').official,'https://support.apple.com/zh-cn/111981');
const configNames=id=>D.products.find(p=>p.id===id).chipOptions.map(option=>D.benchmarks[option.bench].name);
assert.ok(!configNames('mbp15_2016').some(name=>name.includes('2.6GHz · Radeon Pro 455')),'2016 非法 CPU/GPU 组合仍存在');
assert.ok(!configNames('mbp15_2018').some(name=>name.includes('2.2GHz · Radeon Pro Vega')),'2018 非法 CPU/GPU 组合仍存在');
assert.ok(!configNames('mbp16_2019').some(name=>name.includes('2.3GHz · Radeon Pro 5300M')),'2019 16 英寸非法起配组合仍存在');

const ipadM1=D.products.find(p=>p.id==='ipadpro11_3').chipOptions;
assert.deepEqual(ipadM1.map(x=>[x.memory,x.storage]),[
  [['8GB'],['128GB','256GB','512GB']],
  [['16GB'],['1TB','2TB']]
]);
const ipadM4=D.products.find(p=>p.id==='ipadpro11_m4').chipOptions;
assert.deepEqual(ipadM4.map(x=>[x.bench,x.memory,x.storage]),[
  ['m4_ipad_9',['8GB'],['256GB','512GB']],
  ['m4_ipad_10',['16GB'],['1TB','2TB']]
]);

assert.deepEqual(optionFor('mbp14_m2','m2max_12_30').memory,['32GB','64GB']);
assert.deepEqual(optionFor('mbp14_m2','m2max_12_30').storage,['1TB','2TB','4TB','8TB']);
assert.deepEqual(optionFor('mbp14_m2','m2max_12_38').memory,['32GB','64GB','96GB']);
assert.deepEqual(optionFor('mbp14_m3','m3pro_12_18').storage,['512GB','1TB','2TB','4TB']);
assert.deepEqual(optionFor('mbp14_m3','m3max_14_30').storage,['1TB','2TB','4TB','8TB']);
assert.deepEqual(optionFor('mbp14_m4','m4max_14_32').memory,['36GB']);
assert.deepEqual(optionFor('mbp14_m4','m4max_14_32').storage,['1TB','2TB','4TB','8TB']);
assert.deepEqual(optionFor('mbp14_m5pro','m5pro_15_16').storage,['1TB','2TB','4TB']);
assert.deepEqual(optionFor('mbp14_m5pro','m5max_18_32').memory,['36GB']);
assert.deepEqual(optionFor('mbp14_m5pro','m5max_18_32').storage,['2TB','4TB','8TB']);
assert.deepEqual(optionFor('mbp16_2021','m1max_10_24').storage,['1TB','2TB','4TB','8TB']);
assert.deepEqual(optionFor('mbp16_2021','m1max_10_32').storage,['1TB','2TB','4TB','8TB']);

const dynamicMbpIds=['mbp14_2021','mbp16_2021','mbp14_m2','mbp16_m2','mbp14_m3','mbp16_m3','mbp14_m4','mbp16_m4','mbp14_m5','mbp14_m5pro','mbp16_m5pro'];
for(const id of dynamicMbpIds){
  const product=D.products.find(p=>p.id===id);
  for(const option of product.chipOptions){
    for(const field of ['weight','battery','batteryRuntime','power','ports','external'])assert.ok(option.specs?.[field],`${id}/${option.bench} 缺少动态 ${field}`);
    for(const field of ['memoryBandwidth','mediaEngine'])assert.ok(D.benchmarks[option.bench].specs?.[field],`${id}/${option.bench} 缺少芯片 ${field}`);
  }
}
assert.equal(optionFor('mbp14_m3','m3_8_10').official,'https://support.apple.com/zh-cn/117735');
assert.equal(optionFor('mbp14_m4','m4_10_10').official,'https://support.apple.com/zh-cn/121552');
assert.equal(D.benchmarks.m5pro_15_16.cpu.coreBreakdown,'5 个超级核心 + 10 个性能核心');
assert.equal(D.benchmarks.m5max_18_40.cpu.coreBreakdown,'6 个超级核心 + 12 个性能核心');

assert.equal(D.products.find(p=>p.id==='16e').chipOptions[0].bench,'a18_4');
assert.equal(D.products.find(p=>p.id==='17e').chipOptions[0].bench,'a19_4');
assert.ok(D.products.some(p=>p.id==='ipadair11_m4'));
assert.ok(D.products.some(p=>p.id==='ipadair13_m4'));
assert.ok(D.products.filter(p=>p.category==='iphone').every(p=>!String(p.specs.battery).includes('Wh')),'iPhone 不应伪装成 Apple 官方 Wh');
assert.ok(D.products.filter(p=>p.category==='iphone').every(p=>p.specs.refresh!=='60Hz'),'iPhone 未标注刷新率不应硬写 60Hz');

for(const p of D.products){
  assert.match(p.official,/^https:\/\//,`${p.id} 缺少官方链接`);
  assert.ok(p.chipOptions.length>0,`${p.id} 没有配置`);
  assert.equal(p.marketSeed.length,2,`${p.id} 相对价格阶梯格式错误`);
  assert.ok(p.marketSeed.every(value=>Number.isFinite(value)&&value>0),`${p.id} 相对价格阶梯必须为正数`);
  assert.ok(p.marketSeed[0]<p.marketSeed[1],`${p.id} 相对价格阶梯上下限错误`);
}

assert.equal(D.marketPolicy.snapshot,D.snapshot);
assert.match(D.marketPolicy.channels.xy,/闲鱼/);
assert.match(D.marketPolicy.channels.zz,/验/);
assert.ok(D.marketPolicy.excludes.includes('平台回收价'),'买家参考不能混入回收价');

/* 在无浏览器 DOM 的 Node 环境运行到价格全量审计完成，再于 UI 初始化处有意停止。 */
window.matchMedia=()=>({matches:false,addEventListener(){}});
global.document={documentElement:{dataset:{}},querySelector(){return null},querySelectorAll(){return[]},addEventListener(){}};
let uiInitStopped=false;
try{require('./app.js')}catch(error){
  uiInitStopped=/null|innerHTML/.test(String(error));
}
assert.ok(uiInitStopped,'无 DOM 验证应只在 UI 初始化处停止');
assert.equal(document.documentElement.dataset.marketAuditCount,String(legalConfigCount),'价格审计必须覆盖全部合法配置');
assert.equal(document.documentElement.dataset.marketAuditInvalid,'0','存在 0 元、非有限值或倒置价格区间');
assert.equal(document.documentElement.dataset.marketAuditExact85,'0','转转价格不应继续机械等于闲鱼 × 0.85');
assert.ok(Number(document.documentElement.dataset.marketAuditMin)>=100,'价格下沿必须为正');
assert.ok(Number(document.documentElement.dataset.marketAuditMax)<60000,'价格上沿异常失控');

console.log(`OK: ${D.products.length} 款机型，${referenced.size} 个已引用芯片 / GPU 配置，${legalConfigCount} 个合法配置价格与动态规格全部有效。`);
