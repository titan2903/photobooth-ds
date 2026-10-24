import { AnimationId } from '../types/photobooth';

const star = (x:number,y:number,size:number,color:string) => `<g transform="translate(${x} ${y}) scale(${size/10})"><path d="M0-10L3-3 10-3 5 2 6 9 0 5-6 9-5 2-10-3-3-3Z" fill="${color}" stroke="#fff6dd" stroke-width="1"/></g>`;

/** Original face accessories in local face coordinates, shared by preview and export. */
export function createFaceAccessoryArtwork(id:AnimationId,time:number):string {
  switch(id){
    case 'head-glasses':
      return `<g stroke="#ba965d" stroke-width="5"><circle cx="-47" r="35" fill="#fff8df" fill-opacity=".07"/><circle cx="47" r="35" fill="#fff8df" fill-opacity=".07"/><path d="M-12-3Q0-14 12-3M-82-5L-99-12M82-5L99-12" fill="none"/></g><path d="M-68-17L-55-25M25-17L38-25" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/>`;
    case 'head-sunglasses':
      return `<path d="M-99-24Q-55-39-12-23L12-23Q55-39 99-24L88 17Q48 41 17 16L9-8H-9L-17 16Q-48 41-88 17Z" fill="#182436" stroke="#566982" stroke-width="4"/><path d="M-82-17L-37 8M35-17L72 3" stroke="#8fcbea" stroke-opacity=".5" stroke-width="8"/><path d="M-99-20L-111-27M99-20L111-27" stroke="#182436" stroke-width="6"/>`;
    case 'head-heart-glasses':
      return [-1,1].map(side=>`<g transform="translate(${side*48} 0)"><path d="M0 35C-81-12-27-61 0-23C27-61 81-12 0 35Z" fill="#f472b6" fill-opacity=".23" stroke="#ec4899" stroke-width="6"/><path d="M-27-17Q-19-28-13-17" fill="none" stroke="#fff1f7" stroke-width="3" stroke-linecap="round"/></g>`).join('')+`<path d="M-10-4Q0-14 10-4M-94-13L-107-18M94-13L107-18" stroke="#ec4899" stroke-width="5" fill="none"/>`;
    case 'head-blush':
      return [-1,1].map(side=>`<g transform="translate(${side*64} 8)"><ellipse rx="31" ry="18" fill="#fb7185" opacity=".12"/><ellipse rx="25" ry="14" fill="#fb7185" opacity=".18"/><ellipse rx="18" ry="10" fill="#f4729f" opacity=".2"/></g>`).join('');
    case 'head-freckles':
      return [-1,1].map(side=>Array.from({length:10},(_,i)=>`<circle cx="${side*(29+(i%5)*12)}" cy="${(i<5 ? -6:7)+(i%3)*3}" r="${1.4+(i%3)*.5}" fill="#9e6b47" opacity="${.4+(i%3)*.13}"/>`).join('')).join('')+`<circle cx="-11" cy="-8" r="1.5" fill="#9e6b47"/><circle cx="8" cy="-5" r="1.8" fill="#9e6b47"/>`;
    case 'head-clown':
      return `<g transform="scale(${1+Math.sin(time*2)*.035})"><circle r="26" fill="#c6283b"/><circle cy="-3" r="23" fill="#f14456"/><ellipse cx="-7" cy="-11" rx="8" ry="5" fill="#ffd2d9" opacity=".85"/><path d="M6 17Q16 12 18 4" stroke="#ab1e32" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
    case 'head-cat-whiskers':
      return `<path d="M-15-3Q0-13 15-3Q16 2 0 13Q-16 2-15-3Z" fill="#e394aa" stroke="#fff0f4" stroke-width="1.5"/><path d="M0 13V26M-16 27Q-8 37 0 26Q8 37 16 27" fill="none" stroke="#73545a" stroke-width="2.5" stroke-linecap="round"/><path d="M-38 10L-95-2M-40 23L-103 23M-38 36L-94 49M38 10L95-2M40 23L103 23M38 36L94 49" fill="none" stroke="#73545a" stroke-width="2.5" stroke-linecap="round"/>`;
    case 'head-pirate':
      return `<path d="M-112-28L104 20M-111 18L81-36" stroke="#342d34" stroke-width="5"/><path d="M-78-30Q-48-39-14-27L-18 10Q-49 43-77 12Z" fill="#272630" stroke="#67606e" stroke-width="3"/><g transform="translate(-47-1)"><circle cy="-4" r="11" fill="#e5e1d6"/><rect x="-6" y="2" width="12" height="10" rx="2" fill="#e5e1d6"/><circle cx="-4" cy="-4" r="2.5" fill="#272630"/><circle cx="4" cy="-4" r="2.5" fill="#272630"/><path d="M-12 15L12 24M12 15L-12 24" stroke="#e5e1d6" stroke-width="3"/></g>`;
    case 'head-cyber-visor':
      return `<path d="M-103-27Q0-42 103-27L94 22Q0 39-94 22Z" fill="#173f62" fill-opacity=".55" stroke="#67e8f9" stroke-width="3"/><path d="M-91-19Q0-32 91-19M-88 15Q0 30 88 15" stroke="#e9d5ff" stroke-width="1.5" fill="none"/><path d="M-110-13V12M110-13V12" stroke="#a78bfa" stroke-width="8"/>${[-1,0,1].map(i=>`<path d="M${-79+((time*25+i*35)%145)}-19l-12 38" stroke="#a5f3fc" stroke-opacity=".5" stroke-width="4"/>`).join('')}`;
    case 'head-star-cheeks':
      return [-1,1].map(side=>star(side*64,9,17+Math.sin(time*2+side)*1.5,'#f9d76f')+star(side*88,-7,8,'#f9a8d4')).join('');
    case 'head-mustache-pencil':
      return `<path d="M-61 7Q-35-15-5-5L0-2 5-5Q35-15 61 7Q37 0 8 5L0 3-8 5Q-37 0-61 7Z" fill="#493127"/><path d="M-57 5Q-36-6-19-4M19-4Q36-6 57 5" stroke="#81604b" stroke-width="1.5" fill="none"/>`;
    case 'head-goatee':
      return `<path d="M-17 15Q0 26 17 15L10 39Q0 48-10 39Z" fill="#493127"/><path d="M-38 45Q0 69 38 45Q34 82 0 99Q-34 82-38 45Z" fill="#493127" stroke="#72503a" stroke-width="2"/><path d="M-17 60Q-9 78 0 88M17 60Q9 78 0 88" stroke="#8c6549" stroke-width="2" fill="none"/>`;
    default: return '';
  }
}
