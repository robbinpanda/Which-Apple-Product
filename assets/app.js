(()=>{
  'use strict';
  const D=window.APPLE_DATA;
  if(!D)throw new Error('APPLE_DATA 未加载');
  const $=(s,root=document)=>root.querySelector(s);
  const $$=(s,root=document)=>[...root.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=n=>new Intl.NumberFormat('zh-CN').format(Math.round(n));
  const categoryName={iphone:'iPhone',ipad:'iPad',mac:'MacBook'};
  const compactView=window.matchMedia('(max-width:1450px)');
  const sortMeta={
    yearDesc:{label:'新款优先',short:'新款',hint:'按推出年份从新到旧'},priceAsc:{label:'闲鱼低价优先',short:'低价',hint:'按当前配置闲鱼模型起价从低到高'},
    singleDesc:{label:'单核性能优先',short:'单核',hint:'更看重日常响应速度'},multiDesc:{label:'多核性能优先',short:'多核',hint:'更看重多任务与专业负载'},gpuDesc:{label:'GPU 性能优先',short:'GPU',hint:'更看重游戏与图形任务'}
  };
  const searchExamples={iphone:'搜 iPhone 15、120Hz、USB-C…',ipad:'搜 M1、Pencil Pro、12.9 英寸…',mac:'搜 M1 Pro、HDMI、1.55kg…'};
  const latestYear=Math.max(...D.products.map(p=>p.year));
  const state={category:'iphone',year:'all',type:'all',search:'',budget:'',sort:'yearDesc',view:compactView.matches?'cards':'table',showAll:false,selections:new Map(),compare:[]};

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
  const implicitVariant=()=>({key:'default',label:'',variantDelta:0,isDefault:true,specs:{}});
  const variantsFor=option=>option.variants?.length?option.variants:[implicitVariant()];
  const legalPairs=group=>{
    const pairs=[],seen=new Set();
    group.options.forEach(option=>{
      const memories=option.memory.length?option.memory:[''];
      const storages=option.storage.length?option.storage:[''];
      memories.forEach(memory=>storages.forEach(storage=>variantsFor(option).forEach(variant=>{
        const key=`${memory}||${storage}||${variant.key}`;
        if(!seen.has(key)){seen.add(key);pairs.push({key,memory,storage,variant,option})}
      })));
    });
    return pairs;
  };
  const legalConfigurationText=group=>group.options.map(item=>{
    const memories=item.memory.length?item.memory.join(' / '):'固定内存';
    const storages=item.storage.length?item.storage.join(' / '):'固定存储';
    const variants=variantsFor(item).map(variant=>variant.label).filter(Boolean);
    return `${memories} × ${storages}${variants.length?` × ${variants.join(' / ')}`:''}`;
  }).join('；');
  const defaultPair=group=>legalPairs(group).reduce((best,pair)=>{
    const distance=(!pair.memory?0:Math.abs(valueNumber(pair.memory)-16)/16)+(!pair.storage?0:Math.abs(valueNumber(pair.storage)-512)/512)+(pair.variant.isDefault?0:100);
    return !best||distance<best.distance?{...pair,distance}:best;
  },null);
  function defaultSelection(p){
    const groups=chipGroups(p);
    if(!groups.length)throw new Error(`缺少芯片选项：${p.name}`);
    const candidates=groups.flatMap((group,chipIndex)=>legalPairs(group).map(pair=>{
      const targetDistance=(!pair.memory?0:Math.abs(valueNumber(pair.memory)-16)/16)+(!pair.storage?0:Math.abs(valueNumber(pair.storage)-512)/512);
      return {chipIndex,pair,targetDistance,variantPenalty:pair.variant.isDefault?0:1};
    })).sort((a,b)=>a.variantPenalty-b.variantPenalty||a.targetDistance-b.targetDistance||a.chipIndex-b.chipIndex);
    const selected=candidates[0];
    if(!selected)throw new Error(`缺少合法配置：${p.name}`);
    return {chipIndex:selected.chipIndex,memory:selected.pair.memory,storage:selected.pair.storage,variantKey:selected.pair.variant.key};
  }
  const sameSelection=(a,b)=>a.chipIndex===b.chipIndex&&a.memory===b.memory&&a.storage===b.storage&&a.variantKey===b.variantKey;
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
    if(!pairs.some(pair=>pair.memory===s.memory&&pair.storage===s.storage&&pair.variant.key===s.variantKey)){
      const pair=defaultPair(groups[s.chipIndex]);s.memory=pair.memory;s.storage=pair.storage;s.variantKey=pair.variant.key;
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
    const comparable3D=bench.gpu.threeDTest&&bench.gpu.threeDTest===base.gpu.threeDTest;
    const gpu=weightedGeo([{ratio:ratio(bench.gpu.gb,base.gpu.gb),weight:.45},{ratio:comparable3D?ratio(bench.gpu.threeD,base.gpu.threeD):null,weight:.35},{ratio:ratio(bench.gpu.flops,base.gpu.flops),weight:.2}]);
    return {single,multi,gpu};
  }
  /*
   * 二手价格：近期公开样本支持的校准锚点优先；其余锚点仍是模型输入，
   * 不是逐 SKU、逐平台的独立实测。无锚点时只用同系列校准相对阶梯。
   * 这些区间统一对应普通正常成色，不含故障、监管、扩容、回收报价或配件打包。
   */
  const anchor=(range,bench,memory,storage,variantKey='default')=>({range,bench,memory:memory||'',storage:storage||'',variantKey});
  /* 锚点必须显式绑定到芯片、内存、存储。它们恰好对应当前默认组合，但不再
     依赖“默认选择算法”暗中解释 SKU；以后调整默认值时，审计会立即报错。 */
  const marketAnchors={
    '11':anchor([1050,1450],'a13','', '256GB'),'13pro':anchor([2600,3100],'a15_5','', '512GB'),'13pm':anchor([3300,4000],'a15_5','', '512GB'),'14pro':anchor([3700,4200],'a16','', '512GB'),
    '15pro':anchor([3950,4450],'a17pro','', '512GB'),'16pro':anchor([4800,5500],'a18pro','', '512GB'),'16pm':anchor([6000,6800],'a18pro','', '512GB'),'17':anchor([5000,5600],'a19','', '512GB'),
    ipad9:anchor([950,1250],'a13','', '256GB','wlan-standard'),ipadmini5:anchor([700,1000],'a12','', '256GB','wlan-standard'),ipadair5:anchor([2300,2800],'m1_ipad','8GB','256GB','wlan-standard'),ipadpro11_3:anchor([2800,3600],'m1_ipad','8GB','512GB','wlan-standard'),
    ipadpro129_5:anchor([3400,4300],'m1_ipad','8GB','512GB','wlan-standard'),ipadpro11_m4:anchor([4800,6100],'m4_ipad_9','8GB','512GB','wlan-standard'),ipadpro13_m4:anchor([6500,7900],'m4_ipad_9','8GB','512GB','wlan-standard'),
    mbp15_2016:anchor([900,1500],'mx15_2016_26_450','16GB','512GB'),mba13_2017:anchor([350,650],'intel_air_old_i5','8GB','512GB'),mbp16_2019:anchor([2700,3500],'mx16_2019_26_5300','16GB','512GB'),
    mba13_m1:anchor([2900,3500],'m1_8_7','16GB','512GB'),mbp14_2021:anchor([4500,5500],'m1pro_8_14','16GB','512GB'),mbp16_2021:anchor([5000,5700],'m1pro_10_16','16GB','512GB'),
    mba13_m2:anchor([4200,4900],'m2_8_8','16GB','512GB'),mbp14_m2:anchor([6200,7500],'m2pro_10_16','16GB','512GB'),mba13_m3:anchor([5200,5900],'m3_8_10','16GB','512GB'),
    mbp16_m3:anchor([9200,10300],'m3pro_12_18','18GB','512GB'),mba13_m4:anchor([5600,6500],'m4_10_10','16GB','512GB'),mbp14_m4:anchor([7600,9000],'m4_10_10','16GB','512GB','standard'),
    mba13_m5:anchor([5200,6200],'m5_10_8','16GB','512GB'),mbp14_m5:anchor([9000,10200],'m5_10_10','16GB','512GB','standard')
  };
  const defaultConfig=p=>{
    const selection=defaultSelection(p),group=chipGroups(p)[selection.chipIndex];
    return {bench:group.bench,memory:selection.memory,storage:selection.storage,variantKey:selection.variantKey};
  };
  const productBasePair=p=>{
    const selection=defaultSelection(p),group=chipGroups(p)[selection.chipIndex];
    return legalPairs(group).find(pair=>pair.memory===selection.memory&&pair.storage===selection.storage&&pair.variant.key===selection.variantKey);
  };
  const anchorAudit=Object.entries(marketAnchors).map(([id,value])=>{
    const product=D.products.find(p=>p.id===id);
    const config=product?defaultConfig(product):null;
    return {id,value,product,config,valid:!!product&&config.bench===value.bench&&config.memory===value.memory&&config.storage===value.storage&&config.variantKey===value.variantKey};
  });
  const badAnchors=anchorAudit.filter(item=>!item.valid);
  if(badAnchors.length)throw new Error(`价格锚点 SKU 与默认配置不一致：${badAnchors.map(item=>item.id).join(', ')}`);
  const memoryAdjust={'8GB':-900,'12GB':-450,'16GB':0,'18GB':350,'24GB':850,'32GB':1700,'36GB':2200,'48GB':3400,'64GB':5000,'96GB':7600,'128GB':9800};
  const storageAdjust={'16GB':-1500,'32GB':-1300,'64GB':-1000,'128GB':-700,'256GB':-400,'512GB':0,'1TB':850,'1.5TB':1200,'2TB':1750,'4TB':3600,'8TB':6200};
  const adjust=(map,key)=>map[key]??0;
  const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
  const midpoint=range=>(range[0]+range[1])/2;
  const spreadRate=range=>(range[1]-range[0])/(range[1]+range[0]);
  const round50=n=>Math.round(n/50)*50;
  const anchorRows=()=>Object.entries(marketAnchors).map(([id,anchorValue])=>{
    const product=D.products.find(p=>p.id===id);
    return product?{product,xy:anchorValue.range,factor:midpoint(anchorValue.range)/midpoint(product.marketSeed)}:null;
  }).filter(Boolean);
  function weightedAnchorFactor(p,rows){
    const weighted=rows.map(row=>({row,weight:1/(1+Math.abs(row.product.year-p.year))}));
    const total=weighted.reduce((sum,x)=>sum+x.weight,0);
    return weighted.reduce((sum,x)=>sum+x.row.factor*x.weight,0)/total;
  }
  function calibratedBaseRange(p){
    if(marketAnchors[p.id])return [...marketAnchors[p.id].range];
    const all=anchorRows(),sameFamily=all.filter(row=>row.product.category===p.category&&row.product.type===p.type);
    const sameCategory=all.filter(row=>row.product.category===p.category);
    let factor;
    if(sameFamily.length>=2)factor=weightedAnchorFactor(p,sameFamily);
    else if(sameFamily.length===1)factor=sameFamily[0].factor*.65+weightedAnchorFactor(p,sameCategory)*.35;
    else factor=weightedAnchorFactor(p,sameCategory);
    const mid=midpoint(p.marketSeed)*factor;
    const snapshotYear=+D.marketPolicy.snapshot.slice(0,4);
    const rate=clamp(.14+Math.max(0,snapshotYear-p.year-3)*.012,.14,.28);
    const low=Math.max(100,round50(mid*(1-rate))),high=Math.max(low+50,round50(mid*(1+rate)));
    return [low,high];
  }
  function upgradeRetention(p){
    const byAge=[.62,.55,.48,.42,.38,.34,.29,.25,.21,.18,.15];
    const snapshotYear=+D.marketPolicy.snapshot.slice(0,4);
    return byAge[clamp(snapshotYear-p.year,0,10)];
  }
  function marketEstimate(p,group,option,s,basePair,baseOption){
    const base=calibratedBaseRange(p),baseMid=midpoint(base),baseRate=spreadRate(base);
    const explicitAnchor=marketAnchors[p.id];
    const isExactAnchor=!!explicitAnchor&&group.bench===explicitAnchor.bench&&s.memory===explicitAnchor.memory&&s.storage===explicitAnchor.storage&&s.variantKey===explicitAnchor.variantKey;
    const groupAnchor=defaultPair(group);
    const bundle=((option.bundleDelta||0)-(baseOption.bundleDelta||0))*upgradeRetention(p);
    const componentRetention=Math.min(.78,upgradeRetention(p)*1.5);
    const within=(adjust(memoryAdjust,s.memory)-adjust(memoryAdjust,groupAnchor.memory)+adjust(storageAdjust,s.storage)-adjust(storageAdjust,groupAnchor.storage))*componentRetention;
    const pair=legalPairs(group).find(item=>item.memory===s.memory&&item.storage===s.storage&&item.variant.key===s.variantKey);
    const variant=((pair?.variant.variantDelta||0)-(groupAnchor.variant.variantDelta||0))*upgradeRetention(p);
    const capUp=baseMid*(p.year<=2020?.9:p.year<=2022?1.4:1.8);
    const softUpper=(raw,cap)=>{
      const knee=cap*.70,tail=cap-knee;
      return raw<=knee?raw:knee+tail*(1-Math.exp(-(raw-knee)/tail));
    };
    const rawDelta=bundle+within+variant;
    const delta=rawDelta<0?Math.max(rawDelta,-baseMid*.65):softUpper(rawDelta,capUp);
    const xyMid=Math.max(150,baseMid+delta),xyRate=clamp(baseRate+Math.min(.06,Math.abs(delta)/baseMid*.025),.06,.3);
    let xyLow,xyHigh;
    if(isExactAnchor)[xyLow,xyHigh]=explicitAnchor.range;
    else{
      xyLow=Math.max(100,round50(xyMid*(1-xyRate)));
      xyHigh=Math.max(xyLow+50,round50(xyMid*(1+xyRate)));
    }
    const servicePremium={iphone:.10,ipad:.11,mac:.12}[p.category];
    const zzMid=xyMid+Math.max(100,xyMid*servicePremium),zzRate=clamp(xyRate*.72,.09,.18);
    const zzLow=Math.max(100,round50(zzMid*(1-zzRate))),zzHigh=Math.max(zzLow+50,round50(zzMid*(1+zzRate)));
    return {xy:[xyLow,xyHigh],zz:[zzLow,zzHigh],asOf:D.marketPolicy.snapshot};
  }
  function viewOf(p,selection=null){
    const s=selection?{...selection}:ensureSelection(p),groups=chipGroups(p),group=groups[s.chipIndex],pair=legalPairs(group).find(x=>x.memory===s.memory&&x.storage===s.storage&&x.variant.key===s.variantKey),option=pair.option,variant=pair.variant,bench=D.benchmarks[group.bench];
    if(!bench)throw new Error(`缺少芯片数据：${option.bench}`);
    const basePair=productBasePair(p),baseOption=basePair.option;
    const market=marketEstimate(p,group,option,s,basePair,baseOption);
    const specs={...p.specs,...(bench.specs||{}),...(option.specs||{}),...(variant.specs||{})};
    const pairs=legalPairs(group);
    specs.legalConfigurations=legalConfigurationText(group);
    const official=option.official||p.official;
    return {p,s,option,variant,bench,indices:indices(p.category,bench),market,specs,official};
  }
  function auditAllMarketConfigs(){
    return D.products.flatMap(p=>{
      const groups=chipGroups(p),basePair=productBasePair(p),baseOption=basePair.option;
      return groups.flatMap(group=>legalPairs(group).map(pair=>({
        id:p.id,bench:group.bench,memory:pair.memory,storage:pair.storage,variantKey:pair.variant.key,variantDelta:pair.variant.variantDelta||0,bundleDelta:pair.option.bundleDelta||0,
        market:marketEstimate(p,group,pair.option,{memory:pair.memory,storage:pair.storage,variantKey:pair.variant.key},basePair,baseOption)
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
    $('#categoryTabs').innerHTML=['iphone','ipad','mac'].map(c=>`<button class="tab ${c===state.category?'active':''}" data-category="${c}" aria-pressed="${c===state.category}">${categoryName[c]}</button>`).join('');
    const years=[...new Set(D.products.map(p=>p.year))].sort((a,b)=>b-a);
    $('#year').insertAdjacentHTML('beforeend',`<optgroup label="指定年份">${years.map(y=>`<option>${y}</option>`).join('')}</optgroup>`);
    $('#sortChoices').innerHTML=Object.entries(sortMeta).map(([key,item])=>`<button type="button" class="priority-option" data-sort="${key}" aria-pressed="${key===state.sort}" aria-label="${esc(`${item.short}优先：${item.hint}`)}" title="${esc(item.hint)}">${item.short}</button>`).join('');
    renderTypes();render();
  }
  function renderTypes(){
    const types=[...new Set(D.products.filter(p=>p.category===state.category).map(p=>p.type))];
    if(state.type!=='all'&&!types.includes(state.type))state.type='all';
    $('#typeFilter').innerHTML=`<option value="all">不限</option>${types.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join('')}`;
    $('#typeFilter').value=state.type;
  }
  function renderResetControl(){
    const count=dirtyProducts().length,button=$('#resetConfigs'),badge=$('#resetCount');
    button.hidden=count===0;button.disabled=count===0;
    badge.hidden=count===0;badge.textContent=count||'';
    button.setAttribute('aria-label',count?`复位 ${categoryName[state.category]} 中 ${count} 款已调整配置`:'复位配置');
  }
  const activeFilterCount=()=>Number(!!state.search)+Number(!!state.budget)+Number(state.year!=='all')+Number(state.type!=='all');
  const yearLabel=()=>state.year==='recent3'?'近 3 年':state.year==='recent5'?'近 5 年':state.year==='all'?'':`${state.year} 年`;
  function renderDiscoveryControls(){
    $$('.priority-option').forEach(button=>{const active=button.dataset.sort===state.sort;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});
    $('#search').placeholder=searchExamples[state.category];
    const filters=[];
    if(state.search)filters.push(['search',`搜索：${state.search}`]);
    if(state.budget)filters.push(['budget',`当前配置闲鱼起价 ≤ ¥${fmt(+state.budget)}`]);
    if(state.year!=='all')filters.push(['year',yearLabel()]);
    if(state.type!=='all')filters.push(['type',state.type]);
    $('#activeFilters').innerHTML=filters.map(([key,label])=>`<button type="button" class="filter-chip" data-clear-filter="${key}" aria-label="移除筛选：${esc(label)}">${esc(label)} <span aria-hidden="true">×</span></button>`).join('');
    $('#clearFilters').hidden=!filters.length;
    const moreCount=Number(state.year!=='all')+Number(state.type!=='all'),moreBadge=$('#moreFilterCount');
    moreBadge.hidden=!moreCount;moreBadge.textContent=moreCount||'';
  }
  function clearFilters(key='all'){
    if(key==='all'||key==='search'){state.search='';$('#search').value=''}
    if(key==='all'||key==='budget'){state.budget='';$('#budget').value=''}
    if(key==='all'||key==='year'){state.year='all';$('#year').value='all'}
    if(key==='all'||key==='type'){state.type='all';$('#typeFilter').value='all'}
    state.showAll=false;$('#changeNotice').hidden=true;
    render();
  }
  const yearMatches=p=>state.year==='all'||state.year==='recent3'&&p.year>=latestYear-2||state.year==='recent5'&&p.year>=latestYear-4||p.year===+state.year;
  const normalizedSearch=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/[‐‑‒–—―−]/g,'-').replace(/[^\p{L}\p{N}.\-]+/gu,' ').replace(/\s+/g,' ').trim();
  const searchTerms=()=>normalizedSearch(state.search).split(/\s+/).filter(Boolean);
  const searchText=v=>normalizedSearch([
    v.p.name,v.p.year,v.p.type,v.bench.name,v.s.memory,v.s.storage,v.variant.label||'',v.variant.searchTokens||'',v.option.note||'',
    ...Object.entries(v.specs).filter(([key])=>key!=='legalConfigurations').map(([,value])=>value),
    ...Object.values(v.option.specs||{})
  ].join(' '));
  const chipSearchIntent=()=>normalizedSearch(state.search).match(/\b(?:m\d+\s+(?:pro|max)|a\d+\s+pro)\b/)?.[0]||'';
  const textHasTerm=(text,term)=>/^[a-z0-9]$/.test(term)?text.split(/[^\p{L}\p{N}]+/u).includes(term):text.includes(term);
  const viewMatchesSearch=(v,terms=searchTerms())=>{
    if(!terms.length)return true;
    const chipIntent=chipSearchIntent(),text=searchText(v);
    return (!chipIntent||normalizedSearch(v.bench.name).includes(chipIntent))&&terms.every(term=>textHasTerm(text,term));
  };
  const configurationViews=p=>chipGroups(p).flatMap((group,chipIndex)=>legalPairs(group).map(pair=>viewOf(p,{chipIndex,memory:pair.memory,storage:pair.storage,variantKey:pair.variant.key})));
  const searchScore=(view,terms=searchTerms())=>{
    const query=normalizedSearch(state.search),chip=normalizedSearch(view.bench.name),target=normalizedSearch(`${view.s.memory} ${view.s.storage} ${view.variant.label} ${view.variant.searchTokens||''}`);
    return (query&&chip.includes(query)?100:0)+terms.reduce((score,term)=>score+(textHasTerm(chip,term)?12:textHasTerm(target,term)?10:1),0);
  };
  const firstMatchingView=(p,terms=searchTerms())=>{
    const current=viewOf(p),views=[current,...configurationViews(p).filter(view=>viewKey(view)!==viewKey(current))];
    return views.filter(view=>viewMatchesSearch(view,terms)).sort((a,b)=>searchScore(b,terms)-searchScore(a,terms))[0];
  };
  function syncSelectionsToSearch(category=state.category){
    const terms=searchTerms();if(!terms.length)return 0;
    let changed=0;
    const budget=Number(state.budget)||0;
    D.products.filter(p=>p.category===category&&yearMatches(p)&&(state.type==='all'||p.type===state.type)).forEach(p=>{
      const current=viewOf(p);
      const match=firstMatchingView(p,terms);
      if(match&&(!budget||match.market.xy[0]<=budget)&&viewKey(match)!==viewKey(current)){state.selections.set(p.id,{...match.s});changed++}
    });
    return changed;
  }
  function filtered(category=state.category,ignoreCategoryFilters=false){
    const terms=searchTerms(),budget=Number(state.budget)||0;
    const list=D.products.filter(p=>p.category===category&&(ignoreCategoryFilters||(yearMatches(p)&&(state.type==='all'||p.type===state.type)))).map(p=>viewOf(p)).filter(v=>
      viewMatchesSearch(v,terms)&&(!budget||v.market.xy[0]<=budget)
    );
    const sorters={
      yearDesc:(a,b)=>b.p.sortDate.localeCompare(a.p.sortDate),
      singleDesc:(a,b)=>(b.indices.single||0)-(a.indices.single||0),multiDesc:(a,b)=>(b.indices.multi||0)-(a.indices.multi||0),
      gpuDesc:(a,b)=>(b.indices.gpu||0)-(a.indices.gpu||0),priceAsc:(a,b)=>a.market.xy[0]-b.market.xy[0]
    };
    const stable=(a,b)=>a.market.xy[0]-b.market.xy[0]||b.p.year-a.p.year||a.p.name.localeCompare(b.p.name,'zh-CN');
    return list.sort((a,b)=>sorters[state.sort](a,b)||stable(a,b));
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
    const targetModified=chipModified||s.memory!==initial.memory||s.storage!==initial.storage||s.variantKey!==initial.variantKey;
    const chipModifiedClass=chipModified?' is-modified':'',targetModifiedClass=targetModified?' is-modified':'';
    const chipLabel=esc(D.benchmarks[group.bench].name);
    const chip=groups.length===1?`<span class="static-value${chipModifiedClass}">${chipLabel}</span>`:`<select class="select-control product-select chip-select${chipModifiedClass}" data-chip="${p.id}" aria-label="${esc(p.name)} 芯片${chipModified?'（已调整）':''}">${groups.map((g,i)=>`<option value="${i}" ${i===s.chipIndex?'selected':''}>${esc(D.benchmarks[g.bench].name)}</option>`).join('')}</select>`;
    const targetLabel=pair=>[pair.memory,pair.storage,pair.variant.label].filter(Boolean).join(' + ')||'固定配置';
    const target=pairs.length===1?`<span class="static-value${targetModifiedClass}">${esc(targetLabel(pairs[0]))}</span>`:`<select class="select-control product-select target-select full${targetModifiedClass}" data-config="${p.id}" aria-label="目标规格组合${targetModified?'（已调整）':''}">${pairs.map(pair=>`<option value="${esc(pair.key)}" ${pair.memory===s.memory&&pair.storage===s.storage&&pair.variant.key===s.variantKey?'selected':''}>${esc(targetLabel(pair))}</option>`).join('')}</select>`;
    const note=option.note?`<span class="selection-note">${esc(option.note)}</span>`:'';
    if(mode==='card')return `<div class="config-field"><span>芯片</span>${chip}</div><div class="config-field"><span>目标规格</span>${target}</div>${note}`;
    return {chip:`<div class="select-stack">${chip}<span class="core-line">${bench.cpu.cores||'—'} 核 CPU · ${bench.gpu.cores||'—'} ${esc(bench.gpu.unit||'核')} GPU</span></div>`,target:`<div class="config-stack">${target}${note}</div>`};
  }
  const marketSearchText=(name,category,chip,memory,storage,variantLabel='',variantTokens='')=>[
    name,category==='iphone'?'国行':'',String(chip||'').replace(/[·/]/g,' ').replace(/\s+/g,' ').trim(),memory,storage,variantLabel,variantTokens
  ].filter(Boolean).join(' ');
  const searchLink=(site,v)=>{
    const q=marketSearchText(v.p.name,v.p.category,v.bench.name,v.s.memory,v.s.storage,v.variant.label,v.variant.searchTokens);
    return site==='xy'?`https://www.goofish.com/search?q=${encodeURIComponent(q)}`:`https://www.zhuanzhuan.com/search?keyword=${encodeURIComponent(q)}`;
  };
  const specLine=(...values)=>[...new Set(values.filter(value=>value!=null&&value!==''))].join(' · ')||'Apple 未标注';
  function keySpecsHtml(v){
    const specs=v.specs;
    const batteryItems=specs.batteryRuntime
      ?[['battery','电池',specLine(specs.battery)],['runtime','续航',specLine(specs.batteryRuntime)]]
      :[['battery',String(specs.battery||'').includes('小时')?'电池 / 续航':'电池',specLine(specs.battery)]];
    const items=[
      ['screen','屏幕',specLine(specs.display,specs.resolution,specs.refresh)],
      ['weight','重量',specLine(specs.weight)],
      ...batteryItems,
      ['ports','接口',specLine(specs.ports)]
    ];
    return `<dl class="key-specs">${items.map(([key,label,value])=>`<div class="key-spec-${key}"><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>`;
  }
  const viewKey=v=>[v.p.id,v.option.bench,v.s.memory,v.s.storage,v.s.variantKey].join('|');
  const rankBadge=index=>index<3?`<span class="rank-badge" title="按当前优先项排序第 ${index+1}">${esc(sortMeta[state.sort].short)} #${index+1}</span>`:'';
  function compareButton(v){
    const added=state.compare.some(item=>item.key===viewKey(v)),wrongCategory=state.compare.length&&state.compare[0].category!==v.p.category,full=state.compare.length>=4&&!added;
    const disabled=wrongCategory||full,title=wrongCategory?'请先清空其他品类的对比项':full?'最多对比 4 款，请先移除一款':'';
    return `<button class="compare${added?' selected':''}" data-compare="${v.p.id}" aria-pressed="${added}" ${disabled?`disabled title="${title}"`:''}>${added?'已加入 ✓':wrongCategory?'仅同类对比':full?'对比已满':'加入对比'}</button>`;
  }
  function marketPriceHtml(v,mode='table'){
    const suffix=v.variant.label?` · ${v.variant.label}`:'';
    const inner=`<div class="primary-price"><small>闲鱼个人模型估值${suffix}</small><a href="${searchLink('xy',v)}" target="_blank" rel="noreferrer" title="个人挂牌 / 近期成交模型估值；点击搜索当前配置">≈ ¥${fmt(v.market.xy[0])}–${fmt(v.market.xy[1])}</a></div><div class="secondary-price"><small>转转验机${suffix}</small><a href="${searchLink('zz',v)}" target="_blank" rel="noreferrer" title="带验机和售后服务的买家零售模型估值；不是回收价">≈ ¥${fmt(v.market.zz[0])}–${fmt(v.market.zz[1])}</a></div>`;
    return mode==='card'?`<div class="card-prices">${inner}</div>`:`<div class="market-price">${inner}</div>`;
  }
  function tableHtml(list,scaleList=list){
    const baseline=esc(D.baselineLabels[state.category]);
    const maxima=columnMaxima(scaleList);
    const marketScope='普通成色 · 当前所选硬件配置 · 2026-08';
    const head=`<div class="table-shell"><table><thead><tr><th class="sticky-product">机型</th><th>二手购入模型估值<small>${marketScope}</small></th><th>芯片</th><th>配置</th><th>CPU 单核<small>${baseline} = 100%</small></th><th>CPU 多核<small>${baseline} = 100%</small></th><th>GPU<small>${baseline} = 100%</small></th><th>关键规格<small>随当前芯片联动</small></th></tr></thead><tbody>`;
    const body=list.map((v,index)=>{
      const c=configHtml(v);
      return `<tr data-product="${v.p.id}"><td class="sticky-product product-cell"><div class="product-heading">${rankBadge(index)}<div><div class="product">${esc(v.p.name)}</div><span class="subtype">${v.p.year} · ${esc(v.p.type)}</span></div></div><div class="micro-actions"><button class="text-btn" data-spec="${v.p.id}">完整规格</button>${compareButton(v)}<a class="source-link" href="${esc(v.official)}" target="_blank" rel="noreferrer">Apple</a></div></td><td>${marketPriceHtml(v)}</td><td>${c.chip}</td><td>${c.target}</td><td>${metricCell(v.indices.single,'single',maxima.single)}</td><td>${metricCell(v.indices.multi,'multi',maxima.multi)}</td><td>${metricCell(v.indices.gpu,'gpu',maxima.gpu)}</td><td class="key-specs-cell">${keySpecsHtml(v)}</td></tr>`;
    }).join('');
    return head+body+'</tbody></table></div>';
  }
  function cardsHtml(list,scaleList=list){
    const maxima=columnMaxima(scaleList);
    const cardMetric=(label,value,kind)=>`<div class="metric-box"><small>${label}</small><b>${Math.round(value)}%</b><div class="track"><div class="fill ${kind}" style="width:${(maxima[kind]>0?Math.min(100,value/maxima[kind]*100):0).toFixed(2)}%"></div></div></div>`;
    return `<div class="cards">${list.map((v,index)=>`<article class="card" data-product="${v.p.id}"><div class="card-top"><div class="product-heading">${rankBadge(index)}<div><span class="subtype">${v.p.year} · ${esc(v.p.type)}</span><h3>${esc(v.p.name)}</h3></div></div><a class="source-link" href="${esc(v.official)}" target="_blank" rel="noreferrer">Apple</a></div>${marketPriceHtml(v,'card')}<div class="card-config">${configHtml(v,'card')}</div><div class="card-metrics">${cardMetric('单核',v.indices.single,'single')}${cardMetric('多核',v.indices.multi,'multi')}${cardMetric('GPU',v.indices.gpu,'gpu')}</div><div class="card-key-specs">${keySpecsHtml(v)}</div><div class="card-actions">${compareButton(v)}<button class="text-btn" data-spec="${v.p.id}">完整规格</button></div></article>`).join('')}</div>`;
  }
  function emptyHtml(){
    const terms=searchTerms(),budget=Number(state.budget)||0;
    const otherMatches=state.search?['iphone','ipad','mac'].filter(category=>category!==state.category).map(category=>({category,count:D.products.filter(p=>p.category===category).map(p=>firstMatchingView(p,terms)).filter(view=>view&&(!budget||view.market.xy[0]<=budget)).length})).filter(item=>item.count):[];
    const switchButtons=otherMatches.map(item=>`<button type="button" data-switch-category="${item.category}">去 ${categoryName[item.category]} 看 ${item.count} 款</button>`).join('');
    return `<div class="empty"><b>没有完全符合条件的产品</b><p>可以放宽预算，或清除部分筛选后再看。</p><div class="empty-actions">${state.budget?`<button type="button" data-relax-budget>预算增加 ¥1,000</button>`:''}${switchButtons}<button type="button" data-clear-filter="all">清除筛选</button></div></div>`;
  }
  function render(){
    const list=filtered();
    const shown=state.showAll?list:list.slice(0,9);
    const total=D.products.filter(p=>p.category===state.category).length;
    $('#sectionTitle').textContent=`${categoryName[state.category]} 候选`;
    const parts=[activeFilterCount()?`${total} 款中显示 ${list.length} 款`:`共 ${list.length} 款`,sortMeta[state.sort].label];
    if(state.budget)parts.splice(1,0,`当前配置闲鱼起价 ≤ ¥${fmt(+state.budget)}`);
    if(list.length>9)parts.push(state.showAll?'已展开全部':`先展示排序前 ${shown.length} 款`);
    $('#resultCount').textContent=parts.join(' · ');
    const base=esc(D.baselineLabels[state.category]);
    $('#baselineBadges').textContent=`单核看响应 · 多核看重任务 · GPU 看图形 · ${base} = 100% · 各列独立缩放`;
    $('#openPencil').hidden=state.category!=='ipad';
    const resultBody=list.length?(state.view==='table'?tableHtml(shown,list):cardsHtml(shown,list)):emptyHtml();
    const more=list.length>9?`<div class="more-results"><button type="button" data-toggle-all>${state.showAll?'收起，只看前 9 款':`显示其余 ${list.length-9} 款`}</button></div>`:'';
    $('#results').innerHTML=resultBody+more;
    renderDiscoveryControls();
    renderResetControl();
  }
  function selectionChange(id,field,value){
    const oldContainer=$(`[data-product="${id}"]`),oldTop=oldContainer?.getBoundingClientRect().top;
    const p=D.products.find(x=>x.id===id),s=ensureSelection(p);
    if(field==='chip'){
      s.chipIndex=+value;const pair=defaultPair(chipGroups(p)[s.chipIndex]);s.memory=pair.memory;s.storage=pair.storage;s.variantKey=pair.variant.key;
    }else if(field==='config'){
      const pair=legalPairs(chipGroups(p)[s.chipIndex]).find(item=>item.key===value);
      if(!pair)throw new Error(`非法目标配置：${p.name} / ${value}`);
      s.memory=pair.memory;s.storage=pair.storage;s.variantKey=pair.variant.key;
    }
    render();
    const newContainer=$(`[data-product="${id}"]`),notice=$('#changeNotice'),currentView=viewOf(p);let noticeMessage='';
    const missesSearch=!viewMatchesSearch(currentView),overBudget=Boolean(state.budget)&&currentView.market.xy[0]>Number(state.budget);
    if(newContainer){
      if(Number.isFinite(oldTop))window.scrollBy(0,newContainer.getBoundingClientRect().top-oldTop);
      const control=newContainer.querySelector(field==='chip'?'[data-chip]':'[data-config]');
      control?.focus({preventScroll:true});newContainer.classList.add('just-updated');
      setTimeout(()=>newContainer.classList.remove('just-updated'),900);notice.hidden=true;
    }else if(missesSearch&&overBudget){
      notice.innerHTML=`${esc(p.name)} 的当前配置既不匹配搜索，也高于 ¥${fmt(+state.budget)} 起价预算。 <button type="button" data-clear-filter="search">清除搜索</button> <button type="button" data-clear-filter="budget">取消预算</button>`;notice.hidden=false;noticeMessage=notice.textContent.trim();
    }else if(missesSearch){
      notice.innerHTML=`${esc(p.name)} 的当前配置不匹配搜索条件，已从结果中隐藏。 <button type="button" data-clear-filter="search">清除搜索</button>`;notice.hidden=false;noticeMessage=notice.textContent.trim();
    }else if(overBudget){
      notice.innerHTML=`${esc(p.name)} 的当前配置高于 ¥${fmt(+state.budget)} 起价预算，已从结果中隐藏。 <button type="button" data-clear-filter="budget">取消预算</button>`;notice.hidden=false;noticeMessage=notice.textContent.trim();
    }else{
      notice.innerHTML=`${esc(p.name)} 已按${esc(sortMeta[state.sort].label)}移到前 9 款之外。 <button type="button" data-toggle-all>显示全部</button>`;notice.hidden=false;noticeMessage=notice.textContent.trim();
    }
    const moved=sortMeta[state.sort].label;
    const updateMessage=sameSelection(s,defaultSelection(p))?`${p.name} 已恢复默认配置，结果按${moved}重排`:`${p.name} 配置已调整，结果按${moved}重排；可使用复位配置恢复`;
    $('#configStatus').textContent=noticeMessage||updateMessage;
  }
  function resetCategorySelections(){
    const category=state.category,dirty=dirtyProducts(category);
    dirty.forEach(p=>state.selections.delete(p.id));
    $('#changeNotice').hidden=true;
    render();
    $('#configStatus').textContent=`${categoryName[category]} 的 ${dirty.length} 款已调整配置已复位`;
  }
  let modalTrigger=null;
  const backgroundRoots=()=>$$('body > :not(.modal):not(script)');
  const setBackgroundInert=value=>backgroundRoots().forEach(element=>{element.inert=value});
  const modalFocusable=modal=>$$('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',modal).filter(element=>!element.hidden);
  const openModal=id=>{const modal=$('#'+id);if(!modal)return;modalTrigger=document.activeElement;modal.classList.add('open');setBackgroundInert(true);document.body.style.overflow='hidden';modal.querySelector('.close')?.focus()};
  const closeModal=id=>{const modal=$('#'+id);modal?.classList.remove('open');if(!$('.modal.open')){document.body.style.overflow='';setBackgroundInert(false)}modalTrigger?.focus?.();modalTrigger=null};
  const specLabels={
    legalConfigurations:'官方合法配置组合',gpuMemory:'独显显存',memoryBandwidth:'内存带宽',mediaEngine:'媒体引擎',neuralAccelerator:'神经网络加速器',
    display:'屏幕',resolution:'分辨率',refresh:'刷新率',brightness:'亮度',colors:'机身颜色',weight:'重量',battery:'电池',batteryRuntime:'官方续航',power:'随附电源',pencil:'Apple Pencil',
    networkVersion:'网络版本',displayGlass:'显示屏玻璃',keyboard:'键盘',authentication:'生物识别',ports:'接口',external:'外接显示器',camera:'摄像头',wireless:'无线连接'
  };
  const specOrder=['legalConfigurations','gpuMemory','memoryBandwidth','mediaEngine','neuralAccelerator','networkVersion','displayGlass','display','resolution','refresh','brightness','colors','weight','battery','batteryRuntime','power','keyboard','authentication','pencil','ports','external','camera','wireless'];
  const cpuCoreText=bench=>{
    const detail=bench.cpu.coreBreakdown||(bench.cpu.p!=null?`${bench.cpu.p} 个性能核心 + ${bench.cpu.e} 个能效核心`:null);
    return `${bench.cpu.cores} 核${detail?`（${detail}）`:''}`;
  };
  function showSpecs(id){
    const v=viewOf(D.products.find(p=>p.id===id));
    const fields=[['芯片',v.bench.name],['CPU 核心',cpuCoreText(v.bench)],['GPU 规模',v.bench.gpu.cores?`${v.bench.gpu.cores} ${v.bench.gpu.unit||'核'}`:'Apple 未标注'],['当前内存',v.s.memory||'固定'],['当前存储',v.s.storage||'固定'],...(v.variant.label?[['当前版本',v.variant.label]]:[]),['CPU 单核',`${Math.round(v.indices.single)}%（${D.baselineLabels[v.p.category]} = 100%）`],['CPU 多核',`${Math.round(v.indices.multi)}%（${D.baselineLabels[v.p.category]} = 100%）`],['GPU 综合',`${Math.round(v.indices.gpu)}%（${D.baselineLabels[v.p.category]} = 100%）`]];
    specOrder.forEach(key=>{if(v.specs[key]!=null&&v.specs[key]!=='')fields.push([specLabels[key],v.specs[key]])});
    $('#specTitle').textContent=v.p.name;
    $('#specBody').innerHTML=`<div class="spec-grid">${fields.map(([k,val])=>`<div class="spec-item"><span>${esc(k)}</span><b>${esc(val||'Apple 未标注')}</b></div>`).join('')}</div><a class="spec-source" href="${esc(v.official)}" target="_blank" rel="noreferrer">打开当前芯片对应的 Apple 官方技术规格 ↗</a>`;
    openModal('specModal');
  }
  function snapshot(v){return {key:viewKey(v),category:v.p.category,name:v.p.name,year:v.p.year,chip:v.bench.name,memory:v.s.memory||'',storage:v.s.storage||'固定',variantKey:v.s.variantKey,variantLabel:v.variant.label||'',indices:{...v.indices},market:{xy:[...v.market.xy],zz:[...v.market.zz]},specs:{...v.specs},official:v.official}}
  function addCompare(id){
    const snap=snapshot(viewOf(D.products.find(p=>p.id===id)));
    const existing=state.compare.findIndex(x=>x.key===snap.key);
    if(existing>=0)state.compare.splice(existing,1);
    else if(state.compare.length&&state.compare[0].category!==snap.category){
      const message='性能百分比使用品类专属基准，只能在同一品类内对比；请先清空当前对比。',notice=$('#changeNotice');notice.textContent=message;notice.hidden=false;$('#configStatus').textContent=message;return;
    }
    else if(state.compare.length>=4){
      const message='最多同时对比 4 款，请先从底部对比栏移除一款。',notice=$('#changeNotice');notice.textContent=message;notice.hidden=false;$('#configStatus').textContent=message;return;
    }else state.compare.push(snap);
    renderDock();render();
    $(`[data-product="${id}"] [data-compare]`)?.focus({preventScroll:true});
    $('#configStatus').textContent=existing>=0?`${snap.name} 已从对比中移除`:`${snap.name} 已加入对比`;
  }
  function renderDock(){
    const dock=$('#compareDock'),count=state.compare.length,open=$('#openCompare');
    dock.hidden=count===0;dock.setAttribute('aria-hidden',String(count===0));dock.classList.toggle('show',count>0);
    $('#dockItems').innerHTML=state.compare.map((x,i)=>`<span class="dock-item" title="${esc(x.chip)}"><b>${esc(x.name)}</b><small>${esc([x.memory,x.storage,x.variantLabel].filter(Boolean).join(' + '))}</small><button data-remove-compare="${i}" aria-label="移除 ${esc(x.name)}">×</button></span>`).join('');
    open.disabled=count<2;open.textContent=count<2?'再选 1 款':`并排对比 ${count}/4`;
  }
  function showCompare(){
    if(!state.compare.length)return;
    const baseline=D.baselineLabels[state.compare[0].category];
    const rows=[['芯片',x=>x.chip],['目标规格组合',x=>[x.memory,x.storage,x.variantLabel].filter(Boolean).join(' + ')],[`CPU 单核（${baseline}=100%）`,x=>`${Math.round(x.indices.single)}%`],[`CPU 多核（${baseline}=100%）`,x=>`${Math.round(x.indices.multi)}%`],[`GPU 综合（${baseline}=100%）`,x=>`${Math.round(x.indices.gpu)}%`],['闲鱼个人模型估值',x=>`≈ ¥${fmt(x.market.xy[0])}–${fmt(x.market.xy[1])}${x.variantLabel?`（${x.variantLabel}）`:''}`],['转转验机模型估值',x=>`≈ ¥${fmt(x.market.zz[0])}–${fmt(x.market.zz[1])}${x.variantLabel?`（${x.variantLabel}）`:''}`],['独显显存',x=>x.specs.gpuMemory],['内存带宽',x=>x.specs.memoryBandwidth],['媒体引擎',x=>x.specs.mediaEngine],['网络版本',x=>x.specs.networkVersion],['显示屏玻璃',x=>x.specs.displayGlass],['屏幕',x=>`${x.specs.display} · ${x.specs.resolution}`],['刷新率',x=>x.specs.refresh],['重量',x=>x.specs.weight],['电池',x=>x.specs.battery],['官方续航',x=>x.specs.batteryRuntime],['随附电源',x=>x.specs.power],['键盘',x=>x.specs.keyboard],['生物识别',x=>x.specs.authentication],['Apple Pencil',x=>x.specs.pencil],['接口',x=>x.specs.ports],['外接显示器',x=>x.specs.external],['摄像头',x=>x.specs.camera],['无线连接',x=>x.specs.wireless]];
    $('#compareGrid').style.gridTemplateColumns=`130px repeat(${state.compare.length},minmax(190px,1fr))`;
    $('#compareGrid').innerHTML=`<div class="cmp-row" role="row"><div class="cmp-cell label" role="columnheader">配置</div>${state.compare.map(x=>`<div class="cmp-cell cmp-product" role="columnheader"><b>${esc(x.name)}</b><small>${x.year} · 当前选择快照</small></div>`).join('')}</div>${rows.map(([label,get])=>`<div class="cmp-row" role="row"><div class="cmp-cell label" role="rowheader">${esc(label)}</div>${state.compare.map(x=>`<div class="cmp-cell" role="cell">${esc(get(x)||'Apple 未标注')}</div>`).join('')}</div>`).join('')}`;
    openModal('compareModal');
  }

  window.APPLE_APP_AUDIT={
    indices:(category,benchmarkId)=>indices(category,D.benchmarks[benchmarkId]),
    defaultConfig:productId=>defaultConfig(D.products.find(p=>p.id===productId)),
    marketAnchors,
    anchorAudit,
    auditAllMarketConfigs,
    marketSearchText,
    normalizeSearch:normalizedSearch,
    textMatchesSearch:(text,query)=>{const normalized=normalizedSearch(text),terms=normalizedSearch(query).split(/\s+/).filter(Boolean);return terms.every(term=>textHasTerm(normalized,term))},
    legalConfigurationText:(productId,benchmarkId)=>{
      const product=D.products.find(p=>p.id===productId);
      return legalConfigurationText(chipGroups(product).find(group=>group.bench===benchmarkId));
    }
  };
  /* Node 验证环境只运行纯数据、公式和价格审计，不伪造浏览器 DOM。 */
  if(!$('#categoryTabs'))return;

  function switchCategory(category,{keepSearch=false}={}){
    state.category=category;state.year='all';state.type='all';state.showAll=false;
    if(!keepSearch){state.search='';$('#search').value=''}
    $('#year').value='all';$('#changeNotice').hidden=true;
    $$('.tab').forEach(button=>{const active=button.dataset.category===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});
    renderTypes();if(keepSearch)syncSelectionsToSearch(category);render();
  }
  document.addEventListener('click',e=>{
    const cat=e.target.closest('[data-category]');if(cat){switchCategory(cat.dataset.category);return}
    const switchCat=e.target.closest('[data-switch-category]');if(switchCat){switchCategory(switchCat.dataset.switchCategory,{keepSearch:true});return}
    const sort=e.target.closest('[data-sort]');if(sort){state.sort=sort.dataset.sort;state.showAll=false;$('#changeNotice').hidden=true;render();return}
    const clear=e.target.closest('[data-clear-filter]');if(clear){clearFilters(clear.dataset.clearFilter);return}
    const relax=e.target.closest('[data-relax-budget]');if(relax){state.budget=String((Number(state.budget)||0)+1000);state.showAll=false;$('#budget').value=state.budget;render();return}
    const toggleAll=e.target.closest('[data-toggle-all]');if(toggleAll){state.showAll=!state.showAll;$('#changeNotice').hidden=true;render();return}
    const spec=e.target.closest('[data-spec]');if(spec){showSpecs(spec.dataset.spec);return}
    const cmp=e.target.closest('[data-compare]');if(cmp){addCompare(cmp.dataset.compare);return}
    const rem=e.target.closest('[data-remove-compare]');if(rem){const removeIndex=+rem.dataset.removeCompare,removed=state.compare.splice(removeIndex,1)[0],id=removed?.key.split('|')[0];renderDock();render();const removeButtons=$$('#dockItems [data-remove-compare]'),next=removeButtons[Math.min(removeIndex,removeButtons.length-1)]||(id&&$(`[data-product="${id}"] [data-compare]`))||$('#search');next?.focus({preventScroll:true});$('#configStatus').textContent=`${removed?.name||'产品'} 已从对比中移除`;return}
    const close=e.target.closest('[data-close]');if(close){closeModal(close.dataset.close);return}
    if(e.target.classList.contains('modal'))closeModal(e.target.id);
  });
  document.addEventListener('change',e=>{
    if(e.target.matches('[data-chip]'))selectionChange(e.target.dataset.chip,'chip',e.target.value);
    if(e.target.matches('[data-config]'))selectionChange(e.target.dataset.config,'config',e.target.value);
  });
  $('#year').addEventListener('change',e=>{state.year=e.target.value;state.showAll=false;$('#changeNotice').hidden=true;render()});
  $('#typeFilter').addEventListener('change',e=>{state.type=e.target.value;state.showAll=false;$('#changeNotice').hidden=true;render()});
  $('#search').addEventListener('input',e=>{state.search=e.target.value;state.showAll=false;$('#changeNotice').hidden=true;const changed=syncSelectionsToSearch();render();if(changed){const message=`已将 ${changed} 款机型切换到与搜索词最匹配的官方配置，可用复位配置恢复`;$('#configStatus').textContent=message;$('#changeNotice').textContent=message;$('#changeNotice').hidden=false}});
  $('#budget').addEventListener('input',e=>{const value=Number(e.target.value),normalized=Number.isFinite(value)&&value>0?String(Math.round(value)):'';state.budget=normalized;e.target.value=normalized;state.showAll=false;$('#changeNotice').hidden=true;render()});
  $('#clearFilters').addEventListener('click',()=>clearFilters());
  $('#resetConfigs').addEventListener('click',resetCategorySelections);
  $('#openPencil').addEventListener('click',()=>openModal('pencilModal'));
  $('#clearCompare').addEventListener('click',()=>{const count=state.compare.length;state.compare=[];renderDock();render();$('#search').focus({preventScroll:true});$('#configStatus').textContent=`已清空 ${count} 个对比项`});
  $('#openCompare').addEventListener('click',showCompare);
  compactView.addEventListener('change',e=>{state.view=e.matches?'cards':'table';render()});
  document.addEventListener('keydown',e=>{
    const modal=$('.modal.open');
    if(e.key==='Escape'&&modal){closeModal(modal.id);return}
    if(e.key==='Tab'&&modal){
      const focusable=modalFocusable(modal);if(!focusable.length){e.preventDefault();return}
      const first=focusable[0],last=focusable.at(-1);
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
    }
  });
  initControls();
})();
