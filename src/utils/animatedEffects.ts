import { AnimationSettings, HeadAnchor } from '../types/photobooth';

const fraction = (value: number) => value - Math.floor(value);
const random = (seed: number) => fraction(Math.sin(seed * 127.1 + 311.7) * 43758.5453);
const bound = (value: number, min: number, max: number) => Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : 1;
const sparkle = (color: string, size: number) => `<path d="M0 ${-size}Q${size*.15} ${-size*.15} ${size} 0Q${size*.15} ${size*.15} 0 ${size}Q${-size*.15} ${size*.15} ${-size} 0Q${-size*.15} ${-size*.15} 0 ${-size}Z" fill="${color}"/>`;

/** Deterministic vector scene shared by the live overlay and PNG export. */
export function createAnimationArtwork(settings: AnimationSettings, width: number, height: number, timeSeconds = 2.4, heads?: HeadAnchor[]): string {
  if (settings.id === 'none' || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return '';
  const w = 1000;
  const h = height / width * w;
  const time = (Number.isFinite(timeSeconds) ? timeSeconds : 2.4) * bound(settings.speed, .5, 2);
  if (settings.id.startsWith('head-')) {
    const anchors = heads ?? [{x:.5,y:.31,width:.32,angle:0}];
    const ornaments = anchors.filter(head=>Number.isFinite(head.x+head.y+head.width+head.angle) && head.width>0).map(head=>{
      const scale = head.width*w/180 * (.8+bound(settings.intensity,.3,1.5)*.2) * (settings.id === 'head-bunny' ? .64 : 1);
      const y = Math.max((settings.id === 'head-bunny' ? 128 : 82)*scale,head.y*h);
      const bob = Math.sin(time*2)*3;
      let art = '';
      switch(settings.id){
        case 'head-crown':
          art=`<path d="M-86 0L-100-64-52-37 0-89 52-37 100-64 86 0Z" fill="#f7ca52" stroke="#fff0ad" stroke-width="4" stroke-linejoin="round"/><path d="M-85-5H85V11H-85Z" fill="#d99c2c" stroke="#fff0ad" stroke-width="3"/><path d="M0-65L12-44 0-23-12-44Z" fill="#e9799d"/><circle cx="-53" cy="-23" r="7" fill="#9ddbe5"/><circle cx="53" cy="-23" r="7" fill="#9ddbe5"/>${sparkle('#fff6ce',7)}`;
          break;
        case 'head-halo':
          art=`<ellipse cy="${-38+bob}" rx="87" ry="23" fill="none" stroke="#fff4b5" stroke-opacity=".18" stroke-width="23"/><ellipse cy="${-38+bob}" rx="87" ry="23" fill="none" stroke="#ffe692" stroke-width="8"/><ellipse cy="${-40+bob}" rx="87" ry="23" fill="none" stroke="#fffde5" stroke-width="2"/>${[-1,1].map(side=>`<g transform="translate(${side*105} ${-35+Math.sin(time*3+side)*10})">${sparkle('#fff4b5',8)}</g>`).join('')}`;
          break;
        case 'head-hearts':
          art=Array.from({length:5},(_,i)=>{const x=(i-2)*42;const y=-30-Math.sin((i+1)*Math.PI/6)*38+Math.sin(time*2+i)*5;const size=13+Math.sin(time*3+i)*2;return `<g transform="translate(${x} ${y})"><path d="M0 ${size}C${-size*2} ${-size*.4} ${-size} ${-size*1.5} 0 ${-size*.5}C${size} ${-size*1.5} ${size*2} ${-size*.4} 0 ${size}Z" fill="${i%2?'#fda4af':'#f472b6'}" stroke="#ffe4ef" stroke-width="2"/></g>`;}).join('');
          break;
        case 'head-butterflies':
          art=Array.from({length:4},(_,i)=>{const x=(i-1.5)*58;const y=-35-Math.sin((i+1)*Math.PI/5)*30+Math.sin(time*1.7+i)*6;const flap=.45+.55*Math.abs(Math.sin(time*5+i));return `<g transform="translate(${x} ${y}) rotate(${Math.sin(time+i)*12})"><g transform="scale(${flap} 1)"><path d="M0 0C-45-50-42 8-9 7C-34 33-4 39 0 0Z" fill="#c4b5fd" stroke="#f5eaff" stroke-width="1.5"/><path d="M0 0C45-50 42 8 9 7C34 33 4 39 0 0Z" fill="#f9a8d4" stroke="#f5eaff" stroke-width="1.5"/></g><path d="M0-9V17" stroke="#7c6692" stroke-width="3" stroke-linecap="round"/></g>`;}).join('');
          break;
        case 'head-cat':
          art=`<path d="M-101 16Q-111-37-81-82Q-41-66-27-14M27-14Q41-66 81-82Q111-37 101 16" fill="#ded7eb" stroke="#fff1ff" stroke-width="4" stroke-linejoin="round"/><path d="M-86-4Q-91-35-78-59L-48-22M48-22L78-59Q91-35 86-4" fill="#f4a8c5"/><path d="M-105 19Q0-13 105 19" fill="none" stroke="#ded7eb" stroke-width="8"/>`;
          break;
        case 'head-bunny':
          art=[-1,1].map(side=>`<g transform="translate(${side*53} 3) rotate(${side*10+Math.sin(time*2+side)*4})"><ellipse cy="-55" rx="23" ry="64" fill="#f5eefa" stroke="#fff" stroke-width="3"/><ellipse cy="-58" rx="11" ry="45" fill="#edb6ce"/></g>`).join('')+`<path d="M-97 14Q0-13 97 14" fill="none" stroke="#f5eefa" stroke-width="9"/>`;
          break;
      }
      return `<g transform="translate(${head.x*w} ${y}) rotate(${head.angle+Math.sin(time*1.5)*1.5}) scale(${scale})">${art}</g>`;
    }).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${w} ${h}" fill="none">${ornaments}</svg>`;
  }
  const count = Math.round((settings.id === 'snow' ? 46 : 24) * bound(settings.intensity, .3, 1.5));
  const pieces: string[] = [];
  for (let index = 0; index < count; index++) {
    const seed = index + 1;
    const phase = random(seed * 3);
    const progress = fraction(phase + time * (.055 + random(seed * 5) * .065));
    let x = random(seed * 7) * w + Math.sin(time * .65 + seed) * 28;
    let y = progress * (h + 100) - 50;
    const size = 9 + random(seed * 11) * 15;
    const rotation = random(seed * 13) * 360 + time * (seed % 2 ? 14 : -14);
    let shape = '';
    let opacity = .55 + random(seed * 17) * .4;
    switch (settings.id) {
      case 'hearts':
        y = h - y;
        shape = `<path d="M0 ${size*.8}C${-size*2} ${-size*.5} ${-size*.9} ${-size*1.6} 0 ${-size*.5}C${size*.9} ${-size*1.6} ${size*2} ${-size*.5} 0 ${size*.8}Z" fill="${seed%2 ? '#fb7185' : '#fbcfe8'}" stroke="#fff2f5" stroke-width="1.4"/>`;
        break;
      case 'sparkles':
        opacity = .35 + .65 * ((Math.sin(time * 2 + phase * 10) + 1) / 2);
        y = random(seed * 19) * h;
        shape = `<circle r="${size*1.8}" fill="#f6cf72" opacity=".1"/>${sparkle(seed%2 ? '#fff6cf' : '#f6cf72',size)}`;
        break;
      case 'confetti':
        shape = `<rect x="${-size/2}" y="${-size/4}" width="${size}" height="${size*.5}" rx="2" fill="${['#fb7185','#fde68a','#93c5fd','#c4b5fd','#6ee7b7'][index%5]}"/>`;
        break;
      case 'bubbles':
        y = h - y;
        shape = `<circle r="${size*1.5}" fill="#b8e9ff" fill-opacity=".08" stroke="${index%2 ? '#e8d5ff' : '#c8f3ff'}" stroke-width="2"/><path d="M${-size} 0a${size} ${size} 0 0 1 ${size} ${-size}" fill="none" stroke="#ffffff" stroke-opacity=".85" stroke-width="3" stroke-linecap="round"/>`;
        break;
      case 'petals':
        x += Math.sin(time + phase * 10) * 45;
        shape = `<path d="M0 ${size}C${-size*1.5} 0 ${-size} ${-size*1.2} 0 ${-size*.55}C${size} ${-size*1.2} ${size*1.5} 0 0 ${size}Z" fill="${index%2 ? '#fbcfe8' : '#f9a8d4'}" stroke="#fff1f5" stroke-width="1"/>`;
        break;
      case 'snow':
        shape = `<circle r="${size*.28}" fill="#ffffff"/><circle r="${size*.65}" fill="#ffffff" opacity=".1"/>`;
        break;
      case 'shooting-stars':
        x = fraction(phase + time * .12) * (w + 240) - 120;
        y = fraction(random(seed * 19) + time * .12) * (h + 160) - 80;
        shape = `<path d="M-85-55L0 0" stroke="#fff2c1" stroke-width="3" stroke-opacity=".45" stroke-linecap="round"/>${sparkle('#fff4c6',size*.7)}`;
        break;
      case 'neon-orbit': {
        const angle = phase * Math.PI * 2 + time * .55;
        const rx = w * (.33 + random(seed*23)*.12);
        const ry = h * (.3 + random(seed*29)*.14);
        x = w/2 + Math.cos(angle)*rx;
        y = h/2 + Math.sin(angle)*ry;
        const color = ['#f0abfc','#67e8f9','#c4b5fd'][index%3];
        shape = `<circle r="${size}" fill="${color}" opacity=".12"/><circle r="${size*.35}" fill="${color}"/><path d="M${-size*2}-5Q${-size} 0 0 0" stroke="${color}" stroke-opacity=".5" stroke-width="2" fill="none"/>`;
        break;
      }
    }
    pieces.push(`<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rotation.toFixed(2)})" opacity="${opacity.toFixed(3)}">${shape}</g>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${w} ${h}" fill="none">${pieces.join('')}</svg>`;
}
