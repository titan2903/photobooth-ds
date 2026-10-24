import { FrameTheme, LayoutConfig } from '../types/photobooth';

export interface PhotoWindow { x: number; y: number; width: number; height: number; radius: number }

export function getFrameGeometry(layout: LayoutConfig, theme: FrameTheme) {
  const unit = Math.min(layout.canvasWidth, layout.canvasHeight) / 624;
  const decorated = Boolean(theme.design);
  const margin = decorated ? 42 * unit : layout.borderWidth;
  const top = decorated ? 104 * unit : layout.borderWidth;
  const bottom = decorated ? 156 * unit : layout.borderWidth + layout.bottomPadding;
  const gap = decorated ? 26 * unit : layout.spacing;
  const rows = Math.ceil(layout.photoCount / layout.gridColumns);
  const width = (layout.canvasWidth - margin * 2 - gap * (layout.gridColumns - 1)) / layout.gridColumns;
  const height = (layout.canvasHeight - top - bottom - gap * (rows - 1)) / rows;
  const windows: PhotoWindow[] = Array.from({ length: layout.photoCount }, (_, index) => ({
    x: margin + (index % layout.gridColumns) * (width + gap),
    y: top + Math.floor(index / layout.gridColumns) * (height + gap),
    width, height,
    radius: decorated && theme.design !== 'editorial' ? 12 * unit : 0,
  }));
  return { unit, windows };
}

export function svgDataUrl(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const star = (x: number, y: number, size: number, color: string) =>
  `<path d="M${x} ${y-size} Q${x+size*.16} ${y-size*.16} ${x+size} ${y} Q${x+size*.16} ${y+size*.16} ${x} ${y+size} Q${x-size*.16} ${y+size*.16} ${x-size} ${y} Q${x-size*.16} ${y-size*.16} ${x} ${y-size}Z" fill="${color}"/>`;
const flower = (x: number, y: number, size: number) =>
  `<g transform="translate(${x} ${y})">${Array.from({length: 7}, (_, i) => `<ellipse cx="0" cy="${-size*.65}" rx="${size*.32}" ry="${size*.62}" fill="#fffdf3" stroke="#81936a" stroke-width=".8" transform="rotate(${i*360/7})"/>`).join('')}<circle r="${size*.32}" fill="#e6bb56"/></g>`;
const bow = (x: number, y: number, scale: number) => `<g transform="translate(${x} ${y}) scale(${scale})" fill="#e6a4b6" stroke="#a84969" stroke-width="2.5" stroke-linejoin="round"><path d="M0 0 C-90-70-86 45-5 8 C-25 37-42 62-32 83 L-13 70 0 84 16 25 0 0Z"/><path d="M0 0 C90-70 86 45 5 8 C25 37 42 62 32 83 L13 70 0 84-16 25 0 0Z"/><ellipse rx="10" ry="13" fill="#bc597b"/></g>`;

/** Original vector artwork. All dimensions adapt to the selected photo layout. */
export function createFrameArtwork(layout: LayoutConfig, theme: FrameTheme, layer: 'background' | 'overlay') {
  const { unit, windows } = getFrameGeometry(layout, theme);
  const w = layout.canvasWidth / unit;
  const h = layout.canvasHeight / unit;
  const accent = theme.accentColor || theme.textColor;
  const svg = (body: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="${layout.canvasWidth}" height="${layout.canvasHeight}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
  if (!theme.design) return svg('');
  const title = `<text x="${w/2}" y="58" text-anchor="middle" fill="${theme.textColor}" font-family="${theme.design === 'editorial' || theme.design === 'ribbon' || theme.design === 'botanical' ? 'Georgia,serif' : 'Arial,sans-serif'}" font-size="${theme.design === 'editorial' ? 37 : 28}" font-weight="${theme.design === 'chrome' || theme.design === 'checker' ? 900 : 400}" font-style="${['ribbon','botanical','scrapbook'].includes(theme.design) ? 'italic' : 'normal'}" letter-spacing="${theme.design === 'editorial' ? 5 : 1}">${theme.headline}</text>`;
  const footer = `<text x="${w/2}" y="${h-112}" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" letter-spacing="3" fill="${theme.textColor}">${({ribbon: 'A LITTLE LOVE, FOREVER', chrome: 'STAY IN YOUR ORBIT', botanical: 'GROWING MEMORIES TOGETHER', editorial: 'THE EVERYDAY ISSUE / VOL. 01', scrapbook: 'COLLECT MOMENTS, KEEP THEM CLOSE', checker: 'MEMBERS ONLY / EVERYONE WELCOME', postcard: 'FROM ME TO YOU / KEEP THIS MOMENT', celestial: 'SOME MOMENTS ARE WRITTEN IN THE STARS', cinema: 'ONE TAKE / A LIFETIME OF MEMORIES', ocean: 'SALTY AIR, HAPPY HEARTS', confetti: 'EVERY LITTLE WIN DESERVES A PARTY', gallery: 'A STUDY IN EVERYDAY HAPPINESS'})[theme.design]}</text>`;
  if (layer === 'background') {
    let pattern = '';
    switch (theme.design) {
      case 'ribbon':
        pattern = `<defs><pattern id="lace" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="1.5" fill="#dca2b3"/></pattern></defs><rect width="100%" height="100%" fill="url(#lace)"/><rect x="13" y="13" width="${w-26}" height="${h-26}" rx="18" fill="none" stroke="#dca2b3" stroke-width="2" stroke-dasharray="3 6"/><path d="M50 78 Q${w/2} 96 ${w-50} 78" fill="none" stroke="#dca2b3"/>`;
        break;
      case 'chrome':
        pattern = `<defs><linearGradient id="metal" x2="1" y2="1"><stop stop-color="#a2a7c7"/><stop offset=".32" stop-color="#f9edff"/><stop offset=".5" stop-color="#665a8d"/><stop offset=".7" stop-color="#e7f8ff"/><stop offset="1" stop-color="#9187af"/></linearGradient><pattern id="digital" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#8a83a0" stroke-opacity=".18"/></pattern></defs><rect width="100%" height="100%" fill="url(#digital)"/><rect x="13" y="13" width="${w-26}" height="${h-26}" rx="34" fill="none" stroke="url(#metal)" stroke-width="8"/><ellipse cx="${w/2}" cy="${h-112}" rx="${Math.min(w*.37,220)}" ry="29" fill="none" stroke="url(#metal)" stroke-width="3" transform="rotate(-8 ${w/2} ${h-112})"/>${star(w-44,61,22,'url(#metal)')}${star(39,h*.48,20,'url(#metal)')}`;
        break;
      case 'botanical':
        pattern = `<defs><pattern id="garden" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M11 0V22" stroke="#81936a" stroke-opacity=".15" stroke-width="7"/></pattern></defs><rect width="100%" height="100%" fill="url(#garden)"/><rect x="17" y="17" width="${w-34}" height="${h-34}" fill="none" stroke="#81936a"/><path d="M25 ${h-130} Q70 ${h-170} 27 ${h-215} M${w-25} 105 Q${w-70} 140 ${w-27} 198" fill="none" stroke="#81936a" stroke-width="3"/>${flower(32,h-170,20)}${flower(w-30,148,18)}`;
        break;
      case 'editorial':
        pattern = `<path d="M24 79H${w-24} M24 ${h-91}H${w-24}" stroke="${theme.textColor}" stroke-width="2"/><text x="26" y="25" fill="${accent}" font-family="Arial" font-size="10" letter-spacing="3">PHOTO JOURNAL</text><text x="${w-26}" y="25" text-anchor="end" fill="${accent}" font-family="Arial" font-size="10">NO. 001</text><rect x="20" y="${h-74}" width="6" height="46" fill="${accent}"/><text x="${w-24}" y="${h-23}" fill="${accent}" font-family="Georgia" font-size="17" text-anchor="end">©</text>`;
        break;
      case 'scrapbook':
        pattern = `<defs><pattern id="notes" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M0 25H25M25 0V25" stroke="#d6bd8e" stroke-opacity=".4" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#notes)"/><path d="M15 15H${w-15}V${h-15}H15Z" fill="none" stroke="#d2b485" stroke-dasharray="5 5"/>${star(w-43,54,20,'#ed9277')}<path d="M35 ${h-112}q10-25 20 0t20 0t20 0" fill="none" stroke="#ed9277" stroke-width="3"/>`;
        break;
      case 'checker':
        pattern = `<defs><pattern id="checks" width="32" height="32" patternUnits="userSpaceOnUse"><rect width="32" height="32" fill="#eaf0ff"/><path d="M0 0H16V16H0ZM16 16H32V32H16Z" fill="#4168d1"/></pattern></defs><rect width="22" height="${h}" fill="url(#checks)"/><rect x="${w-22}" width="22" height="${h}" fill="url(#checks)"/><rect height="15" width="${w}" fill="url(#checks)"/><rect y="${h-15}" height="15" width="${w}" fill="url(#checks)"/>${star(49,55,15,'#4168d1')}`;
        break;
      case 'postcard':
        pattern = `<defs><pattern id="airmail" width="52" height="52" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="52" height="52" fill="#f7efe2"/><rect width="14" height="52" fill="#b55347"/><rect x="27" width="14" height="52" fill="#547e96"/></pattern></defs><rect width="100%" height="100%" fill="url(#airmail)"/><rect x="13" y="13" width="${w-26}" height="${h-26}" fill="${theme.bgValue}"/><path d="M32 80H${w-32}" stroke="#c2b59d" stroke-dasharray="3 5"/><g transform="translate(${w-86} ${h-135}) rotate(12)"><rect width="49" height="37" fill="none" stroke="#b55347" stroke-dasharray="3 2"/><text x="24" y="24" text-anchor="middle" fill="#b55347" font-family="Georgia" font-size="15">POST</text></g>`;
        break;
      case 'celestial':
        pattern = `<defs><pattern id="sky" width="99" height="117" patternUnits="userSpaceOnUse"><circle cx="15" cy="23" r="1.4" fill="#f5dfab"/><circle cx="70" cy="78" r="1" fill="#f5dfab"/>${star(88,33,4,'#d9b56c')}</pattern></defs><rect width="100%" height="100%" fill="url(#sky)"/><rect x="15" y="15" width="${w-30}" height="${h-30}" rx="${w/2}" fill="none" stroke="#d9b56c" stroke-opacity=".5"/><path d="M47 27a22 22 0 1 0 18 33A23 23 0 0 1 47 27" fill="#f5dfab"/><path d="M25 ${h*.4}l12 36-13 48 12 41" fill="none" stroke="#d9b56c" stroke-width="1"/>${[0,1,2,3].map((i)=>star(i%2 ? 37:24,h*.4+i*41,4,'#d9b56c')).join('')}`;
        break;
      case 'cinema':
        pattern = `<path d="M32 12V${h-12}M${w-32} 12V${h-12}" stroke="#df994f" stroke-opacity=".6"/><defs><pattern id="sprocket" width="22" height="42" patternUnits="userSpaceOnUse"><rect x="6" y="8" width="12" height="21" rx="3" fill="#f5d9a5"/></pattern></defs><rect x="3" width="22" height="${h}" fill="url(#sprocket)"/><rect x="${w-25}" width="22" height="${h}" fill="url(#sprocket)"/><path d="M48 77H${w-48}" stroke="#df994f"/><text x="${w/2}" y="91" text-anchor="middle" fill="#df994f" font-family="monospace" font-size="9" letter-spacing="3">35 MM / THE DIRECTOR'S CUT</text>`;
        break;
      case 'ocean':
        pattern = `<defs><pattern id="waves" width="60" height="30" patternUnits="userSpaceOnUse"><path d="M0 15q15-15 30 0t30 0" fill="none" stroke="#55a4b4" stroke-opacity=".2"/></pattern></defs><rect width="100%" height="100%" fill="url(#waves)"/><path d="M12 ${h-90}q${w/4} -35 ${w/2} 0t${w/2} 0v90H12Z" fill="#55a4b4" opacity=".13"/>${[0,1,2,3].map(i=>`<circle cx="${w-25}" cy="${125+i*19}" r="${i%2 ? 4:7}" fill="none" stroke="#55a4b4"/>`).join('')}`;
        break;
      case 'confetti':
        pattern = Array.from({length: Math.ceil(h/85)},(_,i)=>`<g transform="translate(0 ${i*85})"><path d="M15 15l12 8M${w-28} 58l14-6" stroke="${['#dd728c','#659e92','#d9ae48'][i%3]}" stroke-width="5"/><circle cx="${w-20}" cy="16" r="4" fill="#d9ae48"/><path d="M17 57q17-16 12 9t-12 9" fill="none" stroke="#9c83bb" stroke-width="2"/></g>`).join('')+`<path d="M35 77Q${w/2} 113 ${w-35} 77" fill="none" stroke="#dd728c" stroke-width="2"/>${star(48,h-125,14,'#d9ae48')}${star(w-49,h-125,14,'#dd728c')}`;
        break;
      case 'gallery':
        pattern = `<path d="M22 65V22h65M${w-87} 22h65v43M22 ${h-65}v43h65M${w-87} ${h-22}h65v-43" fill="none" stroke="#a45c36" stroke-width="3"/><circle cx="${w/2}" cy="${h-111}" r="23" fill="none" stroke="#a45c36" stroke-width="1"/><text x="${w/2}" y="83" text-anchor="middle" fill="#a45c36" font-family="monospace" font-size="9" letter-spacing="4">THE PERSONAL COLLECTION</text>`;
        break;
    }
    return svg(pattern + title + footer);
  }
  // Small edge accents overlap the paper, leaving the center of each photo clear.
  let details = '';
  for (let index = 0; index < windows.length; index++) {
    const photo = windows[index];
    const x = photo.x / unit;
    const y = photo.y / unit;
    const width = photo.width / unit;
    const height = photo.height / unit;
    if (theme.design === 'ribbon' && index % layout.gridColumns === 0) details += bow(x+8,y+5,.42);
    if (theme.design === 'chrome') details += star(x+width-2,y+height-1,18,'#e3ddff');
    if (theme.design === 'botanical' && index % 2 === 0) details += flower(x+width,y+height,18);
    if (theme.design === 'editorial') details += `<rect x="${x+6}" y="${y+6}" width="25" height="20" fill="${theme.bgValue}"/><text x="${x+18}" y="${y+20}" fill="${accent}" font-family="Arial" font-size="11" text-anchor="middle">0${index+1}</text>`;
    if (theme.design === 'scrapbook') details += `<path d="M${x+width*.3} ${y-10}l${width*.4} -3 3 24-${width*.4} 3Z" fill="${index%2 ? '#a0b4dc' : '#ed9277'}" opacity=".85"/>${index===0 ? star(x+width,y+height,20,'#dfad43') : ''}`;
    if (theme.design === 'postcard' && index === 0) details += `<path d="M${x-5} ${y+20}q18-30 38-13t36-6" fill="none" stroke="#b55347" stroke-width="2"/>`;
    if (theme.design === 'celestial') details += star(x+width,y+height,16,'#f5dfab');
    if (theme.design === 'cinema') details += `<rect x="${x+4}" y="${y+height-23}" width="70" height="19" fill="#211e1c"/><text x="${x+10}" y="${y+height-9}" fill="#f5d9a5" font-family="monospace" font-size="10">TAKE 0${index+1}</text>`;
    if (theme.design === 'ocean' && index % 2 === 0) details += `<g transform="translate(${x+width-2} ${y+height-2}) rotate(-20)"><path d="M0 17Q-38-16-24-26Q-11-34 0-22Q12-35 24-26Q39-16 0 17Z" fill="#f7dfc8" stroke="#c99578" stroke-width="2"/><path d="M0 17L0-22M0 17L-16-23M0 17L16-23" stroke="#c99578" fill="none"/></g>`;
    if (theme.design === 'confetti') details += `<g transform="translate(${x+width-4} ${y+4})"><circle r="17" fill="#dd728c"/><path d="M-8-1l5 6 11-12" stroke="#fff1dc" stroke-width="3" fill="none"/></g>`;
    if (theme.design === 'gallery') details += `<path d="M${x-5} ${y+18}v-23h23M${x+width-18} ${y+height+5}h23v-23" stroke="#a45c36" stroke-width="3" fill="none"/>`;
    if (theme.design === 'checker' && index === windows.length-1) details += `<g transform="translate(${x+width-3} ${y+height-3}) rotate(12)"><circle r="24" fill="#f4d774" stroke="#2346a0" stroke-width="2"/><circle cx="-7" cy="-5" r="2.5" fill="#2346a0"/><circle cx="7" cy="-5" r="2.5" fill="#2346a0"/><path d="M-11 5Q0 20 11 5" fill="none" stroke="#2346a0" stroke-width="2.5"/></g>`;
  }
  return svg(details);
}

export function createFrameThumbnail(layout: LayoutConfig, theme: FrameTheme) {
  const { windows } = getFrameGeometry(layout, theme);
  // Nest the artwork SVGs to retain their normalized coordinate systems.
  const photos = windows.map((photo, index) => `<svg x="${photo.x}" y="${photo.y}" width="${photo.width}" height="${photo.height}" viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice"><rect width="200" height="150" fill="${['#c6b6b3','#b2bfc0','#c5bca5'][index%3]}"/><circle cx="156" cy="29" r="23" fill="#ffffff30"/><path d="M0 150Q12 93 100 106T220 89V150Z" fill="#ffffff25"/><path d="M45 155Q42 81 100 87Q155 81 160 155" fill="${index%2 ? '#6d6679' : '#ece3d7'}"/><path d="M66 74Q57 10 101 13Q145 9 136 89H64Z" fill="#443b40"/><ellipse cx="100" cy="59" rx="29" ry="36" fill="#e9bb9f"/><path d="M70 48Q66 10 100 13Q133 10 132 47Q102 39 95 27Q87 43 70 48" fill="#443b40"/><circle cx="90" cy="59" r="2" fill="#443b40"/><circle cx="111" cy="59" r="2" fill="#443b40"/><path d="M93 76Q101 82 110 75" fill="none" stroke="#ac6863" stroke-width="2"/></svg>`).join('');
  const footerY = theme.design ? layout.canvasHeight - 53 * (Math.min(layout.canvasWidth, layout.canvasHeight)/624) : layout.canvasHeight - layout.bottomPadding/2;
  return svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="${layout.canvasWidth}" height="${layout.canvasHeight}" viewBox="0 0 ${layout.canvasWidth} ${layout.canvasHeight}"><rect width="100%" height="100%" fill="${theme.bgValue}"/>${createFrameArtwork(layout,theme,'background')}<defs><clipPath id="photos">${windows.map(p => `<rect x="${p.x}" y="${p.y}" width="${p.width}" height="${p.height}" rx="${p.radius}"/>`).join('')}</clipPath></defs><g clip-path="url(#photos)">${photos}</g>${createFrameArtwork(layout,theme,'overlay')}<text x="${layout.canvasWidth/2}" y="${footerY}" text-anchor="middle" font-family="Arial" font-size="${Math.min(layout.canvasWidth,layout.canvasHeight)*.024}" fill="${theme.textColor}" letter-spacing="2">YOUR MEMORIES</text></svg>`);
}
