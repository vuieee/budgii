const Charts = {
  instances: {},

  palette(){
    return {
      fg: '#f5f5f0',
      dim: '#8f8f8a',
      faint: '#5a5a56',
      line: '#2a2a2a',
      accent: '#e0402a',
      shades: ['#f5f5f0','#c9c9c3','#9d9d97','#71716c','#454540','#e0402a']
    };
  },

  baseOptions(overrides={}){
    const p = this.palette();
    return Object.assign({
      responsive:true,
      maintainAspectRatio:false,
      animation:{ duration:600, easing:'easeOutQuart' },
      plugins:{
        legend:{ labels:{ color:p.dim, font:{family:'ui-monospace, monospace', size:10.5}, boxWidth:10, padding:14 } },
        tooltip:{ backgroundColor:'#131313', borderColor:p.line, borderWidth:1, titleColor:p.fg, bodyColor:p.dim, titleFont:{family:'ui-monospace, monospace'}, bodyFont:{family:'ui-monospace, monospace'} }
      },
      scales:{}
    }, overrides);
  },

  axisDefaults(){
    const p = this.palette();
    return {
      grid:{ color:p.line, drawTicks:false },
      ticks:{ color:p.faint, font:{family:'ui-monospace, monospace', size:10} },
      border:{ color:p.line }
    };
  },

  destroy(id){
    if(this.instances[id]){ this.instances[id].destroy(); delete this.instances[id]; }
  },

  makeCanvas(container){
    container.innerHTML = '<div class="chart-wrap"><canvas></canvas></div>';
    return container.querySelector('canvas');
  },

  pie(container, id, labels, data){
    const canvas = this.makeCanvas(container);
    this.destroy(id);
    const p = this.palette();
    this.instances[id] = new Chart(canvas, {
      type:'doughnut',
      data:{ labels, datasets:[{ data, backgroundColor:p.shades, borderColor:'#0a0a0a', borderWidth:2 }] },
      options: this.baseOptions({ cutout:'62%' })
    });
  },

  bar(container, id, labels, data, opts={}){
    const canvas = this.makeCanvas(container);
    this.destroy(id);
    const p = this.palette();
    this.instances[id] = new Chart(canvas, {
      type:'bar',
      data:{ labels, datasets:[{ label:opts.label||'', data, backgroundColor:p.fg, borderRadius:4, maxBarThickness:34 }] },
      options: this.baseOptions({
        plugins:{ legend:{ display: !!opts.label, labels:this.baseOptions().plugins.legend.labels }, tooltip: this.baseOptions().plugins.tooltip },
        scales:{ x:this.axisDefaults(), y: Object.assign(this.axisDefaults(), {beginAtZero:true}) }
      })
    });
  },

  line(container, id, labels, datasets, opts={}){
    const canvas = this.makeCanvas(container);
    this.destroy(id);
    const p = this.palette();
    this.instances[id] = new Chart(canvas, {
      type:'line',
      data:{ labels, datasets: datasets.map((d,i)=>({
        label:d.label, data:d.data, borderColor: i===0?p.fg:p.accent, backgroundColor: opts.area ? (i===0? 'rgba(245,245,240,.12)':'rgba(224,64,42,.12)') : 'transparent',
        fill: !!opts.area, tension:.35, pointRadius:2, pointBackgroundColor: i===0?p.fg:p.accent, borderWidth:2
      })) },
      options: this.baseOptions({ scales:{ x:this.axisDefaults(), y:Object.assign(this.axisDefaults(),{beginAtZero:true}) } })
    });
  },

  groupedBar(container, id, labels, datasets){
    const canvas = this.makeCanvas(container);
    this.destroy(id);
    const p = this.palette();
    this.instances[id] = new Chart(canvas, {
      type:'bar',
      data:{ labels, datasets: datasets.map((d,i)=>({ label:d.label, data:d.data, backgroundColor: i===0?p.fg:p.accent, borderRadius:4, maxBarThickness:26 })) },
      options: this.baseOptions({ scales:{ x:this.axisDefaults(), y:Object.assign(this.axisDefaults(),{beginAtZero:true}) } })
    });
  }
};