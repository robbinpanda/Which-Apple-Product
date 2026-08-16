(()=>{
  'use strict';
  const D=window.APPLE_DATA;
  if(!D)throw new Error('APPLE_DATA 未加载');
  const $=(s,root=document)=>root.querySelector(s);
  const $$=(s,root=document)=>[...root.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=n=>new Intl.NumberFormat('zh-CN').format(Math.round(n));
  const categoryName={iphone:'iPhone',ipad:'iPad',mac:'MacBook'};
  const compactView=window.matchMedia('(max-width:680px)');
  const state={category:'iphone',year:'all',type:'all',search:'',sort:'yearDesc',view:compactView.matches?'cards':'table',selections:new Map(),compare:[]};

  const valueNumber=v=>{
    if(!v)return 0;
    const m=String(v).match(/[\d.]+/);if(!m)return 0;
    const n=+m[0];return /TB/.test(v)?n*1024:n;
  };
  const chipGroups=p=>{
    const groups=[];
    p.chipOptions.forEach(option=>{
      let group=groups.find(g=>g.bench===option.bench);
      if(!group){group={bench:option.bench,options:[]};groups.push(group)}
      group.options.push(option);
    });
    return groups;
  };
  const legalPairs=group=>{
    const pairs=[],seen=new Set();
    group.options.forEach(option=>{
      const memories=option.memory.length?option.memory:[''];
      const storages=option.storage.length?option.storage:[''];
      memories.forEach(memory=>storages.forEach(storage=>{
        const key=`${memory}||${storage}`;
        if(!seen.has(key)){seen.add(key);pairs.push({key,memory,storage,option})}
      }));
    });
    return pairs;
  };
  const defaultPair=group=>legalPairs(group).reduce((best,pair)=>{
    const distance=(!pair.memory?0:Math.abs(valueNumber(pair.memory)-16)/16)+(!pair.storage?0:Math.abs(valueNumber(pair.storage)-512)/512);
    return !best||distance<best.distance?{...pair,distance}:best;
  },null);
  function defaultSelection(p){
    const groups=chipGroups(p);
    if(!groups.length)throw new Error(`缺少芯片选项：${p.name}`);
    const pair=defaultPair(groups[0]);
    if(!pair)throw new Error(`缺少合法配置：${p.name}`);
    return {chipIndex:0,memory:pair.memory,storage:pair.storage};
  }
  const sameSelection=(a,b)=>a.chipIndex===b.chipIndex&&a.memory===b.memory&&a.storage===b.storage;
  const dirtyProducts=(category=state.category)=>D.products.filter(p=>p.category===category).filter(p=>{
    const current=state.selections.get(p.id);
    return current&&!sameSelection(current,defaultSelection(p));
  });
  function ensureSelection(p){
    let s=state.selections.get(p.id);
    const groups=chipGroups(p);
    if(!s){
      s=defaultSelection(p);
      state.selections.set(p.id,s);
    }
    if(!groups[s.chipIndex])s.chipIndex=0;
    const pairs=legalPairs(groups[s.chipIndex]);
    if(!pairs.some(pair=>pair.memory===s.memory&&pair.storage===s.storage)){
      const pair=defaultPair(groups[s.chipIndex]);s.memory=pair.memory;s.storage=pair.storage;
    }
    return s;
  }
  const weightedGeo=items=>{
    const usable=items.filter(x=>Number.isFinite(x.ratio)&&x.ratio>0&&x.weight>0);
    if(!usable.length)return null;
    const total=usable.reduce((a,x)=>a+x.weight,0);
    return Math.exp(usable.reduce((a,x)=>a+x.weight*Math.log(x.ratio),0)/total)*100;
  };
  function indices(category,bench){
    const base=D.benchmarks[D.baselines[category]];
    const ratio=(a,b)=>a&&b?a/b:null;
    let single,multi;
    if(category==='mac'){
      single=weightedGeo([{ratio:ratio(bench.cpu.gbS,base.cpu.gbS),weight:.6},{ratio:ratio(bench.cpu.cbS,base.cpu.cbS),weight:.3},{ratio:ratio(bench.cpu.pmS,base.cpu.pmS),weight:.1}]);
      multi=weightedGeo([{ratio:ratio(bench.cpu.gbM,base.cpu.gbM),weight:.55},{ratio:ratio(bench.cpu.cbM,base.cpu.cbM),weight:.3},{ratio:ratio(bench.cpu.pmM,base.cpu.pmM),weight:.15}]);
    }else{
      single=weightedGeo([{ratio:ratio(bench.cpu.gbS,base.cpu.gbS),weight:1}]);
      multi=weightedGeo([{ratio:ratio(bench.cpu.gbM,base.cpu.gbM),weight:1}]);
    }
    const gpu=weightedGeo([{ratio:ratio(bench.gpu.gb,base.gpu.gb),weight:.45},{ratio:ratio(bench.gpu.threeD,base.gpu.threeD),weight:.35},{ratio:ratio(bench.gpu.flops,base.gpu.flops),weight:.2}]);
    return {single,multi,gpu};
  }
  /*
   * 二手价格：直接样本锚点优先；无直接锚点时，只用同系列锚点校准原有相对阶梯。
   * 这些区间统一对应普通正常成色，不含故障、监管、扩容、回收报价或配件打包。
   */
  const marketAnchors={
    '11':[1050,1450],'13pro':[2600,3100],'13pm':[3300,4000],'14pro':[3700,4200],
    '15pro':[3950,4450],'16pro':[4800,5500],'16pm':[6000,6800],'17':[5000,5600],
    ipad9:[950,1250],ipadmini5:[700,1000],ipadair5:[2300,2800],ipadpro11_3:[2800,3600],
    ipadpro129_5:[3400,4300],ipadpro11_m4:[4800,6100],ipadpro13_m4:[6500,7900],
    mbp15_2016:[900,1500],mba13_2017:[350,650],mbp16_2019:[2700,3500],
    mba13_m1:[2900,3500],mbp14_2021:[4500,5500],mbp16_2021:[5000,5700],
    mba13_m2:[4200,4900],mbp14_m2:[6200,7500],mba13_m3:[5200,5900],
    mbp16_m3:[9200,10300],mba13_m4:[5600,6500],mbp14_m4:[7600,9000],
    mba13_m5:[5200,6200],mbp14_m5:[9000,10200]
  };
  const memoryAdjust={'8GB':-900,'12GB':-450,'16GB':0,'18GB':350,'24GB':850,'32GB':1700,'36GB':2200,'48GB':3400,'64GB':5000,'96GB':7600,'128GB':9800};
  const storageAdjust={'16GB':-1500,'32GB':-1300,'64GB':-1000,'128GB':-700,'256GB':-400,'512GB':0,'1TB':850,'1.5TB':1200,'2TB':1750,'4TB':3600,'8TB':6200};
  const adjust=(map,key)=>map[key]??0;
  const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
  const midpoint=range=>(range[0]+range[1])/2;
  const spreadRate=range=>(range[1]-range[0])/(range[1]+range[0]);
  const round50=n=>Math.round(n/50)*50;
  const anchorRows=()=>Object.entries(marketAnchors).map(([id,xy])=>{
    const product=D.products.find(p=>p.id===id);
    return product?{product,xy,factor:midpoint(xy)/midpoint(product.marketSeed)}:null;
  }).filter(Boolean);
  function weightedAnchorFactor(p,rows){
    const weighted=rows.map(row=>({row,weight:1/(1+Math.abs(row.product.year-p.year))}));
    const total=weighted.reduce((sum,x)=>sum+x.weight,0);
    return weighted.reduce((sum,x)=>sum+x.row.factor*x.weight,0)/total;
  }
  function calibratedBaseRange(p){
    if(marketAnchors[p.id])return [...marketAnchors[p.id]];
    const all=anchorRows(),sameFamily=all.filter(row=>row.product.category===p.category&&row.product.type===p.type);
    const sameCategory=all.filter(row=>row.product.category===p.category);
    let factor;
    if(sameFamily.length>=2)factor=weightedAnchorFactor(p,sameFamily);
    else if(sameFamily.length===1)factor=sameFamily[0].factor*.65+weightedAnchorFactor(p,sameCategory)*.35;
    else factor=weightedAnchorFactor(p,sameCategory);
    const mid=midpoint(p.marketSeed)*factor;
    const rate=clamp(.14+Math.max(0,2026-p.year-3)*.012,.14,.28);
    const low=Math.max(100,round50(mid*(1-rate))),high=Math.max(low+50,round50(mid*(1+rate)));
    return [low,high];
  }
  function upgradeRetention(p){
    const byAge=[.62,.55,.48,.42,.38,.34,.29,.25,.21,.18,.15];
    return byAge[clamp(2026-p.year,0,10)];
  }
  function marketEstimate(p,group,option,s,basePair,baseOption){
    const base=calibratedBaseRange(p),baseMid=midpoint(base),baseRate=spreadRate(base);
    const groupAnchor=defaultPair(group);
    const bundle=((option.bundleDelta||0)-(baseOption.bundleDelta||0))*upgradeRetention(p);
    const componentRetention=Math.min(.78,upgradeRetention(p)*1.5);
    const within=(adjust(memoryAdjust,s.memory)-adjust(memoryAdjust,groupAnchor.memory)+adjust(storageAdjust,s.storage)-adjust(storageAdjust,groupAnchor.storage))*componentRetention;
    const capUp=baseMid*(p.year<=2020?.9:p.year<=2022?1.4:1.8);
    const delta=clamp(bundle+within,-baseMid*.65,capUp);
    const xyMid=Math.max(150,baseMid+delta),xyRate=clamp(baseRate+Math.min(.06,Math.abs(delta)/baseMid*.025),.06,.3);
    const xyLow=Math.max(100,round50(xyMid*(1-xyRate))),xyHigh=Math.max(xyLow+50,round50(xyMid*(1+xyRate)));
    const servicePremium={iphone:.10,ipad:.11,mac:.12}[p.category];
    const zzMid=xyMid+Math.max(100,xyMid*servicePremium),zzRate=clamp(xyRate*.72,.09,.18);
    const zzLow=Math.max(100,round50(zzMid*(1-zzRate))),zzHigh=Math.max(zzLow+50,round50(zzMid*(1+zzRate)));
    return {xy:[xyLow,xyHigh],zz:[zzLow,zzHigh],asOf:D.marketPolicy.snapshot};
  }
  function viewOf(p){
    const s=ensureSelection(p),groups=chipGroups(p),group=groups[s.chipIndex],pair=legalPairs(group).find(x=>x.memory===s.memory&&x.storage===s.storage),option=pair.option,bench=D.benchmarks[group.bench];
    if(!bench)throw new Error(`缺少芯片数据：${option.bench}`);
    const basePair=defaultPair(chipGroups(p)[0]),baseOption=basePair.option;
    const market=marketEstimate(p,group,option,s,basePair,baseOption);
    const specs={...p.specs,...(bench.specs||{}),...(option.specs||{})};
    const pairs=legalPairs(group),memories=[...new Set(pairs.map(x=>x.memory).filter(Boolean))],storages=[...new Set(pairs.map(x=>x.storage).filter(Boolean))];
    if(memories.length)specs.memoryOptions=memories.join(' / ');
    if(storages.length)specs.storageOptions=storages.join(' / ');
    const official=option.official||p.official;
    return {p,s,option,bench,indices:indices(p.category,bench),market,specs,official};
  }
  function auditAllMarketConfigs(){
    return D.products.flatMap(p=>{
      const groups=chipGroups(p),basePair=defaultPair(groups[0]),baseOption=basePair.option;
      return groups.flatMap(group=>legalPairs(group).map(pair=>({
        id:p.id,bench:group.bench,memory:pair.memory,storage:pair.storage,
        market:marketEstimate(p,group,pair.option,{memory:pair.memory,storage:pair.storage},basePair,baseOption)
      })));
    });
  }
  window.__APPLE_MARKET_AUDIT__={all:auditAllMarketConfigs};
  const marketAudit=auditAllMarketConfigs();
  const marketAuditInvalid=marketAudit.filter(x=>[...x.market.xy,...x.market.zz].some(v=>!Number.isFinite(v)||v<=0)||x.market.xy[0]>x.market.xy[1]||x.market.zz[0]>x.market.zz[1]);
  const marketAuditExact85=marketAudit.filter(x=>Math.abs(midpoint(x.market.zz)/midpoint(x.market.xy)-.85)<.005);
  document.documentElement.dataset.marketAuditCount=String(marketAudit.length);
  document.documentElement.dataset.marketAuditInvalid=String(marketAuditInvalid.length);
  document.documentElement.dataset.marketAuditExact85=String(marketAuditExact85.length);
  document.documentElement.dataset.marketAuditMin=String(Math.min(...marketAudit.map(x=>x.market.xy[0])));
  document.documentElement.dataset.marketAuditMax=String(Math.max(...marketAudit.map(x=>x.market.xy[1])));

  function initControls(){
    $('#categoryTabs').innerHTML=['iphone','ipad','mac'].map(c=>`<button class="tab ${c===state.category?'active':''}" data-category="${c}">${categoryName[c]}</button>`).join('');
    const years=[...new Set(D.products.map(p=>p.year))].sort((a,b)=>b-a);
    $('#year').insertAdjacentHTML('beforeend',years.map(y=>`<option>${y}</option>`).join(''));
    renderTypes();render();
  }
  function renderTypes(){
    const types=[...new Set(D.products.filter(p=>p.category===state.category).map(p=>p.type))];
    if(state.type!=='all'&&!types.includes(state.type))state.type='all';
    $('#typeFilter').innerHTML=`<option value="all">全部系列</option>${types.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join('')}`;
    $('#typeFilter').value=state.type;
  }
  function renderResetControl(){
    const count=dirtyProducts().length,button=$('#resetConfigs'),badge=$('#resetCount');
    button.hidden=count===0;button.disabled=count===0;
    badge.hidden=count===0;badge.textContent=count||'';
    button.setAttribute('aria-label',count?`复位 ${categoryName[state.category]} 中 ${count} 款已调整配置`:'复位配置');
  }
  function filtered(){
    const q=state.search.trim().toLowerCase();
    const list=D.products.filter(p=>{
      const hay=[p.name,p.type,...Object.values(p.specs),...p.chipOptions.flatMap(c=>[D.benchmarks[c.bench]?.name||'',...Object.values(c.specs||{})])].join(' ').toLowerCase();
      return p.category===state.category&&(state.year==='all'||p.year===+state.year)&&(state.type==='all'||p.type===state.type)&&(!q||hay.includes(q));
    }).map(viewOf);
    const sorters={
      yearDesc:(a,b)=>b.p.date.localeCompare(a.p.date),yearAsc:(a,b)=>a.p.date.localeCompare(b.p.date),
      singleDesc:(a,b)=>(b.indices.single||0)-(a.indices.single||0),multiDesc:(a,b)=>(b.indices.multi||0)-(a.indices.multi||0),
      gpuDesc:(a,b)=>(b.indices.gpu||0)-(a.indices.gpu||0),priceAsc:(a,b)=>a.market.xy[0]-b.market.xy[0]
    };
    return list.sort(sorters[state.sort]);
  }
  const columnMaxima=list=>['single','multi','gpu'].reduce((out,kind)=>{
    out[kind]=list.reduce((max,v)=>{const n=Number(v.indices[kind]);return Number.isFinite(n)&&n>max?n:max},0);return out;
  },{single:0,multi:0,gpu:0});
  function metricCell(v,kind,max){
    const value=Number.isFinite(Number(v))?Math.max(0,Number(v)):0;
    const width=max>0?Math.min(100,value/max*100):0;
    return `<div class="metric"><div class="metric-head"><b>${Math.round(value)}%</b></div><div class="track"><div class="fill ${kind}" style="width:${width.toFixed(2)}%"></div></div></div>`;
  }
  function configHtml(v,mode='table'){
    const {p,s,option,bench}=v;
    const groups=chipGroups(p),group=groups[s.chipIndex],pairs=legalPairs(group);
    const initial=defaultSelection(p),chipModified=s.chipIndex!==initial.chipIndex;
    const targetModified=chipModified||s.memory!==initial.memory||s.storage!==initial.storage;
    const chipModifiedClass=chipModified?' is-modified':'',targetModifiedClass=targetModified?' is-modified':'';
    const chipLabel=esc(D.benchmarks[group.bench].name);
    const chip=groups.length===1?`<span class="static-value${chipModifiedClass}">${chipLabel}</span>`:`<select class="select-control product-select chip-select${chipModifiedClass}" data-chip="${p.id}" aria-label="${esc(p.name)} 芯片${chipModified?'（已调整）':''}">${groups.map((g,i)=>`<option value="${i}" ${i===s.chipIndex?'selected':''}>${esc(D.benchmarks[g.bench].name)}</option>`).join('')}</select>`;
    const targetLabel=pair=>[pair.memory,pair.storage].filter(Boolean).join(' + ')||'固定配置';
    const target=pairs.length===1?`<span class="static-value${targetModifiedClass}">${esc(targetLabel(pairs[0]))}</span>`:`<select class="select-control product-select target-select full${targetModifiedClass}" data-config="${p.id}" aria-label="目标规格组合${targetModified?'（已调整）':''}">${pairs.map(pair=>`<option value="${esc(pair.key)}" ${pair.memory===s.memory&&pair.storage===s.storage?'selected':''}>${esc(targetLabel(pair))}</option>`).join('')}</select>`;
    const note=option.note?`<span class="selection-note">${esc(option.note)}</span>`:'';
    if(mode==='card')return `<div class="config-field"><span>芯片</span>${chip}</div><div class="config-field"><span>目标规格</span>${target}</div>${note}`;
    return {chip:`<div class="select-stack">${chip}<span class="core-line">${bench.cpu.cores||'—'} 核 CPU · ${bench.gpu.cores||'—'} 核 GPU</span></div>`,target:`<div class="config-stack">${target}${note}</div>`};
  }
  const searchLink=(site,v)=>{
    const q=[v.p.name,v.bench.name.split('·')[0].trim(),v.s.memory,v.s.storage].filter(Boolean).join(' ');
    return site==='xy'?`https://www.goofish.com/search?q=${encodeURIComponent(q)}`:`https://www.zhuanzhuan.com/search?keyword=${encodeURIComponent(q)}`;
  };
  function tableHtml(list){
    const baseline=esc(D.baselineLabels[state.category]);
    const maxima=columnMaxima(list);
    const head=`<div class="table-shell"><table><thead><tr><th class="sticky-product">机型</th><th>芯片</th><th>配置</th><th>CPU 单核<small>${baseline} = 100%</small></th><th>CPU 多核<small>${baseline} = 100%</small></th><th>GPU<small>${baseline} = 100%</small></th><th>二手购入估值<small>普通成色 · 2026-08</small></th></tr></thead><tbody>`;
    const body=list.map(v=>{
      const c=configHtml(v);
      return `<tr><td class="sticky-product product-cell"><div class="product">${esc(v.p.name)}</div><span class="subtype">${v.p.year} · ${esc(v.p.type)}</span><div class="micro-actions"><button class="text-btn" data-spec="${v.p.id}">规格</button><button class="text-btn" data-compare="${v.p.id}">对比</button><a class="source-link" href="${esc(v.official)}" target="_blank" rel="noreferrer">Apple</a></div></td><td>${c.chip}</td><td>${c.target}</td><td>${metricCell(v.indices.single,'single',maxima.single)}</td><td>${metricCell(v.indices.multi,'multi',maxima.multi)}</td><td>${metricCell(v.indices.gpu,'gpu',maxima.gpu)}</td><td class="market-price"><div><span>闲鱼个人</span><a href="${searchLink('xy',v)}" target="_blank" rel="noreferrer" title="个人挂牌 / 近期成交估值；点击搜索当前配置">¥${fmt(v.market.xy[0])}–${fmt(v.market.xy[1])}</a></div><div><span>转转验机</span><a href="${searchLink('zz',v)}" target="_blank" rel="noreferrer" title="带验机和售后服务的买家零售估值；不是回收价">≈ ¥${fmt(v.market.zz[0])}–${fmt(v.market.zz[1])}</a></div></td></tr>`;
    }).join('');
    return head+body+'</tbody></table></div>';
  }
  function cardsHtml(list){
    return `<div class="cards">${list.map(v=>`<article class="card"><div class="card-top"><div><span class="subtype">${v.p.year} · ${esc(v.p.type)}</span><h3>${esc(v.p.name)}</h3></div><a class="source-link" href="${esc(v.official)}" target="_blank" rel="noreferrer">Apple</a></div><div class="card-config">${configHtml(v,'card')}</div><div class="card-metrics"><div class="metric-box"><small>单核</small><b>${Math.round(v.indices.single)}%</b></div><div class="metric-box"><small>多核</small><b>${Math.round(v.indices.multi)}%</b></div><div class="metric-box"><small>GPU</small><b>${Math.round(v.indices.gpu)}%</b></div></div><div class="card-prices"><div><small>闲鱼个人</small><a href="${searchLink('xy',v)}" target="_blank" rel="noreferrer">¥${fmt(v.market.xy[0])}–${fmt(v.market.xy[1])}</a></div><div><small>转转验机估值</small><a href="${searchLink('zz',v)}" target="_blank" rel="noreferrer">≈ ¥${fmt(v.market.zz[0])}–${fmt(v.market.zz[1])}</a></div></div><div class="card-actions"><button class="compare" data-compare="${v.p.id}">加入对比</button><button class="text-btn" data-spec="${v.p.id}">查看规格</button></div></article>`).join('')}</div>`;
  }
  function render(){
    const list=filtered();
    $('#sectionTitle').textContent=categoryName[state.category];
    $('#resultCount').textContent=`共 ${list.length} 款`;
    const base=esc(D.baselineLabels[state.category]);
    $('#baselineBadges').textContent=`数字：${base} = 100% · 条形：每列最高为满格`;
    $('#openPencil').hidden=state.category!=='ipad';
    $('#results').innerHTML=list.length?(state.view==='table'?tableHtml(list):cardsHtml(list)):'<div class="empty">没有符合条件的产品，试试清除年份或关键词。</div>';
    renderResetControl();
  }
  function selectionChange(id,field,value){
    const p=D.products.find(x=>x.id===id),s=ensureSelection(p);
    if(field==='chip'){
      s.chipIndex=+value;const pair=defaultPair(chipGroups(p)[s.chipIndex]);s.memory=pair.memory;s.storage=pair.storage;
    }else if(field==='config'){
      const [memory,storage]=value.split('||');s.memory=memory;s.storage=storage;
    }
    render();
    $('#configStatus').textContent=sameSelection(s,defaultSelection(p))?`${p.name} 已恢复默认配置`:`${p.name} 配置已调整，可使用复位配置恢复`;
  }
  function resetCategorySelections(){
    const category=state.category,dirty=dirtyProducts(category);
    dirty.forEach(p=>state.selections.delete(p.id));
    render();
    $('#configStatus').textContent=`${categoryName[category]} 的 ${dirty.length} 款已调整配置已复位`;
  }
  const openModal=id=>{$('#'+id)?.classList.add('open');document.body.style.overflow='hidden'};
  const closeModal=id=>{$('#'+id)?.classList.remove('open');if(!$('.modal.open'))document.body.style.overflow=''};
  const specLabels={
    memoryOptions:'该芯片可选内存',storageOptions:'该芯片可选存储',gpuMemory:'独显显存',memoryBandwidth:'内存带宽',mediaEngine:'媒体引擎',neuralAccelerator:'神经网络加速器',
    display:'屏幕',resolution:'分辨率',refresh:'刷新率',brightness:'亮度',colors:'机身颜色',weight:'重量',battery:'电池',batteryRuntime:'官方续航',power:'随附电源',
    ports:'接口',external:'外接显示器',camera:'摄像头',wireless:'无线连接'
  };
  const specOrder=['memoryOptions','storageOptions','gpuMemory','memoryBandwidth','mediaEngine','neuralAccelerator','display','resolution','refresh','brightness','colors','weight','battery','batteryRuntime','power','ports','external','camera','wireless'];
  const cpuCoreText=bench=>{
    const detail=bench.cpu.coreBreakdown||(bench.cpu.p!=null?`${bench.cpu.p} 个性能核心 + ${bench.cpu.e} 个能效核心`:null);
    return `${bench.cpu.cores} 核${detail?`（${detail}）`:''}`;
  };
  function showSpecs(id){
    const v=viewOf(D.products.find(p=>p.id===id));
    const fields=[['芯片',v.bench.name],['CPU 核心',cpuCoreText(v.bench)],['GPU 核心',v.bench.gpu.cores?`${v.bench.gpu.cores} 核 / 执行单元`:'Apple 未标注'],['当前内存',v.s.memory||'固定'],['当前存储',v.s.storage||'固定'],['CPU 单核',`${Math.round(v.indices.single)}%（${D.baselineLabels[v.p.category]} = 100%）`],['CPU 多核',`${Math.round(v.indices.multi)}%（${D.baselineLabels[v.p.category]} = 100%）`],['GPU 综合',`${Math.round(v.indices.gpu)}%（${D.baselineLabels[v.p.category]} = 100%）`]];
    specOrder.forEach(key=>{if(v.specs[key]!=null&&v.specs[key]!=='')fields.push([specLabels[key],v.specs[key]])});
    $('#specTitle').textContent=v.p.name;
    $('#specBody').innerHTML=`<div class="spec-grid">${fields.map(([k,val])=>`<div class="spec-item"><span>${esc(k)}</span><b>${esc(val||'Apple 未标注')}</b></div>`).join('')}</div><a class="spec-source" href="${esc(v.official)}" target="_blank" rel="noreferrer">打开当前芯片对应的 Apple 官方技术规格 ↗</a>`;
    openModal('specModal');
  }
  function snapshot(v){return {key:[v.p.id,v.option.bench,v.s.memory,v.s.storage].join('|'),name:v.p.name,year:v.p.year,chip:v.bench.name,memory:v.s.memory||'固定',storage:v.s.storage||'固定',indices:{...v.indices},market:{xy:[...v.market.xy],zz:[...v.market.zz]},specs:{...v.specs},official:v.official}}
  function addCompare(id){
    const snap=snapshot(viewOf(D.products.find(p=>p.id===id)));
    if(state.compare.some(x=>x.key===snap.key))return;
    if(state.compare.length>=4)state.compare.shift();
    state.compare.push(snap);renderDock();
  }
  function renderDock(){
    $('#compareDock').classList.toggle('show',state.compare.length>0);
    $('#compareCount').textContent=`${state.compare.length}/4`;
    $('#dockItems').innerHTML=state.compare.map((x,i)=>`<span class="dock-item">${esc(x.name)} · ${esc(x.storage)}<button data-remove-compare="${i}" aria-label="移除">×</button></span>`).join('');
  }
  function showCompare(){
    if(!state.compare.length)return;
    const rows=[['芯片',x=>x.chip],['目标规格组合',x=>[x.memory,x.storage].filter(Boolean).join(' + ')],['CPU 单核',x=>`${Math.round(x.indices.single)}%`],['CPU 多核',x=>`${Math.round(x.indices.multi)}%`],['GPU 综合',x=>`${Math.round(x.indices.gpu)}%`],['闲鱼个人估值',x=>`¥${fmt(x.market.xy[0])}–${fmt(x.market.xy[1])}`],['转转验机估值',x=>`约 ¥${fmt(x.market.zz[0])}–${fmt(x.market.zz[1])}`],['独显显存',x=>x.specs.gpuMemory],['内存带宽',x=>x.specs.memoryBandwidth],['媒体引擎',x=>x.specs.mediaEngine],['屏幕',x=>`${x.specs.display} · ${x.specs.resolution}`],['刷新率',x=>x.specs.refresh],['重量',x=>x.specs.weight],['电池',x=>x.specs.battery],['官方续航',x=>x.specs.batteryRuntime],['随附电源',x=>x.specs.power],['接口',x=>x.specs.ports],['外接显示器',x=>x.specs.external]];
    $('#compareGrid').style.gridTemplateColumns=`130px repeat(${state.compare.length},minmax(190px,1fr))`;
    $('#compareGrid').innerHTML=`<div class="cmp-cell label">配置</div>${state.compare.map(x=>`<div class="cmp-cell cmp-product"><b>${esc(x.name)}</b><small>${x.year} · 当前选择快照</small></div>`).join('')}${rows.map(([label,get])=>`<div class="cmp-cell label">${label}</div>${state.compare.map(x=>`<div class="cmp-cell">${esc(get(x)||'Apple 未标注')}</div>`).join('')}`).join('')}`;
    openModal('compareModal');
  }

  document.addEventListener('click',e=>{
    const cat=e.target.closest('[data-category]');if(cat){state.category=cat.dataset.category;state.year='all';$('#year').value='all';$$('.tab').forEach(b=>b.classList.toggle('active',b===cat));renderTypes();render();return}
    const spec=e.target.closest('[data-spec]');if(spec){showSpecs(spec.dataset.spec);return}
    const cmp=e.target.closest('[data-compare]');if(cmp){addCompare(cmp.dataset.compare);return}
    const rem=e.target.closest('[data-remove-compare]');if(rem){state.compare.splice(+rem.dataset.removeCompare,1);renderDock();return}
    const close=e.target.closest('[data-close]');if(close){closeModal(close.dataset.close);return}
    if(e.target.classList.contains('modal'))closeModal(e.target.id);
  });
  document.addEventListener('change',e=>{
    if(e.target.matches('[data-chip]'))selectionChange(e.target.dataset.chip,'chip',e.target.value);
    if(e.target.matches('[data-config]'))selectionChange(e.target.dataset.config,'config',e.target.value);
  });
  $('#year').addEventListener('change',e=>{state.year=e.target.value;render()});
  $('#typeFilter').addEventListener('change',e=>{state.type=e.target.value;render()});
  $('#sort').addEventListener('change',e=>{state.sort=e.target.value;render()});
  $('#search').addEventListener('input',e=>{state.search=e.target.value;render()});
  $('#resetConfigs').addEventListener('click',resetCategorySelections);
  $('#openPencil').addEventListener('click',()=>openModal('pencilModal'));
  $('#clearCompare').addEventListener('click',()=>{state.compare=[];renderDock()});
  $('#openCompare').addEventListener('click',showCompare);
  compactView.addEventListener('change',e=>{state.view=e.matches?'cards':'table';render()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')$$('.modal.open').forEach(m=>closeModal(m.id))});
  initControls();
})();
