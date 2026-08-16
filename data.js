/*
 * 数据快照：2026-08-17。
 * 性能百分比不在这里手写；app.js 会从 raw 原始分按固定公式计算。
 * Apple 规格选项以各 product.official 的技术规格页为准。
 */
window.APPLE_DATA=(()=>{
  const NR_SOC='https://nanoreview.net/en/soc/';
  const NR_CPU='https://nanoreview.net/en/cpu/';
  const NR_GPU='https://nanoreview.net/en/gpu/';
  const cpu=(cores,p,e,gbS=null,gbM=null,cbS=null,cbM=null,pmS=null,pmM=null)=>({cores,p,e,gbS,gbM,cbS,cbM,pmS,pmM});
  const gpu=(cores,gb=null,threeD=null,flops=null)=>({cores,gb,threeD,flops});
  const profile=(name,cpuRaw,gpuRaw,source,gpuSource=source,quality='measured',note='')=>({name,cpu:cpuRaw,gpu:gpuRaw,source,gpuSource,quality,note,retrieved:'2026-08-17'});
  const benchmarks={
    a9:profile('A9 · 2 核 CPU / 6 核 GPU',cpu(2,2,0,633,1014),gpu(6,3185,null,.2496),NR_SOC+'apple-a9'),
    a10:profile('A10 Fusion · 4 核 CPU / 6 核 GPU',cpu(4,2,2,882,1484),gpu(6,4352,693,.2496),NR_SOC+'apple-a10-fusion'),
    a11:profile('A11 Bionic · 6 核 CPU / 3 核 GPU',cpu(6,2,4,1093,1828),gpu(3,5630,892,.4093),NR_SOC+'apple-a11-bionic'),
    a12:profile('A12 Bionic · 6 核 CPU / 4 核 GPU',cpu(6,2,4,1338,2903),gpu(4,8773,1482,.576),NR_SOC+'apple-a12-bionic'),
    a13:profile('A13 Bionic · 6 核 CPU / 4 核 GPU',cpu(6,2,4,1748,4187),gpu(4,13772,2001,.6298),NR_SOC+'apple-a13-bionic'),
    a14:profile('A14 Bionic · 6 核 CPU / 4 核 GPU',cpu(6,2,4,2124,4871),gpu(4,16822,2229,.6543),NR_SOC+'apple-a14-bionic'),
    a15_5:profile('A15 Bionic · 6 核 CPU / 5 核 GPU',cpu(6,2,4,2303,5725),gpu(5,20400,2854,1.7126),NR_SOC+'apple-a15-bionic'),
    a16:profile('A16 Bionic · 6 核 CPU / 5 核 GPU',cpu(6,2,4,2630,6744),gpu(5,22851,3335,1.7894),NR_SOC+'apple-a16-bionic'),
    a17pro:profile('A17 Pro · 6 核 CPU / 6 核 GPU',cpu(6,2,4,2972,7397),gpu(6,28057,3655,2.1472),NR_SOC+'apple-a17-pro'),
    a18:profile('A18 · 6 核 CPU / 5 核 GPU',cpu(6,2,4,3291,8136),gpu(5,28010,1579,1.907),NR_SOC+'apple-a18'),
    a18pro:profile('A18 Pro · 6 核 CPU / 6 核 GPU',cpu(6,2,4,3518,8950),gpu(6,33278,1732,2.289),NR_SOC+'apple-a18-pro'),
    a19:profile('A19 · 6 核 CPU / 5 核 GPU',cpu(6,2,4,3692,9454),gpu(5,37553,2147,2.0736),NR_SOC+'apple-a19'),
    a19pro_6:profile('A19 Pro · 6 核 CPU / 6 核 GPU',cpu(6,2,4,3970,10558),gpu(6,45708,2487,2.4883),NR_SOC+'apple-a19-pro'),

    a9x_ipad:profile('A9X · 2 核 CPU / 12 核 GPU',cpu(2,2,0,653,1215),gpu(12,7200,null,.691),'https://browser.geekbench.com/ios-benchmarks',null,'secondary','NanoReview 无独立 A9X 页面；采用 Geekbench Browser 同版本中位区间，GPU 理论值仅用于辅助。'),
    a10x_ipad:profile('A10X Fusion · 6 核 CPU / 12 核 GPU',cpu(6,3,3,1094,2959),gpu(12,12000,null,.75),'https://browser.geekbench.com/ios-benchmarks',null,'secondary','NanoReview 无独立 A10X 页面；使用 Geekbench Browser 聚合，缺少同版本 3DMark。'),
    a12x_ipad:profile('A12X Bionic · 8 核 CPU / 7 核 GPU',cpu(8,4,4,1321,4668),gpu(7,21800,null,1.40),'https://browser.geekbench.com/ios-benchmarks',null,'secondary','NanoReview 无独立 A12X 页面；使用 Geekbench Browser 聚合并保留较低置信度。'),
    a12z_ipad:profile('A12Z Bionic · 8 核 CPU / 8 核 GPU',cpu(8,4,4,1326,4678),gpu(8,22500,null,1.50),'https://browser.geekbench.com/ios-benchmarks',null,'secondary','NanoReview 无独立 A12Z 页面；使用 Geekbench Browser 聚合并保留较低置信度。'),
    m1_ipad:profile('M1 · 8 核 CPU / 8 核 GPU',cpu(8,4,4,2385,8775),gpu(8,33168,1965,2.617),NR_SOC+'apple-m1-ipad'),
    m2_ipad:profile('M2 · 8 核 CPU / 10 核 GPU',cpu(8,4,4,2619,10084),gpu(10,43561,2474,3.60),NR_SOC+'apple-m2-ipad'),
    m3_ipad:profile('M3 · 8 核 CPU / 9 核 GPU',cpu(8,4,4,3113,11795),gpu(9,41555,2426,3.15),NR_SOC+'apple-m3-ipad',null,'derived','NanoReview 的 M3 iPad 样本为 10 核 GPU；9 核版本按官方核心数比例推导 GPU 三项。'),
    m4_ipad_10:profile('M4 · 10 核 CPU / 10 核 GPU',cpu(10,4,6,3683,13402),gpu(10,53792,3477,3.7632),NR_SOC+'apple-m4-ipad'),
    m5_ipad_10:profile('M5 · 10 核 CPU / 10 核 GPU',cpu(10,4,6,4175,15577),gpu(10,75273,4104,4.1472),NR_SOC+'apple-m5-ipad'),

    m1_8_8:profile('M1 · 8 核 CPU / 8 核 GPU',cpu(8,4,4,2410,8547,110,525,3674,14129),gpu(8,20842,1869,2.6),NR_CPU+'apple-m1',NR_GPU+'apple-m1-gpu'),
    m1pro_10_16:profile('M1 Pro · 10 核 CPU / 16 核 GPU',cpu(10,8,2,2328,10305,109,796,3795,21933),gpu(16,42227,3998,5.3),NR_CPU+'apple-m1-pro',NR_GPU+'apple-m1-pro-gpu'),
    m1max_10_32:profile('M1 Max · 10 核 CPU / 32 核 GPU',cpu(10,8,2,2431,12673,111,789,3831,22157),gpu(32,71977,7425,10.6),NR_CPU+'apple-m1-max',NR_GPU+'apple-m1-max-gpu-32-core'),
    m2_8_8:profile('M2 · 8 核 CPU / 8 核 GPU',cpu(8,4,4,2589,10122,125,582,3884,15652),gpu(8,29705,2317,2.9),NR_CPU+'apple-m2','https://nanoreview.net/en/gpu-compare/apple-m2-gpu-8-core-vs-adreno-x2-45'),
    m2pro_12_19:profile('M2 Pro · 12 核 CPU / 19 核 GPU',cpu(12,8,4,2666,14489,125,795,4088,26689),gpu(19,49366,5122,6.8),NR_CPU+'apple-m2-pro',NR_GPU+'apple-m2-pro-gpu-19-core'),
    m2max_12_38:profile('M2 Max · 12 核 CPU / 38 核 GPU',cpu(12,8,4,2695,14891,122,1022,4140,26861),gpu(38,85600,8700,13.6),NR_CPU+'apple-m2-max',NR_GPU+'apple-m2-max-gpu-38-core','secondary','GPU Geekbench/3DMark 采用 NanoReview GPU 页与其引用样本的中位区间。'),
    m3_8_10:profile('M3 · 8 核 CPU / 10 核 GPU',cpu(8,4,4,3009,11815,140,712,4713,19085),gpu(10,30027,3481,3.5),NR_CPU+'apple-m3',NR_GPU+'apple-m3-gpu-10-core'),
    m3pro_12_18:profile('M3 Pro · 12 核 CPU / 18 核 GPU',cpu(12,6,6,3163,15512,143,1059,4239,23980),gpu(18,50600,5300,6.4),NR_CPU+'apple-m3-pro',NR_GPU+'apple-m3-pro-gpu-18-core','secondary','GPU 实测取 NanoReview 聚合值；具体机身样本可能受功耗影响。'),
    m3max_16_40:profile('M3 Max · 16 核 CPU / 40 核 GPU',cpu(16,12,4,3227,21167,142,1698,4784,41257),gpu(40,92000,9100,14.1),NR_CPU+'apple-m3-max',NR_GPU+'apple-m3-max-gpu-40-core','secondary','GPU 实测取 NanoReview 聚合值；具体机身样本可能受功耗影响。'),
    m4_10_10:profile('M4 · 10 核 CPU / 10 核 GPU',cpu(10,4,6,3777,14818,172,982,4508,23655),gpu(10,37678,4001,4.4),NR_CPU+'apple-m4',NR_GPU+'apple-m4-gpu'),
    m4pro_12_16:profile('M4 Pro · 12 核 CPU / 16 核 GPU',cpu(12,8,4,3864,20499,172,1421,4561,32717),gpu(16,60400,6300,7.0),NR_CPU+'apple-m4-pro-12-cores',NR_GPU+'apple-m4-pro-gpu-16-core','secondary','GPU 页面聚合值；不同散热条件下有波动。'),
    m4pro_14_20:profile('M4 Pro · 14 核 CPU / 20 核 GPU',cpu(14,10,4,3899,22639,172,1678,4555,38021),gpu(20,72000,7600,8.9),NR_CPU+'apple-m4-pro-14-cores',NR_GPU+'apple-m4-pro-gpu-20-core','secondary','GPU 页面聚合值；不同散热条件下有波动。'),
    m4max_14_32:profile('M4 Max · 14 核 CPU / 32 核 GPU',cpu(14,10,4,3996,23275,181,1702,4635,38416),gpu(32,101000,10200,12.9),NR_CPU+'apple-m4-max-14-core',NR_GPU+'apple-m4-max-gpu-32-core','secondary','GPU 页面聚合值；不同散热条件下有波动。'),
    m4max_16_40:profile('M4 Max · 16 核 CPU / 40 核 GPU',cpu(16,12,4,3986,26190,181,1920,4592,43966),gpu(40,121000,12100,16.1),NR_CPU+'apple-m4-max-16-core',NR_GPU+'apple-m4-max-gpu-40-core','secondary','Cinebench 多核与 GPU 数据取同族 NanoReview 页面聚合。'),
    m5_10_10:profile('M5 · 10 核 CPU / 10 核 GPU',cpu(10,4,6,4276,17862,208,1183,5756,26822),gpu(10,51000,5100,4.1),NR_CPU+'apple-m5',NR_GPU+'apple-m5-gpu-10-core','secondary','GPU 使用 NanoReview GPU 聚合页；样本量仍低于成熟芯片。'),
    m5pro_15_16:profile('M5 Pro · 15 核 CPU / 16 核 GPU',cpu(15,5,10,4254,25906,198,1850,5918,49261),gpu(16,82000,8300,6.6),NR_CPU+'apple-m5-pro',NR_GPU+'apple-m5-pro-gpu-16-core','secondary','2026 新芯片，NanoReview 样本量较少。'),
    m5pro_18_20:profile('M5 Pro · 18 核 CPU / 20 核 GPU',cpu(18,6,12,4312,28467,199,1949,5920,57047),gpu(20,97000,9800,8.3),NR_CPU+'apple-m5-pro-18-core',NR_GPU+'apple-m5-pro-gpu-20-core','secondary','2026 新芯片，NanoReview 样本量较少。'),
    m5max_18_32:profile('M5 Max · 18 核 CPU / 32 核 GPU',cpu(18,6,12,4283,29068,200,2066,5932,57447),gpu(32,132000,13200,13.3),NR_CPU+'apple-m5-max-32-sore-gpu',NR_GPU+'apple-m5-max-gpu-32-core','secondary','2026 新芯片，NanoReview 样本量较少。'),
    m5max_18_40:profile('M5 Max · 18 核 CPU / 40 核 GPU',cpu(18,6,12,4355,30217,200,2073,5950,57447),gpu(40,158000,15700,16.6),NR_CPU+'apple-m5-max-18-core',NR_GPU+'apple-m5-max-gpu-40-core','secondary','2026 新芯片，CPU/GPU 样本量仍少，标为中等置信。')
  };

  const derive=(id,baseId,name,{cpuMulti=1,gpuScale=1,cpuCores,gpuCores,p,e}={})=>{
    const b=benchmarks[baseId],c={...b.cpu},g={...b.gpu};
    if(cpuMulti!==1){c.gbM=Math.round(c.gbM*cpuMulti);c.cbM=c.cbM&&Math.round(c.cbM*cpuMulti);c.pmM=c.pmM&&Math.round(c.pmM*cpuMulti)}
    if(cpuCores)c.cores=cpuCores;if(p!==undefined)c.p=p;if(e!==undefined)c.e=e;
    /* 同架构 GPU 并非随核心数完全线性：用跨档实测拟合的 0.93 指数，
       比简单“核心数相除”更接近 Geekbench Compute / 3DMark 的实际缩放。 */
    if(gpuScale!==1){const f=Math.pow(gpuScale,.93);g.gb=g.gb&&Math.round(g.gb*f);g.threeD=g.threeD&&Math.round(g.threeD*f);g.flops=g.flops&&+(g.flops*gpuScale).toFixed(4)}
    if(gpuCores)g.cores=gpuCores;
    benchmarks[id]=profile(name,c,g,b.source,b.gpuSource,'derived',`NanoReview 没有该降配的独立聚合页；CPU 多核或 GPU 原始项按同架构满血版与官方核心数量比例推导（CPU 单核保持同代实测）。`);
  };
  derive('a15_4','a15_5','A15 Bionic · 6 核 CPU / 4 核 GPU',{gpuScale:.8,gpuCores:4});
  derive('a19pro_5','a19pro_6','A19 Pro · 6 核 CPU / 5 核 GPU',{gpuScale:5/6,gpuCores:5});
  derive('a18pro_5','a18pro','A18 Pro · 6 核 CPU / 5 核 GPU',{gpuScale:5/6,gpuCores:5});
  derive('m4_ipad_9','m4_ipad_10','M4 · 9 核 CPU / 10 核 GPU',{cpuMulti:.9,cpuCores:9,p:3,e:6});
  derive('m5_ipad_9','m5_ipad_10','M5 · 9 核 CPU / 10 核 GPU',{cpuMulti:.9,cpuCores:9,p:3,e:6});
  derive('m1_8_7','m1_8_8','M1 · 8 核 CPU / 7 核 GPU',{gpuScale:7/8,gpuCores:7});
  derive('m1pro_8_14','m1pro_10_16','M1 Pro · 8 核 CPU / 14 核 GPU',{cpuMulti:.79,gpuScale:14/16,cpuCores:8,gpuCores:14,p:6,e:2});
  derive('m1pro_10_14','m1pro_10_16','M1 Pro · 10 核 CPU / 14 核 GPU',{gpuScale:14/16,gpuCores:14});
  derive('m1max_10_24','m1max_10_32','M1 Max · 10 核 CPU / 24 核 GPU',{gpuScale:.75,gpuCores:24});
  derive('m2_8_10','m2_8_8','M2 · 8 核 CPU / 10 核 GPU',{gpuScale:1.25,gpuCores:10});
  derive('m2pro_10_16','m2pro_12_19','M2 Pro · 10 核 CPU / 16 核 GPU',{cpuMulti:.84,gpuScale:16/19,cpuCores:10,gpuCores:16,p:6,e:4});
  derive('m2max_12_30','m2max_12_38','M2 Max · 12 核 CPU / 30 核 GPU',{gpuScale:30/38,gpuCores:30});
  derive('m3_8_8','m3_8_10','M3 · 8 核 CPU / 8 核 GPU',{gpuScale:.8,gpuCores:8});
  derive('m3pro_11_14','m3pro_12_18','M3 Pro · 11 核 CPU / 14 核 GPU',{cpuMulti:.91,gpuScale:14/18,cpuCores:11,gpuCores:14,p:5,e:6});
  derive('m3max_14_30','m3max_16_40','M3 Max · 14 核 CPU / 30 核 GPU',{cpuMulti:.86,gpuScale:.75,cpuCores:14,gpuCores:30,p:10,e:4});
  derive('m5_10_8','m5_10_10','M5 · 10 核 CPU / 8 核 GPU',{gpuScale:.8,gpuCores:8});
  derive('a16_ipad','a16','A16 · 5 核 CPU / 4 核 GPU',{cpuMulti:.84,gpuScale:.8,cpuCores:5,gpuCores:4,p:2,e:3});
  derive('a17pro_5','a17pro','A17 Pro · 6 核 CPU / 5 核 GPU',{gpuScale:5/6,gpuCores:5});
  derive('m2_ipad_9','m2_ipad','M2 · 8 核 CPU / 9 核 GPU',{gpuScale:.9,gpuCores:9});
  derive('a18_4','a18','A18 · 6 核 CPU / 4 核 GPU',{gpuScale:.8,gpuCores:4});
  derive('a19_4','a19','A19 · 6 核 CPU / 4 核 GPU',{gpuScale:.8,gpuCores:4});
  derive('m4_ipad_8_9','m4_ipad_10','M4 · 8 核 CPU / 9 核 GPU',{cpuMulti:.82,gpuScale:.9,cpuCores:8,gpuCores:9,p:2,e:6});

  /* 2021 14 英寸 8/14 档使用 Geekbench Browser 的具体机型聚合替换纯核心推导。 */
  Object.assign(benchmarks.m1pro_8_14.cpu,{gbS:2184,gbM:11159});
  Object.assign(benchmarks.m1pro_8_14.gpu,{gb:35235});
  benchmarks.m1pro_8_14.note='Geekbench 6 CPU 与 Metal 采用 MacBook Pro (14-inch, 2021) 具体档位聚合；其余输入由同架构相邻档校准。';

  const missing=(id,name,cores,gpuCores)=>benchmarks[id]=profile(name,cpu(cores,null,null),gpu(gpuCores),null,null,'missing','Apple 官方可确认配置，但暂未找到可与统一口径直接比较的 NanoReview 原始分；因此不显示百分比。');
  [
    ['intel_2016_mb_m3','Core m3 1.1GHz · Intel HD 515',2,null],['intel_2016_mb_m5','Core m5 1.2GHz · Intel HD 515',2,null],['intel_2016_mb_m7','Core m7 1.3GHz · Intel HD 515',2,null],
    ['intel_2017_mb_m3','Core m3 1.2GHz · Intel HD 615',2,null],['intel_2017_mb_i5','Core i5 1.3GHz · Intel HD 615',2,null],['intel_2017_mb_i7','Core i7 1.4GHz · Intel HD 615',2,null],
    ['intel_air_old_i5','Core i5 1.8GHz · Intel HD 6000',2,null],['intel_air_old_i7','Core i7 2.2GHz · Intel HD 6000',2,null],['intel_air_2018','Core i5 1.6GHz · Intel UHD 617',2,null],
    ['intel_air_2020_i3','Core i3 1.1GHz · Iris Plus',2,null],['intel_air_2020_i5','Core i5 1.1GHz · Iris Plus',4,null],['intel_air_2020_i7','Core i7 1.2GHz · Iris Plus',4,null],
    ['intel_mbp13_2016_2_i5','Core i5 2.0GHz · Iris 540',2,null],['intel_mbp13_2016_2_i7','Core i7 2.4GHz · Iris 540',2,null],['intel_mbp13_2016_4_i5','Core i5 2.9GHz · Iris 550',2,null],['intel_mbp13_2016_4_i7','Core i7 3.3GHz · Iris 550',2,null],
    ['intel_mbp13_2017_2_i5','Core i5 2.3GHz · Iris Plus 640',2,null],['intel_mbp13_2017_2_i7','Core i7 2.5GHz · Iris Plus 640',2,null],['intel_mbp13_2017_4_i5','Core i5 3.1GHz · Iris Plus 650',2,null],['intel_mbp13_2017_4_i7','Core i7 3.5GHz · Iris Plus 650',2,null],
    ['intel_mbp13_2018_i5','Core i5 2.3GHz · Iris Plus 655',4,null],['intel_mbp13_2018_i7','Core i7 2.7GHz · Iris Plus 655',4,null],['intel_mbp13_2019_2_i5','Core i5 1.4GHz · Iris Plus 645',4,null],['intel_mbp13_2019_2_i7','Core i7 1.7GHz · Iris Plus 645',4,null],['intel_mbp13_2019_4_i5','Core i5 2.4GHz · Iris Plus 655',4,null],['intel_mbp13_2019_4_i7','Core i7 2.8GHz · Iris Plus 655',4,null],['intel_mbp13_2020_i5','Core i5 2.0GHz · Iris Plus',4,null],['intel_mbp13_2020_i7','Core i7 2.3GHz · Iris Plus',4,null],
    ['intel_mbp15_2016_450','Core i7 2.6GHz · Radeon Pro 450',4,null],['intel_mbp15_2016_455','Core i7 2.7GHz · Radeon Pro 455',4,null],['intel_mbp15_2016_460','Core i7 2.9GHz · Radeon Pro 460',4,null],['intel_mbp15_2017_555','Core i7 2.8GHz · Radeon Pro 555',4,null],['intel_mbp15_2017_560','Core i7 2.9/3.1GHz · Radeon Pro 560',4,null],
    ['intel_mbp15_2018_555x','Core i7 2.2GHz · Radeon Pro 555X',6,null],['intel_mbp15_2018_560x','Core i7 2.6GHz · Radeon Pro 560X',6,null],['intel_mbp15_2018_vega','Core i9 2.9GHz · Radeon Pro Vega 20',6,null],['intel_mbp15_2019_555x','Core i7 2.6GHz · Radeon Pro 555X',6,null],['intel_mbp15_2019_560x','Core i9 2.3GHz · Radeon Pro 560X',8,null],['intel_mbp15_2019_vega','Core i9 2.4GHz · Radeon Pro Vega 20',8,null],
    ['intel_mbp16_5300','Core i7 2.6GHz · Radeon Pro 5300M',6,null],['intel_mbp16_5500','Core i9 2.3GHz · Radeon Pro 5500M',8,null],['intel_mbp16_5600','Core i9 2.4GHz · Radeon Pro 5600M',8,null]
  ].forEach(x=>missing(...x));

  /* 2016–2020 Intel 档：GB6 以对应 Mac 聚合优先，PassMark 用于跨代校准；
     GPU 为 GB6 OpenCL + FP32。数组：GB6 单/多、PM 单/总、GPU GB6、TFLOPS、EU/CU、可选 CB24 单/多。 */
  const intelScores={
    intel_2016_mb_m3:[688,1327,1165,2169,3180,.384,24],intel_2016_mb_m5:[804,1573,1292,2279,3180,.384,24],intel_2016_mb_m7:[823,1600,1345,2352,3180,.384,24],
    intel_2017_mb_m3:[854,1627,1615,2687,3924,.403,24],intel_2017_mb_i5:[923,1727,1470,2589,3924,.403,24],intel_2017_mb_i7:[959,1706,1511,2534,3924,.403,24],
    intel_air_old_i5:[843,1633,1641,2588,3600,.730,48],intel_air_old_i7:[960,1893,1876,2991,3600,.730,48],intel_air_2018:[924,1700,1642,2738,3293,.403,24],
    intel_air_2020_i3:[1067,1905,1736,3513,4300,.768,48],intel_air_2020_i5:[1002,2132,1729,5593,5900,1.075,64],intel_air_2020_i7:[1087,2503,1870,6471,5900,1.075,64],
    intel_mbp13_2016_2_i5:[949,1918,1737,3128,6221,.806,48],intel_mbp13_2016_2_i7:[1026,2112,1944,3609,6221,.806,48],
    intel_mbp13_2016_4_i5:[992,2025,1831,3370,6922,.845,48],intel_mbp13_2016_4_i7:[1072,2202,2058,3670,6922,.845,48],
    intel_mbp13_2017_2_i5:[1104,2297,2079,3818,6386,.845,48],intel_mbp13_2017_2_i7:[1186,2121,2118,4021,6386,.845,48],
    intel_mbp13_2017_4_i5:[1048,2200,1966,3608,7070,.845,48],intel_mbp13_2017_4_i7:[1068,2282,2197,4121,7070,.845,48],
    intel_mbp13_2018_i5:[1117,3679,2173,7797,7350,.922,48],intel_mbp13_2018_i7:[1138,3633,2468,8227,7350,.922,48],
    intel_mbp13_2019_2_i5:[1148,3655,2235,7390,6966,.806,48],intel_mbp13_2019_2_i7:[1318,4002,2313,7281,6966,.806,48],
    intel_mbp13_2019_4_i5:[1182,3870,2279,7405,7350,.922,48],intel_mbp13_2019_4_i7:[1245,3835,2565,8150,7350,.922,48],
    intel_mbp13_2020_i5:[1186,4186,2144,8745,7311,1.126,64],intel_mbp13_2020_i7:[1271,4200,2314,9189,7311,1.126,64,73,250],
    intel_mbp15_2016_450:[963,3404,1916,6525,10266,1.024,10],intel_mbp15_2016_455:[1127,3890,1929,6738,11888,1.313,12],intel_mbp15_2016_460:[1160,4050,2047,7199,16800,1.858,16],
    intel_mbp15_2017_555:[1049,3504,2044,6883,12895,1.313,12],intel_mbp15_2017_560:[1179,3930,2113,7156,16232,1.858,16],
    intel_mbp15_2018_555x:[1224,4755,2266,9752,12430,1.300,12,64,443],intel_mbp15_2018_560x:[1295,5071,2346,10021,16553,1.860,16,57,275],intel_mbp15_2018_vega:[1323,4979,2413,10337,24500,3.300,20,70,381],
    intel_mbp15_2019_555x:[1264,5149,2389,10579,12430,1.300,12,66,338],intel_mbp15_2019_560x:[1287,5486,2449,13465,16553,1.860,16,67,480],intel_mbp15_2019_vega:[1383,6307,2505,13930,24500,3.300,20,70,459],
    intel_mbp16_5300:[1283,5394,2389,10579,23053,3.200,20,66,338],intel_mbp16_5500:[1320,6482,2449,13465,27373,4.000,24,67,480],intel_mbp16_5600:[1346,6673,2505,13930,38900,5.300,40,70,459]
  };
  Object.entries(intelScores).forEach(([id,v])=>{
    const b=benchmarks[id];
    Object.assign(b.cpu,{gbS:v[0],gbM:v[1],pmS:v[2],pmM:v[3],cbS:v[7]||null,cbM:v[8]||null});
    Object.assign(b.gpu,{gb:v[4],flops:v[5],cores:v[6]});
    b.source='https://browser.geekbench.com/mac-benchmarks';b.gpuSource='https://browser.geekbench.com/opencl-benchmarks';
    b.quality='calibrated';b.note='Geekbench 6 采用 Mac / CPU 聚合，PassMark 作跨代校准；GPU 综合 Geekbench 6 OpenCL 与 FP32，完整规则见技术报告。';
  });

  const addIntel=(id,name,cores,gbS,gbM,pmS,pmM,gpuName,gpuCores,gpuGB,flops,cbS=null,cbM=null)=>{
    benchmarks[id]=profile(`${name} · ${gpuName}`,cpu(cores,null,null,gbS,gbM,cbS,cbM,pmS,pmM),gpu(gpuCores,gpuGB,null,flops),'https://browser.geekbench.com/mac-benchmarks','https://browser.geekbench.com/opencl-benchmarks','calibrated','官方可选档；GB6/PassMark/OpenCL 多源校准，方法见技术报告。');
  };
  addIntel('intel_mbp13_2016_4_i5hi','Core i5 3.1GHz',2,1049,2150,1974,3819,'Iris 550',48,6922,.845);
  addIntel('intel_mbp13_2017_4_i5hi','Core i5 3.3GHz',2,1174,2356,2157,3743,'Iris Plus 650',48,7070,.845);
  addIntel('intel_mbp15_2017_i7hi','Core i7 3.1GHz',4,1133,3814,2173,7242,'Radeon Pro 560',16,16232,1.858);
  addIntel('intel_mbp15_2018_vega16','Core i9 2.9GHz',6,1323,4979,2413,10337,'Radeon Pro Vega 16',16,20400,2.6,70,381);
  addIntel('intel_mbp15_2019_vega16','Core i9 2.4GHz',8,1383,6307,2505,13930,'Radeon Pro Vega 16',16,20400,2.6,70,459);

  /* bundleDelta 是芯片档整包相对阶梯，视图层会按机龄折旧；它不是实时二手差价。 */
  const cfg=(bench,memory=[],storage=[],bundleDelta=0,note='')=>({bench,memory,storage,bundleDelta,note});
  const intelMatrix=(prefix,cpuChoices,gpuChoices,memory,storage)=>{
    const out=[];
    cpuChoices.forEach((c,ci)=>gpuChoices.forEach((g,gi)=>{
      const id=`${prefix}_c${ci}_g${gi}`,cpuSource=benchmarks[c.source],gpuSource=benchmarks[g.source];
      benchmarks[id]=profile(`${c.label} · ${g.label}`,{...cpuSource.cpu},{...gpuSource.gpu},cpuSource.source,gpuSource.gpuSource,'calibrated','CPU 与独显为该机型官方独立选项；两项分别采用对应聚合跑分后再组成当前配置。');
      out.push(cfg(id,memory,storage,(c.delta||0)+(g.delta||0)));
    }));
    return out;
  };
  const P16=['16GB','32GB'],PMAX=['32GB','64GB'],SSD8=['512GB','1TB','2TB','4TB','8TB'];
  /* 旧四元数组的后两项曾是“闲鱼 × 0.85”的机械值，已明确废弃；只保留前两项作相对价格阶梯种子。 */
  const product=(id,date,category,type,name,official,chipOptions,market,specs)=>({id,date,year:+date.slice(0,4),category,type,name,official,chipOptions,marketSeed:market.slice(0,2),specs});
  const phone=(id,date,type,name,chip,storage,market,display,resolution,weight,battery,official,refresh='Apple 未标注 Hz',ports='Lightning × 1')=>product(id,date,'iphone',type,name,official,[cfg(chip,[],storage)],market,{display,resolution,refresh,weight,battery,ports,brightness:'见 Apple 官方规格',camera:'见 Apple 官方规格',wireless:'见 Apple 官方规格'});
  const ipad=(id,date,type,name,chipOptions,market,display,resolution,weight,battery,official,refresh='60Hz',ports='Lightning × 1')=>product(id,date,'ipad',type,name,official,chipOptions,market,{display,resolution,refresh,weight,battery,ports,brightness:'见 Apple 官方规格',camera:'见 Apple 官方规格',wireless:'Wi‑Fi；蜂窝版另计'});
  const mac=(id,date,type,name,official,chipOptions,market,specs)=>product(id,date,'mac',type,name,official,chipOptions,market,specs);
  const IPHONE_INDEX='https://support.apple.com/zh-cn/108044';
  const IPAD_INDEX='https://support.apple.com/zh-cn/108043';
  const MACBOOK_INDEX='https://support.apple.com/zh-cn/103257';
  const MBA_INDEX='https://support.apple.com/zh-cn/102869';
  const MBP_INDEX='https://support.apple.com/zh-cn/108052';

  const products=[];

  /* iPhone：同一代共用 SoC 原始样本，但保留官方容量、尺寸与重量差异。 */
  const phoneRows=[
    ['se1','2016-03-31','SE','iPhone SE（第 1 代）','a9',['16GB','32GB','64GB','128GB'],[280,520,220,450],'4.0 英寸','1136 × 640','113g','6.21Wh',IPHONE_INDEX],
    ['7','2016-09-16','数字','iPhone 7','a10',['32GB','128GB','256GB'],[350,650,300,560],'4.7 英寸','1334 × 750','138g','7.45Wh',IPHONE_INDEX],
    ['7plus','2016-09-16','Plus','iPhone 7 Plus','a10',['32GB','128GB','256GB'],[520,850,430,720],'5.5 英寸','1920 × 1080','188g','11.10Wh',IPHONE_INDEX],
    ['8','2017-09-22','数字','iPhone 8','a11',['64GB','128GB','256GB'],[480,820,400,700],'4.7 英寸','1334 × 750','148g','6.96Wh',IPHONE_INDEX],
    ['8plus','2017-09-22','Plus','iPhone 8 Plus','a11',['64GB','128GB','256GB'],[650,1080,560,930],'5.5 英寸','1920 × 1080','202g','10.28Wh',IPHONE_INDEX],
    ['x','2017-11-03','Pro','iPhone X','a11',['64GB','256GB'],[650,1100,550,950],'5.8 英寸 OLED','2436 × 1125','174g','10.35Wh',IPHONE_INDEX],
    ['xr','2018-10-26','数字','iPhone XR','a12',['64GB','128GB','256GB'],[680,1180,580,1020],'6.1 英寸','1792 × 828','194g','11.16Wh',IPHONE_INDEX],
    ['xs','2018-09-21','Pro','iPhone XS','a12',['64GB','256GB','512GB'],[850,1450,720,1230],'5.8 英寸 OLED','2436 × 1125','177g','10.13Wh',IPHONE_INDEX],
    ['xsmax','2018-09-21','Pro Max','iPhone XS Max','a12',['64GB','256GB','512GB'],[1100,1750,900,1500],'6.5 英寸 OLED','2688 × 1242','208g','12.08Wh',IPHONE_INDEX],
    ['11','2019-09-20','数字','iPhone 11','a13',['64GB','128GB','256GB'],[1050,1700,900,1480],'6.1 英寸','1792 × 828','194g','11.91Wh',IPHONE_INDEX],
    ['11pro','2019-09-20','Pro','iPhone 11 Pro','a13',['64GB','256GB','512GB'],[1250,2050,1080,1780],'5.8 英寸 OLED','2436 × 1125','188g','11.67Wh',IPHONE_INDEX],
    ['11pm','2019-09-20','Pro Max','iPhone 11 Pro Max','a13',['64GB','256GB','512GB'],[1550,2450,1330,2120],'6.5 英寸 OLED','2688 × 1242','226g','15.04Wh',IPHONE_INDEX],
    ['se2','2020-04-24','SE','iPhone SE（第 2 代）','a13',['64GB','128GB','256GB'],[650,1100,560,950],'4.7 英寸','1334 × 750','148g','6.96Wh',IPHONE_INDEX],
    ['12mini','2020-11-13','mini','iPhone 12 mini','a14',['64GB','128GB','256GB'],[1250,2000,1080,1720],'5.4 英寸 OLED','2340 × 1080','133g','8.57Wh','https://support.apple.com/zh-cn/111877'],
    ['12','2020-10-23','数字','iPhone 12','a14',['64GB','128GB','256GB'],[1500,2350,1280,2020],'6.1 英寸 OLED','2532 × 1170','162g','10.78Wh','https://support.apple.com/zh-cn/111876'],
    ['12pro','2020-10-23','Pro','iPhone 12 Pro','a14',['128GB','256GB','512GB'],[1850,2850,1580,2420],'6.1 英寸 OLED','2532 × 1170','187g','10.78Wh','https://support.apple.com/zh-cn/111875'],
    ['12pm','2020-11-13','Pro Max','iPhone 12 Pro Max','a14',['128GB','256GB','512GB'],[2150,3300,1850,2820],'6.7 英寸 OLED','2778 × 1284','226g','14.13Wh','https://support.apple.com/zh-cn/111874'],
    ['13mini','2021-09-24','mini','iPhone 13 mini','a15_4',['128GB','256GB','512GB'],[1750,2800,1500,2380],'5.4 英寸 OLED','2340 × 1080','140g','9.34Wh','https://support.apple.com/zh-cn/111873'],
    ['13','2021-09-24','数字','iPhone 13','a15_4',['128GB','256GB','512GB'],[2100,3200,1780,2730],'6.1 英寸 OLED','2532 × 1170','173g','12.41Wh','https://support.apple.com/zh-cn/111872'],
    ['13pro','2021-09-24','Pro','iPhone 13 Pro','a15_5',['128GB','256GB','512GB','1TB'],[2750,4100,2350,3500],'6.1 英寸 OLED','2532 × 1170','203g','11.97Wh','https://support.apple.com/zh-cn/111871','120Hz'],
    ['13pm','2021-09-24','Pro Max','iPhone 13 Pro Max','a15_5',['128GB','256GB','512GB','1TB'],[3200,4750,2730,4050],'6.7 英寸 OLED','2778 × 1284','238g','16.75Wh','https://support.apple.com/zh-cn/111870','120Hz'],
    ['se3','2022-03-18','SE','iPhone SE（第 3 代）','a15_4',['64GB','128GB','256GB'],[1050,1700,900,1450],'4.7 英寸','1334 × 750','144g','7.82Wh',IPHONE_INDEX],
    ['14','2022-09-16','数字','iPhone 14','a15_5',['128GB','256GB','512GB'],[2600,3800,2200,3250],'6.1 英寸 OLED','2532 × 1170','172g','12.68Wh','https://support.apple.com/zh-cn/111850'],
    ['14plus','2022-10-07','Plus','iPhone 14 Plus','a15_5',['128GB','256GB','512GB'],[2950,4200,2500,3580],'6.7 英寸 OLED','2778 × 1284','203g','16.68Wh','https://support.apple.com/zh-cn/111854'],
    ['14pro','2022-09-16','Pro','iPhone 14 Pro','a16',['128GB','256GB','512GB','1TB'],[3600,5050,3050,4300],'6.1 英寸 OLED','2556 × 1179','206g','12.38Wh','https://support.apple.com/zh-cn/111849','120Hz'],
    ['14pm','2022-09-16','Pro Max','iPhone 14 Pro Max','a16',['128GB','256GB','512GB','1TB'],[4150,5800,3500,4930],'6.7 英寸 OLED','2796 × 1290','240g','16.68Wh','https://support.apple.com/zh-cn/111846','120Hz'],
    ['15','2023-09-22','数字','iPhone 15','a16',['128GB','256GB','512GB'],[3500,4700,2980,4000],'6.1 英寸 OLED','2556 × 1179','171g','12.98Wh','https://support.apple.com/zh-cn/111831','60Hz','USB‑C × 1'],
    ['15plus','2023-09-22','Plus','iPhone 15 Plus','a16',['128GB','256GB','512GB'],[4000,5350,3400,4550],'6.7 英寸 OLED','2796 × 1290','201g','16.95Wh','https://support.apple.com/zh-cn/111830','60Hz','USB‑C × 1'],
    ['15pro','2023-09-22','Pro','iPhone 15 Pro','a17pro',['128GB','256GB','512GB','1TB'],[4550,6100,3850,5200],'6.1 英寸 OLED','2556 × 1179','187g','12.70Wh','https://support.apple.com/zh-cn/111829','120Hz','USB‑C × 1'],
    ['15pm','2023-09-22','Pro Max','iPhone 15 Pro Max','a17pro',['256GB','512GB','1TB'],[5300,7000,4500,5950],'6.7 英寸 OLED','2796 × 1290','221g','17.11Wh','https://support.apple.com/zh-cn/111828','120Hz','USB‑C × 1'],
    ['16','2024-09-20','数字','iPhone 16','a18',['128GB','256GB','512GB'],[4400,5700,3750,4850],'6.1 英寸 OLED','2556 × 1179','170g','13.83Wh','https://support.apple.com/zh-cn/121029','60Hz','USB‑C × 1'],
    ['16plus','2024-09-20','Plus','iPhone 16 Plus','a18',['128GB','256GB','512GB'],[4900,6300,4150,5350],'6.7 英寸 OLED','2796 × 1290','199g','18.08Wh','https://support.apple.com/zh-cn/121030','60Hz','USB‑C × 1'],
    ['16pro','2024-09-20','Pro','iPhone 16 Pro','a18pro',['128GB','256GB','512GB','1TB'],[5650,7350,4800,6250],'6.3 英寸 OLED','2622 × 1206','199g','13.94Wh','https://support.apple.com/zh-cn/121031','120Hz','USB‑C × 1'],
    ['16pm','2024-09-20','Pro Max','iPhone 16 Pro Max','a18pro',['256GB','512GB','1TB'],[6500,8350,5500,7100],'6.9 英寸 OLED','2868 × 1320','227g','18.47Wh','https://support.apple.com/zh-cn/121032','120Hz','USB‑C × 1'],
    ['16e','2025-02-28','e','iPhone 16e','a18_4',['128GB','256GB','512GB'],[3600,4850,3050,4120],'6.1 英寸 OLED','2532 × 1170','167g','视频 26 小时 / 流媒体 21 小时','https://support.apple.com/zh-cn/122208','Apple 未标注 Hz','USB‑C × 1'],
    ['17','2025-09-19','数字','iPhone 17','a19',['256GB','512GB'],[5300,6600,4500,5600],'6.3 英寸 OLED','2622 × 1206','177g','约 14Wh','https://support.apple.com/zh-cn/125089','120Hz','USB‑C × 1'],
    ['air','2025-09-19','Air','iPhone Air','a19pro_5',['256GB','512GB','1TB'],[6000,7600,5100,6450],'6.5 英寸 OLED','2736 × 1260','165g','约 12Wh','https://support.apple.com/zh-cn/125092','120Hz','USB‑C × 1'],
    ['17pro','2025-09-19','Pro','iPhone 17 Pro','a19pro_6',['256GB','512GB','1TB'],[7200,9000,6100,7650],'6.3 英寸 OLED','2622 × 1206','约 204g','约 15Wh','https://support.apple.com/zh-cn/125090','120Hz','USB‑C × 1'],
    ['17pm','2025-09-19','Pro Max','iPhone 17 Pro Max','a19pro_6',['256GB','512GB','1TB','2TB'],[8200,10300,7000,8750],'6.9 英寸 OLED','2868 × 1320','231g','视频 37 小时 / 流媒体 33 小时','https://support.apple.com/zh-cn/125091','ProMotion 最高 120Hz','USB‑C × 1'],
    ['17e','2026-03-11','e','iPhone 17e','a19_4',['256GB','512GB'],[4300,5450,3650,4630],'6.1 英寸 OLED','2532 × 1170','170g','视频 26 小时 / 流媒体 21 小时','https://support.apple.com/zh-cn/126470','Apple 未标注 Hz','USB‑C（USB 2）× 1']
  ];
  phoneRows.forEach(r=>products.push(phone(...r)));

  /* iPad：高容量 Pro 的 CPU 核心档与内存是绑定关系，不能跨档自由组合。 */
  const IPAD_10H='无线网络浏览或观看视频最长 10 小时';
  products.push(
    ipad('ipadpro97','2016-03-31','Pro','iPad Pro 9.7 英寸',[cfg('a9x_ipad',[],['32GB','128GB','256GB'])],[650,1100,550,940],'9.7 英寸','2048 × 1536','437g',IPAD_10H,IPAD_INDEX,'Apple 未标注 Hz','Lightning × 1；3.5mm'),
    ipad('ipad5','2017-03-24','数字','iPad（第 5 代）',[cfg('a9',[],['32GB','128GB'])],[450,760,380,650],'9.7 英寸','2048 × 1536','469g',IPAD_10H,IPAD_INDEX,'Apple 未标注 Hz','Lightning × 1；3.5mm'),
    ipad('ipadpro105','2017-06-13','Pro','iPad Pro 10.5 英寸',[cfg('a10x_ipad',[],['64GB','256GB','512GB'])],[850,1450,720,1230],'10.5 英寸','2224 × 1668','469g',IPAD_10H,IPAD_INDEX,'ProMotion 最高 120Hz','Lightning × 1；3.5mm'),
    ipad('ipadpro129_2','2017-06-13','Pro','iPad Pro 12.9 英寸（第 2 代）',[cfg('a10x_ipad',[],['64GB','256GB','512GB'])],[1050,1750,890,1490],'12.9 英寸','2732 × 2048','677g',IPAD_10H,IPAD_INDEX,'ProMotion 最高 120Hz','Lightning × 1；3.5mm'),
    ipad('ipad6','2018-03-27','数字','iPad（第 6 代）',[cfg('a10',[],['32GB','128GB'])],[650,1050,550,890],'9.7 英寸','2048 × 1536','469g',IPAD_10H,IPAD_INDEX,'Apple 未标注 Hz','Lightning × 1；3.5mm'),
    ipad('ipadpro11_1','2018-11-07','Pro','iPad Pro 11 英寸（第 1 代）',[cfg('a12x_ipad',[],['64GB','256GB','512GB','1TB'])],[1550,2500,1320,2130],'11 英寸','2388 × 1668','468g',IPAD_10H,IPAD_INDEX,'ProMotion 最高 120Hz','USB‑C × 1'),
    ipad('ipadpro129_3','2018-11-07','Pro','iPad Pro 12.9 英寸（第 3 代）',[cfg('a12x_ipad',[],['64GB','256GB','512GB','1TB'])],[1950,3050,1660,2600],'12.9 英寸','2732 × 2048','631g',IPAD_10H,IPAD_INDEX,'ProMotion 最高 120Hz','USB‑C × 1'),
    ipad('ipadair3','2019-03-18','Air','iPad Air（第 3 代）',[cfg('a12',[],['64GB','256GB'])],[1050,1650,890,1400],'10.5 英寸','2224 × 1668','456g',IPAD_10H,IPAD_INDEX,'Apple 未标注 Hz','Lightning × 1；3.5mm'),
    ipad('ipadmini5','2019-03-18','mini','iPad mini（第 5 代）',[cfg('a12',[],['64GB','256GB'])],[1050,1650,890,1400],'7.9 英寸','2048 × 1536','300.5g',IPAD_10H,IPAD_INDEX,'Apple 未标注 Hz','Lightning × 1；3.5mm'),
    ipad('ipad7','2019-09-25','数字','iPad（第 7 代）',[cfg('a10',[],['32GB','128GB'])],[750,1150,640,980],'10.2 英寸','2160 × 1620','483g',IPAD_10H,IPAD_INDEX,'Apple 未标注 Hz','Lightning × 1；3.5mm'),
    ipad('ipadpro11_2','2020-03-25','Pro','iPad Pro 11 英寸（第 2 代）',[cfg('a12z_ipad',[],['128GB','256GB','512GB','1TB'])],[1850,2850,1570,2420],'11 英寸','2388 × 1668','471g',IPAD_10H,'https://support.apple.com/zh-cn/118452','ProMotion 最高 120Hz','USB‑C × 1'),
    ipad('ipadpro129_4','2020-03-25','Pro','iPad Pro 12.9 英寸（第 4 代）',[cfg('a12z_ipad',[],['128GB','256GB','512GB','1TB'])],[2250,3500,1910,2980],'12.9 英寸','2732 × 2048','641g',IPAD_10H,'https://support.apple.com/zh-cn/111977','ProMotion 最高 120Hz','USB‑C × 1'),
    ipad('ipad8','2020-09-18','数字','iPad（第 8 代）',[cfg('a12',[],['32GB','128GB'])],[950,1450,810,1230],'10.2 英寸','2160 × 1620','490g',IPAD_10H,'https://support.apple.com/zh-cn/118451','Apple 未标注 Hz','Lightning × 1；3.5mm'),
    ipad('ipadair4','2020-10-23','Air','iPad Air（第 4 代）',[cfg('a14',[],['64GB','256GB'])],[1550,2300,1320,1960],'10.9 英寸','2360 × 1640','458g',IPAD_10H,'https://support.apple.com/zh-cn/111905','Apple 未标注 Hz','USB‑C × 1'),
    ipad('ipadpro11_3','2021-05-21','Pro','iPad Pro 11 英寸（第 3 代）',[cfg('m1_ipad',['8GB'],['128GB','256GB','512GB']),cfg('m1_ipad',['16GB'],['1TB','2TB'])],[2650,3900,2250,3320],'11 英寸','2388 × 1668','466g',IPAD_10H,'https://support.apple.com/zh-cn/111897','ProMotion 最高 120Hz','Thunderbolt / USB 4 × 1'),
    ipad('ipadpro129_5','2021-05-21','Pro','iPad Pro 12.9 英寸（第 5 代）',[cfg('m1_ipad',['8GB'],['128GB','256GB','512GB']),cfg('m1_ipad',['16GB'],['1TB','2TB'])],[3450,5100,2930,4340],'12.9 英寸 mini‑LED','2732 × 2048','682g',IPAD_10H,'https://support.apple.com/zh-cn/111896','ProMotion 最高 120Hz','Thunderbolt / USB 4 × 1'),
    ipad('ipad9','2021-09-24','数字','iPad（第 9 代）',[cfg('a13',[],['64GB','256GB'])],[1050,1550,890,1320],'10.2 英寸','2160 × 1620','487g',IPAD_10H,'https://support.apple.com/zh-cn/111898','Apple 未标注 Hz','Lightning × 1；3.5mm'),
    ipad('ipadmini6','2021-09-24','mini','iPad mini（第 6 代）',[cfg('a15_5',[],['64GB','256GB'])],[2100,3000,1780,2550],'8.3 英寸','2266 × 1488','293g',IPAD_10H,IPAD_INDEX,'Apple 未标注 Hz','USB‑C × 1'),
    ipad('ipadair5','2022-03-18','Air','iPad Air（第 5 代）',[cfg('m1_ipad',['8GB'],['64GB','256GB'])],[2300,3300,1950,2810],'10.9 英寸','2360 × 1640','461g',IPAD_10H,'https://support.apple.com/zh-cn/111887','Apple 未标注 Hz','USB‑C × 1'),
    ipad('ipad10','2022-10-26','数字','iPad（第 10 代）',[cfg('a14',[],['64GB','256GB'])],[1800,2600,1530,2210],'10.9 英寸','2360 × 1640','477g',IPAD_10H,'https://support.apple.com/zh-cn/111840','Apple 未标注 Hz','USB‑C × 1'),
    ipad('ipadpro11_4','2022-10-26','Pro','iPad Pro 11 英寸（第 4 代）',[cfg('m2_ipad',['8GB'],['128GB','256GB','512GB']),cfg('m2_ipad',['16GB'],['1TB','2TB'])],[3350,4800,2850,4080],'11 英寸','2388 × 1668','466g',IPAD_10H,'https://support.apple.com/zh-cn/111842','ProMotion 最高 120Hz','Thunderbolt / USB 4 × 1'),
    ipad('ipadpro129_6','2022-10-26','Pro','iPad Pro 12.9 英寸（第 6 代）',[cfg('m2_ipad',['8GB'],['128GB','256GB','512GB']),cfg('m2_ipad',['16GB'],['1TB','2TB'])],[4300,6100,3650,5190],'12.9 英寸 mini‑LED','2732 × 2048','682g',IPAD_10H,'https://support.apple.com/zh-cn/111841','ProMotion 最高 120Hz','Thunderbolt / USB 4 × 1'),
    ipad('ipadair11_m2','2024-05-15','Air','iPad Air 11 英寸（M2）',[cfg('m2_ipad_9',['8GB'],['128GB','256GB','512GB','1TB'])],[2900,4100,2460,3490],'11 英寸','2360 × 1640','462g',IPAD_10H,'https://support.apple.com/zh-cn/119894','Apple 未标注 Hz','USB‑C × 1'),
    ipad('ipadair13_m2','2024-05-15','Air','iPad Air 13 英寸（M2）',[cfg('m2_ipad_9',['8GB'],['128GB','256GB','512GB','1TB'])],[3900,5350,3310,4550],'13 英寸','2732 × 2048','617g',IPAD_10H,'https://support.apple.com/zh-cn/119893','Apple 未标注 Hz','USB‑C × 1'),
    ipad('ipadpro11_m4','2024-05-15','Pro','iPad Pro 11 英寸（M4）',[cfg('m4_ipad_9',['8GB'],['256GB','512GB']),cfg('m4_ipad_10',['16GB'],['1TB','2TB'],4200,'1TB / 2TB 配置启用 10 核 CPU 与 16GB 内存')],[5250,7100,4460,6040],'11 英寸 OLED','2420 × 1668','444g',IPAD_10H,'https://support.apple.com/zh-cn/119892','ProMotion 10–120Hz','Thunderbolt / USB 4 × 1'),
    ipad('ipadpro13_m4','2024-05-15','Pro','iPad Pro 13 英寸（M4）',[cfg('m4_ipad_9',['8GB'],['256GB','512GB']),cfg('m4_ipad_10',['16GB'],['1TB','2TB'],4800,'1TB / 2TB 配置启用 10 核 CPU 与 16GB 内存')],[7100,9400,6030,7990],'13 英寸 OLED','2752 × 2064','579g',IPAD_10H,'https://support.apple.com/zh-cn/119891','ProMotion 10–120Hz','Thunderbolt / USB 4 × 1'),
    ipad('ipadmini_a17','2024-10-23','mini','iPad mini（A17 Pro）',[cfg('a17pro_5',['8GB'],['128GB','256GB','512GB'])],[2850,3850,2420,3270],'8.3 英寸','2266 × 1488','293g',IPAD_10H,IPAD_INDEX,'Apple 未标注 Hz','USB‑C × 1'),
    ipad('ipad_a16','2025-03-12','数字','iPad（A16）',[cfg('a16_ipad',[],['128GB','256GB','512GB'])],[2200,3000,1870,2550],'11 英寸','2360 × 1640','477g',IPAD_10H,'https://support.apple.com/zh-cn/122240','Apple 未标注 Hz','USB‑C × 1'),
    ipad('ipadair11_m3','2025-03-12','Air','iPad Air 11 英寸（M3）',[cfg('m3_ipad',['8GB'],['128GB','256GB','512GB','1TB'])],[3650,4850,3100,4120],'11 英寸','2360 × 1640','460g',IPAD_10H,'https://support.apple.com/zh-cn/122241','Apple 未标注 Hz','USB‑C × 1'),
    ipad('ipadair13_m3','2025-03-12','Air','iPad Air 13 英寸（M3）',[cfg('m3_ipad',['8GB'],['128GB','256GB','512GB','1TB'])],[4700,6100,3990,5190],'13 英寸','2732 × 2048','616g',IPAD_10H,'https://support.apple.com/zh-cn/122242','Apple 未标注 Hz','USB‑C × 1'),
    ipad('ipadpro11_m5','2025-10-22','Pro','iPad Pro 11 英寸（M5）',[cfg('m5_ipad_9',['12GB'],['256GB','512GB']),cfg('m5_ipad_10',['16GB'],['1TB','2TB'],4300,'1TB / 2TB 配置启用 10 核 CPU 与 16GB 内存')],[6500,8250,5520,7010],'11 英寸 OLED','2420 × 1668','444g',IPAD_10H,'https://support.apple.com/zh-cn/125406','ProMotion 10–120Hz','Thunderbolt / USB 4 × 1'),
    ipad('ipadpro13_m5','2025-10-22','Pro','iPad Pro 13 英寸（M5）',[cfg('m5_ipad_9',['12GB'],['256GB','512GB']),cfg('m5_ipad_10',['16GB'],['1TB','2TB'],5000,'1TB / 2TB 配置启用 10 核 CPU 与 16GB 内存')],[8300,10500,7050,8930],'13 英寸 OLED','2752 × 2064','579g',IPAD_10H,'https://support.apple.com/zh-cn/125407','ProMotion 10–120Hz','Thunderbolt / USB 4 × 1'),
    ipad('ipadair11_m4','2026-03-11','Air','iPad Air 11 英寸（M4）',[cfg('m4_ipad_8_9',['12GB'],['128GB','256GB','512GB','1TB'])],[4550,5800,3870,4930],'11 英寸','2360 × 1640','464g','28.93Wh；'+IPAD_10H,'https://support.apple.com/zh-cn/126471','Apple 未标注 Hz','USB‑C（USB 3）× 1；Smart Connector'),
    ipad('ipadair13_m4','2026-03-11','Air','iPad Air 13 英寸（M4）',[cfg('m4_ipad_8_9',['12GB'],['128GB','256GB','512GB','1TB'])],[5650,7050,4800,5990],'13 英寸','2732 × 2048','616g','36.59Wh；'+IPAD_10H,'https://support.apple.com/zh-cn/126472','Apple 未标注 Hz','USB‑C（USB 3）× 1；Smart Connector')
  );

  const macSpec=(display,resolution,refresh,weight,battery,ports,brightness='500 尼特',camera='720p FaceTime HD',wireless='Wi‑Fi 5；蓝牙 4.x',external='见 Apple 官方规格')=>({display,resolution,refresh,weight,battery,ports,brightness,camera,wireless,external});
  const S256=['256GB','512GB'],S512=['512GB','1TB','2TB'],S4=['512GB','1TB','2TB','4TB'];

  /* Intel Mac：拆分不同端口 / 尺寸机型，芯片与独显仍在同一机型行内切换。 */
  products.push(
    mac('macbook12_2016','2016-04-19','MacBook','MacBook 12 英寸（2016）',MACBOOK_INDEX,[cfg('intel_2016_mb_m3',['8GB'],S256),cfg('intel_2016_mb_m5',['8GB'],S256,500),cfg('intel_2016_mb_m7',['8GB'],S256,900)],[900,1450,760,1230],macSpec('12 英寸 Retina','2304 × 1440','60Hz','0.92kg','41.4Wh','USB‑C × 1；3.5mm','300 尼特')),
    mac('mbp13_2016_2','2016-10-27','Pro 13','MacBook Pro 13 英寸（2016，双雷雳 3）','https://support.apple.com/zh-cn/111999',[cfg('intel_mbp13_2016_2_i5',['8GB','16GB'],['256GB','512GB','1TB']),cfg('intel_mbp13_2016_2_i7',['8GB','16GB'],['256GB','512GB','1TB'],700)],[1150,1850,980,1570],macSpec('13.3 英寸 Retina','2560 × 1600','60Hz','1.37kg','54.5Wh','雷雳 3 × 2；3.5mm')),
    mac('mbp13_2016_4','2016-10-27','Pro 13','MacBook Pro 13 英寸（2016，四雷雳 3）','https://support.apple.com/zh-cn/112003',[cfg('intel_mbp13_2016_4_i5',['8GB','16GB'],['256GB','512GB','1TB']),cfg('intel_mbp13_2016_4_i5hi',['8GB','16GB'],['256GB','512GB','1TB'],400),cfg('intel_mbp13_2016_4_i7',['8GB','16GB'],['256GB','512GB','1TB'],800)],[1350,2200,1150,1870],macSpec('13.3 英寸 Retina','2560 × 1600','60Hz','1.37kg','49.2Wh','雷雳 3 × 4；3.5mm')),
    mac('mbp15_2016','2016-10-27','Pro 15','MacBook Pro 15 英寸（2016）','https://support.apple.com/zh-cn/111975',intelMatrix('mx15_2016',[
      {source:'intel_mbp15_2016_450',label:'Core i7 2.6GHz',delta:0},{source:'intel_mbp15_2016_455',label:'Core i7 2.7GHz',delta:450},{source:'intel_mbp15_2016_460',label:'Core i7 2.9GHz',delta:900}
    ],[
      {source:'intel_mbp15_2016_450',label:'Radeon Pro 450',delta:0},{source:'intel_mbp15_2016_455',label:'Radeon Pro 455',delta:400},{source:'intel_mbp15_2016_460',label:'Radeon Pro 460',delta:850}
    ],['16GB'],['256GB','512GB','1TB','2TB']),[1800,2850,1530,2420],macSpec('15.4 英寸 Retina','2880 × 1800','60Hz','1.83kg','76Wh','雷雳 3 × 4；3.5mm')),
    mac('macbook12_2017','2017-06-05','MacBook','MacBook 12 英寸（2017）',MACBOOK_INDEX,[cfg('intel_2017_mb_m3',['8GB','16GB'],S256),cfg('intel_2017_mb_i5',['8GB','16GB'],S256,500),cfg('intel_2017_mb_i7',['8GB','16GB'],S256,900)],[1100,1750,940,1490],macSpec('12 英寸 Retina','2304 × 1440','60Hz','0.92kg','41.4Wh','USB‑C × 1；3.5mm','300 尼特')),
    mac('mba13_2017','2017-06-05','Air','MacBook Air 13 英寸（2017）',MBA_INDEX,[cfg('intel_air_old_i5',['8GB'],['128GB','256GB','512GB']),cfg('intel_air_old_i7',['8GB'],['128GB','256GB','512GB'],500)],[900,1450,760,1230],macSpec('13.3 英寸','1440 × 900','60Hz','1.35kg','54Wh','USB‑A × 2；雷雳 2 × 1；SDXC；MagSafe 2；3.5mm','300 尼特')),
    mac('mbp13_2017_2','2017-06-05','Pro 13','MacBook Pro 13 英寸（2017，双雷雳 3）',MBP_INDEX,[cfg('intel_mbp13_2017_2_i5',['8GB','16GB'],['128GB','256GB','512GB','1TB']),cfg('intel_mbp13_2017_2_i7',['8GB','16GB'],['128GB','256GB','512GB','1TB'],750)],[1300,2050,1100,1740],macSpec('13.3 英寸 Retina','2560 × 1600','60Hz','1.37kg','54.5Wh','雷雳 3 × 2；3.5mm')),
    mac('mbp13_2017_4','2017-06-05','Pro 13','MacBook Pro 13 英寸（2017，四雷雳 3）',MBP_INDEX,[cfg('intel_mbp13_2017_4_i5',['8GB','16GB'],['256GB','512GB','1TB']),cfg('intel_mbp13_2017_4_i5hi',['8GB','16GB'],['256GB','512GB','1TB'],400),cfg('intel_mbp13_2017_4_i7',['8GB','16GB'],['256GB','512GB','1TB'],800)],[1550,2400,1320,2040],macSpec('13.3 英寸 Retina','2560 × 1600','60Hz','1.37kg','49.2Wh','雷雳 3 × 4；3.5mm')),
    mac('mbp15_2017','2017-06-05','Pro 15','MacBook Pro 15 英寸（2017）',MBP_INDEX,intelMatrix('mx15_2017',[
      {source:'intel_mbp15_2017_555',label:'Core i7 2.8GHz',delta:0},{source:'intel_mbp15_2017_560',label:'Core i7 2.9GHz',delta:450},{source:'intel_mbp15_2017_i7hi',label:'Core i7 3.1GHz',delta:900}
    ],[
      {source:'intel_mbp15_2017_555',label:'Radeon Pro 555',delta:0},{source:'intel_mbp15_2017_560',label:'Radeon Pro 560',delta:650}
    ],['16GB'],['256GB','512GB','1TB','2TB']),[2100,3300,1780,2810],macSpec('15.4 英寸 Retina','2880 × 1800','60Hz','1.83kg','76Wh','雷雳 3 × 4；3.5mm')),
    mac('mba13_2018','2018-11-07','Air','MacBook Air 13 英寸（Retina，2018）',MBA_INDEX,[cfg('intel_air_2018',['8GB','16GB'],['128GB','256GB','512GB','1.5TB'])],[1250,1950,1060,1660],macSpec('13.3 英寸 Retina','2560 × 1600','60Hz','1.25kg','50.3Wh','雷雳 3 × 2；3.5mm','300 尼特')),
    mac('mbp13_2018','2018-07-12','Pro 13','MacBook Pro 13 英寸（2018）',MBP_INDEX,[cfg('intel_mbp13_2018_i5',['8GB','16GB'],['256GB','512GB','1TB','2TB']),cfg('intel_mbp13_2018_i7',['8GB','16GB'],['256GB','512GB','1TB','2TB'],900)],[1900,2950,1610,2510],macSpec('13.3 英寸 Retina','2560 × 1600','60Hz','1.37kg','58Wh','雷雳 3 × 4；3.5mm')),
    mac('mbp15_2018','2018-07-12','Pro 15','MacBook Pro 15 英寸（2018）',MBP_INDEX,intelMatrix('mx15_2018',[
      {source:'intel_mbp15_2018_555x',label:'Core i7 2.2GHz',delta:0},{source:'intel_mbp15_2018_560x',label:'Core i7 2.6GHz',delta:650},{source:'intel_mbp15_2018_vega',label:'Core i9 2.9GHz',delta:1250}
    ],[
      {source:'intel_mbp15_2018_555x',label:'Radeon Pro 555X',delta:0},{source:'intel_mbp15_2018_560x',label:'Radeon Pro 560X',delta:650},{source:'intel_mbp15_2018_vega16',label:'Radeon Pro Vega 16',delta:1250},{source:'intel_mbp15_2018_vega',label:'Radeon Pro Vega 20',delta:1650}
    ],['16GB','32GB'],S4),[2700,4300,2290,3660],macSpec('15.4 英寸 Retina','2880 × 1800','60Hz','1.83kg','83.6Wh','雷雳 3 × 4；3.5mm')),
    mac('mba13_2019','2019-07-09','Air','MacBook Air 13 英寸（Retina，2019）',MBA_INDEX,[cfg('intel_air_2018',['8GB','16GB'],['128GB','256GB','512GB','1TB'])],[1450,2200,1230,1870],macSpec('13.3 英寸 Retina','2560 × 1600','60Hz','1.25kg','49.9Wh','雷雳 3 × 2；3.5mm','400 尼特')),
    mac('mbp13_2019_2','2019-07-09','Pro 13','MacBook Pro 13 英寸（2019，双雷雳 3）',MBP_INDEX,[cfg('intel_mbp13_2019_2_i5',['8GB','16GB'],['128GB','256GB','512GB','1TB']),cfg('intel_mbp13_2019_2_i7',['8GB','16GB'],['128GB','256GB','512GB','1TB'],850)],[1850,2800,1570,2380],macSpec('13.3 英寸 Retina','2560 × 1600','60Hz','1.37kg','58.2Wh','雷雳 3 × 2；3.5mm')),
    mac('mbp13_2019_4','2019-05-21','Pro 13','MacBook Pro 13 英寸（2019，四雷雳 3）',MBP_INDEX,[cfg('intel_mbp13_2019_4_i5',['8GB','16GB'],S512),cfg('intel_mbp13_2019_4_i7',['8GB','16GB'],S512,950)],[2250,3400,1910,2890],macSpec('13.3 英寸 Retina','2560 × 1600','60Hz','1.37kg','58Wh','雷雳 3 × 4；3.5mm')),
    mac('mbp15_2019','2019-05-21','Pro 15','MacBook Pro 15 英寸（2019）',MBP_INDEX,intelMatrix('mx15_2019',[
      {source:'intel_mbp15_2019_555x',label:'Core i7 2.6GHz',delta:0},{source:'intel_mbp15_2019_560x',label:'Core i9 2.3GHz',delta:750},{source:'intel_mbp15_2019_vega',label:'Core i9 2.4GHz',delta:1250}
    ],[
      {source:'intel_mbp15_2019_555x',label:'Radeon Pro 555X',delta:0},{source:'intel_mbp15_2019_560x',label:'Radeon Pro 560X',delta:650},{source:'intel_mbp15_2019_vega16',label:'Radeon Pro Vega 16',delta:1250},{source:'intel_mbp15_2019_vega',label:'Radeon Pro Vega 20',delta:1650}
    ],['16GB','32GB'],S4),[3100,4900,2630,4170],macSpec('15.4 英寸 Retina','2880 × 1800','60Hz','1.83kg','83.6Wh','雷雳 3 × 4；3.5mm')),
    mac('mbp16_2019','2019-11-13','Pro 16','MacBook Pro 16 英寸（2019）',MBP_INDEX,intelMatrix('mx16_2019',[
      {source:'intel_mbp16_5300',label:'Core i7 2.6GHz',delta:0},{source:'intel_mbp16_5500',label:'Core i9 2.3GHz',delta:800},{source:'intel_mbp16_5600',label:'Core i9 2.4GHz',delta:1300}
    ],[
      {source:'intel_mbp16_5300',label:'Radeon Pro 5300M',delta:0},{source:'intel_mbp16_5500',label:'Radeon Pro 5500M',delta:1100},{source:'intel_mbp16_5600',label:'Radeon Pro 5600M',delta:4300}
    ],['16GB','32GB','64GB'],['512GB','1TB','2TB','4TB','8TB']),[3900,6200,3310,5270],macSpec('16 英寸 Retina','3072 × 1920','60Hz','2.0kg','100Wh','雷雳 3 × 4；3.5mm')),
    mac('mba13_intel_2020','2020-03-18','Air','MacBook Air 13 英寸（Intel，2020）','https://support.apple.com/zh-cn/111991',[cfg('intel_air_2020_i3',['8GB','16GB'],['256GB','512GB','1TB','2TB']),cfg('intel_air_2020_i5',['8GB','16GB'],['256GB','512GB','1TB','2TB'],500),cfg('intel_air_2020_i7',['8GB','16GB'],['256GB','512GB','1TB','2TB'],900)],[1850,2900,1570,2470],macSpec('13.3 英寸 Retina','2560 × 1600','60Hz','1.29kg','49.9Wh','雷雳 3 × 2；3.5mm','400 尼特')),
    mac('mbp13_intel_2020_2','2020-05-04','Pro 13','MacBook Pro 13 英寸（Intel 2020，双雷雳 3）','https://support.apple.com/zh-cn/111339',[cfg('intel_mbp13_2019_2_i5',['8GB','16GB'],['256GB','512GB','1TB','2TB']),cfg('intel_mbp13_2019_2_i7',['8GB','16GB'],['256GB','512GB','1TB','2TB'],850)],[2250,3500,1910,2980],macSpec('13.3 英寸 Retina','2560 × 1600','60Hz','1.4kg','58.2Wh','雷雳 3 × 2；3.5mm')),
    mac('mbp13_intel_2020','2020-05-04','Pro 13','MacBook Pro 13 英寸（Intel 2020，四雷雳 3）','https://support.apple.com/zh-cn/111339',[cfg('intel_mbp13_2020_i5',['16GB','32GB'],['512GB','1TB','2TB','4TB']),cfg('intel_mbp13_2020_i7',['16GB','32GB'],['512GB','1TB','2TB','4TB'],1100)],[2800,4300,2380,3660],macSpec('13.3 英寸 Retina','2560 × 1600','60Hz','1.4kg','58Wh','雷雳 3 × 4；3.5mm'))
  );

  /* Apple silicon Mac：所有官方芯片档位都放在对应机型的下拉选项内。 */
  products.push(
    mac('mba13_m1','2020-11-17','Air','MacBook Air 13 英寸（M1，2020）','https://support.apple.com/zh-cn/111883',[cfg('m1_8_7',['8GB','16GB'],S256),cfg('m1_8_8',['8GB','16GB'],S256,500)],[3000,4300,2550,3660],macSpec('13.3 英寸 Retina','2560 × 1600','60Hz','1.29kg','49.9Wh','雷雳 / USB 4 × 2；3.5mm','400 尼特','720p FaceTime HD','Wi‑Fi 6；蓝牙 5.0','1 台最高 6K 60Hz')),
    mac('mbp13_m1','2020-11-17','Pro 13','MacBook Pro 13 英寸（M1，2020）','https://support.apple.com/zh-cn/111893',[cfg('m1_8_8',['8GB','16GB'],['256GB','512GB','1TB','2TB'])],[3600,5100,3060,4340],macSpec('13.3 英寸 Retina','2560 × 1600','60Hz','1.4kg','58.2Wh','雷雳 / USB 4 × 2；3.5mm','500 尼特','720p FaceTime HD','Wi‑Fi 6；蓝牙 5.0','1 台最高 6K 60Hz')),
    mac('mbp14_2021','2021-10-26','Pro 14','MacBook Pro 14 英寸（2021）','https://support.apple.com/zh-cn/111902',[
      cfg('m1pro_8_14',P16,SSD8),
      cfg('m1pro_10_14',P16,SSD8,900),
      cfg('m1pro_10_16',P16,SSD8,1500),
      cfg('m1max_10_24',PMAX,SSD8,4200),
      cfg('m1max_10_32',PMAX,SSD8,6100)
    ],[5900,7900,5010,6720],macSpec('14.2 英寸 Liquid Retina XDR','3024 × 1964','ProMotion 最高 120Hz','1.6kg','69.6Wh（官方标称 70Wh）','雷雳 4 × 3；HDMI；SDXC；MagSafe 3；3.5mm','XDR 1000 尼特持续 / 1600 尼特峰值','1080p FaceTime HD','Wi‑Fi 6；蓝牙 5.0','M1 Pro 最多 2 台 6K；M1 Max 最多 3 台 6K + 1 台 4K')),
    mac('mbp16_2021','2021-10-26','Pro 16','MacBook Pro 16 英寸（2021）','https://support.apple.com/zh-cn/111901',[
      cfg('m1pro_10_16',P16,SSD8),
      cfg('m1max_10_24',PMAX,SSD8,3600),
      cfg('m1max_10_32',PMAX,SSD8,5400)
    ],[7100,9500,6030,8080],macSpec('16.2 英寸 Liquid Retina XDR','3456 × 2234','ProMotion 最高 120Hz','2.1kg（M1 Max 2.2kg）','99.6Wh（官方标称 100Wh）','雷雳 4 × 3；HDMI；SDXC；MagSafe 3；3.5mm','XDR 1000 尼特持续 / 1600 尼特峰值','1080p FaceTime HD','Wi‑Fi 6；蓝牙 5.0','M1 Pro 最多 2 台 6K；M1 Max 最多 3 台 6K + 1 台 4K')),
    mac('mba13_m2','2022-07-15','Air','MacBook Air 13 英寸（M2，2022）','https://support.apple.com/zh-cn/111867',[cfg('m2_8_8',['8GB','16GB','24GB'],S256),cfg('m2_8_10',['8GB','16GB','24GB'],S256,700)],[4100,5600,3490,4760],macSpec('13.6 英寸 Liquid Retina','2560 × 1664','60Hz','1.24kg','52.6Wh','雷雳 / USB 4 × 2；MagSafe 3；3.5mm','500 尼特','1080p FaceTime HD','Wi‑Fi 6；蓝牙 5.3','1 台最高 6K 60Hz')),
    mac('mbp13_m2','2022-06-24','Pro 13','MacBook Pro 13 英寸（M2，2022）','https://support.apple.com/zh-cn/111869',[cfg('m2_8_10',['8GB','16GB','24GB'],['256GB','512GB','1TB','2TB'])],[4700,6300,4000,5360],macSpec('13.3 英寸 Retina','2560 × 1600','60Hz','1.4kg','58.2Wh','雷雳 / USB 4 × 2；3.5mm','500 尼特','720p FaceTime HD','Wi‑Fi 6；蓝牙 5.0','1 台最高 6K 60Hz')),
    mac('mbp14_m2','2023-01-24','Pro 14','MacBook Pro 14 英寸（M2 Pro / Max，2023）','https://support.apple.com/zh-cn/111340',[cfg('m2pro_10_16',['16GB','32GB'],['512GB','1TB','2TB','4TB','8TB']),cfg('m2pro_12_19',['16GB','32GB'],['512GB','1TB','2TB','4TB','8TB'],2200),cfg('m2max_12_30',['32GB','64GB'],['1TB','2TB','4TB','8TB'],5200),cfg('m2max_12_38',['32GB','64GB','96GB'],['1TB','2TB','4TB','8TB'],7600)],[8000,10500,6800,8930],macSpec('14.2 英寸 Liquid Retina XDR','3024 × 1964','ProMotion 最高 120Hz','1.6kg','70Wh','雷雳 4 × 3；HDMI 2.1；SDXC；MagSafe 3；3.5mm','XDR 1000 / 1600 尼特','1080p FaceTime HD','Wi‑Fi 6E；蓝牙 5.3')),
    mac('mbp16_m2','2023-01-24','Pro 16','MacBook Pro 16 英寸（M2 Pro / Max，2023）','https://support.apple.com/zh-cn/111838',[cfg('m2pro_12_19',['16GB','32GB'],['512GB','1TB','2TB','4TB','8TB']),cfg('m2max_12_30',['32GB','64GB'],['1TB','2TB','4TB','8TB'],4300),cfg('m2max_12_38',['32GB','64GB','96GB'],['1TB','2TB','4TB','8TB'],6700)],[9200,12100,7820,10290],macSpec('16.2 英寸 Liquid Retina XDR','3456 × 2234','ProMotion 最高 120Hz','2.15kg（Max 2.16kg）','100Wh','雷雳 4 × 3；HDMI 2.1；SDXC；MagSafe 3；3.5mm','XDR 1000 / 1600 尼特','1080p FaceTime HD','Wi‑Fi 6E；蓝牙 5.3')),
    mac('mba15_m2','2023-06-13','Air','MacBook Air 15 英寸（M2，2023）','https://support.apple.com/zh-cn/111346',[cfg('m2_8_10',['8GB','16GB','24GB'],S256)],[5000,6700,4250,5700],macSpec('15.3 英寸 Liquid Retina','2880 × 1864','60Hz','1.51kg','66.5Wh','雷雳 / USB 4 × 2；MagSafe 3；3.5mm','500 尼特','1080p FaceTime HD','Wi‑Fi 6；蓝牙 5.3','1 台最高 6K 60Hz')),
    mac('mbp14_m3','2023-11-07','Pro 14','MacBook Pro 14 英寸（M3 系列，2023）','https://support.apple.com/zh-cn/117736',[cfg('m3_8_10',['8GB','16GB','24GB'],['512GB','1TB','2TB']),cfg('m3pro_11_14',['18GB','36GB'],['512GB','1TB','2TB','4TB'],2500),cfg('m3pro_12_18',['18GB','36GB'],['512GB','1TB','2TB','4TB'],4300),cfg('m3max_14_30',['36GB','96GB'],['1TB','2TB','4TB','8TB'],7200),cfg('m3max_16_40',['48GB','64GB','128GB'],['1TB','2TB','4TB','8TB'],10600)],[8500,11200,7230,9520],macSpec('14.2 英寸 Liquid Retina XDR','3024 × 1964','ProMotion 最高 120Hz','1.55kg（Pro 1.61kg / Max 1.62kg）','70 / 72.4Wh','M3：雷雳 / USB 4 × 2；Pro/Max：雷雳 4 × 3；HDMI；SDXC；MagSafe 3；3.5mm','SDR 600；XDR 1000 / 1600 尼特','1080p FaceTime HD','Wi‑Fi 6E；蓝牙 5.3')),
    mac('mbp16_m3','2023-11-07','Pro 16','MacBook Pro 16 英寸（M3 Pro / Max，2023）','https://support.apple.com/zh-cn/117737',[cfg('m3pro_12_18',['18GB','36GB'],['512GB','1TB','2TB','4TB']),cfg('m3max_14_30',['36GB','96GB'],['1TB','2TB','4TB','8TB'],5200),cfg('m3max_16_40',['48GB','64GB','128GB'],['1TB','2TB','4TB','8TB'],8600)],[10100,13300,8590,11310],macSpec('16.2 英寸 Liquid Retina XDR','3456 × 2234','ProMotion 最高 120Hz','2.14kg（Max 2.16kg）','100Wh','雷雳 4 × 3；HDMI 2.1；SDXC；MagSafe 3；3.5mm','SDR 600；XDR 1000 / 1600 尼特','1080p FaceTime HD','Wi‑Fi 6E；蓝牙 5.3')),
    mac('mba13_m3','2024-03-08','Air','MacBook Air 13 英寸（M3，2024）','https://support.apple.com/zh-cn/118551',[cfg('m3_8_8',['8GB','16GB','24GB'],S256),cfg('m3_8_10',['8GB','16GB','24GB'],S256,700)],[5200,6800,4420,5780],macSpec('13.6 英寸 Liquid Retina','2560 × 1664','60Hz','1.24kg','52.6Wh','雷雳 / USB 4 × 2；MagSafe 3；3.5mm','500 尼特','1080p FaceTime HD','Wi‑Fi 6E；蓝牙 5.3','合盖最多 2 台外接显示器')),
    mac('mba15_m3','2024-03-08','Air','MacBook Air 15 英寸（M3，2024）','https://support.apple.com/zh-cn/118552',[cfg('m3_8_10',['8GB','16GB','24GB'],S256)],[6100,7900,5180,6720],macSpec('15.3 英寸 Liquid Retina','2880 × 1864','60Hz','1.51kg','66.5Wh','雷雳 / USB 4 × 2；MagSafe 3；3.5mm','500 尼特','1080p FaceTime HD','Wi‑Fi 6E；蓝牙 5.3','合盖最多 2 台外接显示器')),
    mac('mbp14_m4','2024-11-08','Pro 14','MacBook Pro 14 英寸（M4 系列，2024）','https://support.apple.com/zh-cn/121553',[cfg('m4_10_10',['16GB','24GB','32GB'],['512GB','1TB','2TB']),cfg('m4pro_12_16',['24GB','48GB'],['512GB','1TB','2TB','4TB'],3000),cfg('m4pro_14_20',['24GB','48GB'],['512GB','1TB','2TB','4TB'],5200),cfg('m4max_14_32',['36GB'],['1TB','2TB','4TB','8TB'],8500),cfg('m4max_16_40',['48GB','64GB','128GB'],['1TB','2TB','4TB','8TB'],11900)],[10200,13200,8670,11220],macSpec('14.2 英寸 Liquid Retina XDR','3024 × 1964','ProMotion 最高 120Hz','1.55kg（Pro/Max 约 1.6kg）','72.4Wh','雷雳 4 × 3（Pro/Max 雷雳 5）；HDMI；SDXC；MagSafe 3；3.5mm','SDR 1000；XDR 1000 / 1600 尼特','1200 万像素人物居中','Wi‑Fi 6E；蓝牙 5.3')),
    mac('mbp16_m4','2024-11-08','Pro 16','MacBook Pro 16 英寸（M4 Pro / Max，2024）','https://support.apple.com/zh-cn/121554',[cfg('m4pro_14_20',['24GB','48GB'],['512GB','1TB','2TB','4TB']),cfg('m4max_14_32',['36GB'],['1TB','2TB','4TB','8TB'],5700),cfg('m4max_16_40',['48GB','64GB','128GB'],['1TB','2TB','4TB','8TB'],9000)],[11900,15300,10120,13010],macSpec('16.2 英寸 Liquid Retina XDR','3456 × 2234','ProMotion 最高 120Hz','2.14kg（Max 2.15kg）','100Wh','雷雳 5 × 3；HDMI；SDXC；MagSafe 3；3.5mm','SDR 1000；XDR 1000 / 1600 尼特','1200 万像素人物居中','Wi‑Fi 6E；蓝牙 5.3')),
    mac('mba13_m4','2025-03-12','Air','MacBook Air 13 英寸（M4，2025）','https://support.apple.com/zh-cn/122209',[cfg('m4_10_10',['16GB','24GB','32GB'],S256)],[6500,8100,5520,6890],macSpec('13.6 英寸 Liquid Retina','2560 × 1664','60Hz','1.24kg','53.8Wh','雷雳 4 × 2；MagSafe 3；3.5mm','500 尼特','1200 万像素人物居中','Wi‑Fi 6E；蓝牙 5.3','最多 2 台 6K 外接显示器')),
    mac('mba15_m4','2025-03-12','Air','MacBook Air 15 英寸（M4，2025）','https://support.apple.com/zh-cn/122210',[cfg('m4_10_10',['16GB','24GB','32GB'],S256)],[7600,9300,6460,7910],macSpec('15.3 英寸 Liquid Retina','2880 × 1864','60Hz','1.51kg','66.5Wh','雷雳 4 × 2；MagSafe 3；3.5mm','500 尼特','1200 万像素人物居中','Wi‑Fi 6E；蓝牙 5.3','最多 2 台 6K 外接显示器')),
    mac('mbp14_m5','2025-10-22','Pro 14','MacBook Pro 14 英寸（M5，2025）','https://support.apple.com/zh-cn/125405',[cfg('m5_10_10',['16GB','24GB','32GB'],['512GB','1TB','2TB','4TB'])],[11800,14500,10030,12320],macSpec('14.2 英寸 Liquid Retina XDR','3024 × 1964','ProMotion 最高 120Hz','约 1.55kg','72.4Wh','雷雳 4 × 3；HDMI；SDXC；MagSafe 3；3.5mm','SDR 1000；XDR 1000 / 1600 尼特','1200 万像素人物居中','Wi‑Fi 6E；蓝牙 5.3')),
    mac('macbook_neo','2026-03-11','Neo','MacBook Neo（2026）','https://support.apple.com/zh-cn/126322',[cfg('a18pro_5',['8GB'],['256GB','512GB'])],[4200,5200,3570,4420],macSpec('13 英寸 Liquid Retina','2408 × 1506','60Hz','1.23kg','36.5Wh','USB 3 USB‑C × 1；USB 2 USB‑C × 1；3.5mm','500 尼特','1080p FaceTime HD','Wi‑Fi 6E；蓝牙 5.3','1 台最高 4K 外接显示器')),
    mac('mba13_m5','2026-03-11','Air','MacBook Air 13 英寸（M5，2026）','https://support.apple.com/zh-cn/126320',[cfg('m5_10_8',['16GB','24GB','32GB'],S256),cfg('m5_10_10',['16GB','24GB','32GB'],S256,700)],[8000,9700,6800,8250],macSpec('13.6 英寸 Liquid Retina','2560 × 1664','60Hz','约 1.24kg','约 54Wh','雷雳 4 × 2；MagSafe 3；3.5mm','500 尼特','1200 万像素人物居中','Wi‑Fi 7；蓝牙 6','最多 2 台外接显示器')),
    mac('mba15_m5','2026-03-11','Air','MacBook Air 15 英寸（M5，2026）','https://support.apple.com/zh-cn/126321',[cfg('m5_10_10',['16GB','24GB','32GB'],S256)],[9100,10900,7740,9270],macSpec('15.3 英寸 Liquid Retina','2880 × 1864','60Hz','约 1.51kg','约 66Wh','雷雳 4 × 2；MagSafe 3；3.5mm','500 尼特','1200 万像素人物居中','Wi‑Fi 7；蓝牙 6','最多 2 台外接显示器')),
    mac('mbp14_m5pro','2026-03-11','Pro 14','MacBook Pro 14 英寸（M5 Pro / Max，2026）','https://support.apple.com/zh-cn/126318',[cfg('m5pro_15_16',['24GB','48GB'],['1TB','2TB','4TB']),cfg('m5pro_18_20',['24GB','48GB','64GB'],['1TB','2TB','4TB'],2600),cfg('m5max_18_32',['36GB'],['2TB','4TB','8TB'],6200),cfg('m5max_18_40',['48GB','64GB','128GB'],['2TB','4TB','8TB'],9400)],[14500,17800,12320,15130],macSpec('14.2 英寸 Liquid Retina XDR','3024 × 1964','ProMotion 最高 120Hz','约 1.6kg','约 72Wh','雷雳 5 × 3；HDMI；SDXC；MagSafe 3；3.5mm','SDR 1000；XDR 1000 / 1600 尼特','1200 万像素人物居中','Wi‑Fi 7；蓝牙 6')),
    mac('mbp16_m5pro','2026-03-11','Pro 16','MacBook Pro 16 英寸（M5 Pro / Max，2026）','https://support.apple.com/zh-cn/126319',[cfg('m5pro_18_20',['24GB','48GB','64GB'],['1TB','2TB','4TB']),cfg('m5max_18_32',['36GB'],['2TB','4TB','8TB'],5200),cfg('m5max_18_40',['48GB','64GB','128GB'],['2TB','4TB','8TB'],8400)],[16300,19900,13860,16920],macSpec('16.2 英寸 Liquid Retina XDR','3456 × 2234','ProMotion 最高 120Hz','约 2.15kg','100Wh','雷雳 5 × 3；HDMI；SDXC；MagSafe 3；3.5mm','SDR 1000；XDR 1000 / 1600 尼特','1200 万像素人物居中','Wi‑Fi 7；蓝牙 6'))
  );

  /* Apple 不公开 iPhone Wh：统一改用官方视频 / 流媒体续航，避免混入拆机容量。 */
  const iphoneOfficial={
    se1:['https://support.apple.com/zh-cn/112005','视频播放最长 13 小时'],'7':['https://support.apple.com/zh-cn/111943','视频无线播放最长 13 小时'],'7plus':['https://support.apple.com/zh-cn/111953','视频无线播放最长 14 小时'],
    '8':['https://support.apple.com/zh-cn/111976','视频无线播放最长 13 小时'],'8plus':['https://support.apple.com/zh-cn/111950','视频无线播放最长 14 小时'],x:['https://support.apple.com/zh-cn/111864','视频无线播放最长 13 小时'],
    xr:['https://support.apple.com/zh-cn/111868','视频无线播放最长 16 小时'],xs:['https://support.apple.com/zh-cn/111881','视频无线播放最长 14 小时'],xsmax:['https://support.apple.com/zh-cn/111880','视频无线播放最长 15 小时'],
    '11':['https://support.apple.com/zh-cn/111865','视频 17 小时 / 流媒体 10 小时'],'11pro':['https://support.apple.com/zh-cn/111879','视频 18 小时 / 流媒体 11 小时'],'11pm':['https://support.apple.com/zh-cn/111878','视频 20 小时 / 流媒体 12 小时'],
    se2:['https://support.apple.com/zh-cn/111882','视频 13 小时 / 流媒体 8 小时'],'12mini':['https://support.apple.com/zh-cn/111877','视频 15 小时 / 流媒体 10 小时'],'12':['https://support.apple.com/zh-cn/111876','视频 17 小时 / 流媒体 11 小时'],'12pro':['https://support.apple.com/zh-cn/111875','视频 17 小时 / 流媒体 11 小时'],'12pm':['https://support.apple.com/zh-cn/111874','视频 20 小时 / 流媒体 12 小时'],
    '13mini':['https://support.apple.com/zh-cn/111873','视频 17 小时 / 流媒体 13 小时'],'13':['https://support.apple.com/zh-cn/111872','视频 19 小时 / 流媒体 15 小时'],'13pro':['https://support.apple.com/zh-cn/111871','视频 22 小时 / 流媒体 20 小时'],'13pm':['https://support.apple.com/zh-cn/111870','视频 28 小时 / 流媒体 25 小时'],
    se3:['https://support.apple.com/zh-cn/111866','视频 15 小时 / 流媒体 10 小时'],'14':['https://support.apple.com/zh-cn/111850','视频 20 小时 / 流媒体 16 小时'],'14plus':['https://support.apple.com/zh-cn/111854','视频 26 小时 / 流媒体 20 小时'],'14pro':['https://support.apple.com/zh-cn/111849','视频 23 小时 / 流媒体 20 小时'],'14pm':['https://support.apple.com/zh-cn/111846','视频 29 小时 / 流媒体 25 小时'],
    '15':['https://support.apple.com/zh-cn/111831','视频 20 小时 / 流媒体 16 小时'],'15plus':['https://support.apple.com/zh-cn/111830','视频 26 小时 / 流媒体 20 小时'],'15pro':['https://support.apple.com/zh-cn/111829','视频 23 小时 / 流媒体 20 小时'],'15pm':['https://support.apple.com/zh-cn/111828','视频 29 小时 / 流媒体 25 小时'],
    '16':['https://support.apple.com/zh-cn/121029','视频 22 小时 / 流媒体 18 小时'],'16plus':['https://support.apple.com/zh-cn/121030','视频 27 小时 / 流媒体 24 小时'],'16pro':['https://support.apple.com/zh-cn/121031','视频 27 小时 / 流媒体 22 小时'],'16pm':['https://support.apple.com/zh-cn/121032','视频 33 小时 / 流媒体 29 小时'],
    '16e':['https://support.apple.com/zh-cn/122208','视频 26 小时 / 流媒体 21 小时'],'17':['https://support.apple.com/zh-cn/125089','视频 30 小时 / 流媒体 27 小时'],air:['https://support.apple.com/zh-cn/125092','视频 27 小时 / 流媒体 22 小时'],'17pro':['https://support.apple.com/zh-cn/125090','视频 31 小时 / 流媒体 28 小时'],'17pm':['https://support.apple.com/zh-cn/125091','视频 37 小时 / 流媒体 33 小时'],'17e':['https://support.apple.com/zh-cn/126470','视频 26 小时 / 流媒体 21 小时']
  };
  Object.entries(iphoneOfficial).forEach(([id,[url,battery]])=>{const p=products.find(x=>x.id===id);if(p){p.official=url;p.specs.battery=battery}});
  products.filter(p=>p.category==='iphone').forEach(p=>{if(p.specs.refresh==='60Hz')p.specs.refresh='Apple 未标注 Hz';if(p.specs.refresh==='120Hz')p.specs.refresh='ProMotion 最高 120Hz'});
  products.find(p=>p.id==='17pro').specs.weight='204g';

  /* iPad 技术规格页公开额定 Wh；同时保留 Apple 的 10 小时 Wi‑Fi 使用口径。 */
  const ipadWh={ipadpro97:27.5,ipad5:32.4,ipadpro105:30.4,ipadpro129_2:41,ipad6:32.4,ipadpro11_1:29.37,ipadpro129_3:36.71,ipadair3:30.2,ipadmini5:19.1,ipad7:32.4,ipadpro11_2:28.65,ipadpro129_4:36.71,ipad8:32.4,ipadair4:28.6,ipadpro11_3:28.65,ipadpro129_5:40.88,ipad9:32.4,ipadmini6:19.3,ipadair5:28.6,ipad10:28.6,ipadpro11_4:28.65,ipadpro129_6:40.88,ipadair11_m2:28.93,ipadair13_m2:36.59,ipadpro11_m4:31.29,ipadpro13_m4:38.99,ipadmini_a17:19.3,ipad_a16:28.93,ipadair11_m3:28.93,ipadair13_m3:36.59,ipadpro11_m5:31.29,ipadpro13_m5:38.99,ipadair11_m4:28.93,ipadair13_m4:36.59};
  const ipadLinks={ipadpro97:'111965',ipad5:'111960',ipadpro105:'111927',ipadpro129_2:'111964',ipad6:'111957',ipadpro11_1:'111974',ipadpro129_3:'111979',ipadair3:'111939',ipadmini5:'111904',ipad7:'111911',ipadmini6:'111886',ipadmini_a17:'121456'};
  Object.entries(ipadWh).forEach(([id,wh])=>{const p=products.find(x=>x.id===id);if(p){p.specs.battery=`${wh}Wh；${IPAD_10H}`;if(p.year<=2022&&p.type==='Pro'&&p.specs.refresh.includes('120Hz'))p.specs.refresh='ProMotion'}});
  Object.entries(ipadLinks).forEach(([id,n])=>{const p=products.find(x=>x.id===id);if(p)p.official=`https://support.apple.com/zh-cn/${n}`});

  const baselines={iphone:'a14',ipad:'m1_ipad',mac:'m1_8_8'};
  const baselineLabels={iphone:'A14 Bionic',ipad:'M1（iPad）',mac:'M1（8 核 CPU / 8 核 GPU）'};
  const marketPolicy={
    snapshot:'2026-08-17',
    condition:'正常个人自用成色；无锁、无监管、无重大拆修；电池通常不低于约 85%',
    channels:{xy:'闲鱼个人挂牌 / 近期成交估值',zz:'转转官方验买家零售估值'},
    excludes:['平台回收价','故障机','监管机','扩容机','配件打包价']
  };
  return {products,benchmarks,baselines,baselineLabels,marketPolicy,snapshot:'2026-08-17'};
})();
