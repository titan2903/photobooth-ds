import React, { useEffect, useRef, useState } from 'react';
import { Clapperboard, Download } from 'lucide-react';
import type { RenderStripOptions } from '../utils/canvasRenderer';
import type { GifMode } from '../utils/gifExport';

export const GifExportPanel:React.FC<{options:RenderStripOptions;disabled?:boolean}>=({options,disabled})=>{
  const [mode,setMode]=useState<GifMode>('poses');
  const [speed,setSpeed]=useState(1);
  const [busy,setBusy]=useState(false);
  const [progress,setProgress]=useState(0);
  const [error,setError]=useState<string|null>(null);
  const [url,setUrl]=useState<string|null>(null);
  const controllerRef=useRef<AbortController|null>(null);
  useEffect(()=>{
    setUrl(null);setError(null);setProgress(0);setBusy(false);
    return()=>{controllerRef.current?.abort();controllerRef.current=null;};
  },[options,mode,speed]);
  useEffect(()=>()=>{if(url)URL.revokeObjectURL(url);},[url]);
  const generate=async()=>{
    if(busy||disabled)return;
    const controller=new AbortController();
    controllerRef.current=controller;
    setBusy(true);setError(null);setUrl(null);setProgress(0);
    try{
      const {exportPhotoGif}=await import('../utils/gifExport');
      const blob=await exportPhotoGif(options,{mode,speed,signal:controller.signal,onProgress:value=>{if(!controller.signal.aborted)setProgress(value);}});
      if(!controller.signal.aborted && controllerRef.current===controller)setUrl(URL.createObjectURL(blob));
    }catch(err){
      if(!controller.signal.aborted)setError(err instanceof Error ? err.message : 'GIF gagal dibuat. Silakan coba lagi.');
    }finally{if(controllerRef.current===controller){setBusy(false);controllerRef.current=null;}}
  };
  return <section className="gif-export-panel" aria-label="Ekspor GIF animasi">
    <h3><Clapperboard size={16}/> GIF Animasi</h3>
    <p>Gabungkan pose atau gerakkan efek pada strip. Frame dan filter tiap foto tetap digunakan.</p>
    <div className="gif-export-options">
      <label>Mode GIF<select value={mode} disabled={busy} onChange={event=>setMode(event.target.value as GifMode)}><option value="poses">Pose bergantian</option><option value="effects">Efek bergerak</option></select></label>
      <label>Kecepatan<select value={speed} disabled={busy} onChange={event=>setSpeed(Number(event.target.value))}><option value={0.5}>Lambat · 0.5×</option><option value={1}>Normal · 1×</option><option value={2}>Cepat · 2×</option></select></label>
    </div>
    <p className="gif-export-note">{mode==='poses' ? 'Foto bergantian posisi mengikuti urutan pose yang dipilih.' : 'Susunan foto tetap; efek animasi bergerak selama 2,4 detik pada kecepatan normal.'} GIF berulang otomatis, sisi terpanjang maksimal 800 px.</p>
    <div className="gif-export-actions">
      <button type="button" onClick={generate} disabled={busy||disabled} className="gif-generate"><Clapperboard size={15}/>{busy ? `Membuat GIF… ${progress}%` : 'Buat GIF'}</button>
      {busy && <button type="button" onClick={()=>controllerRef.current?.abort()} className="gif-cancel">Batalkan</button>}
      {url && <a href={url} download="photobooth-animated.gif"><Download size={15}/> Unduh GIF</a>}
    </div>
    {busy && <progress aria-label="Progres pembuatan GIF" max={100} value={progress}/>}
    {error && <p role="alert" className="gif-export-error">{error}</p>}
    {url && <div className="gif-export-preview"><img src={url} alt="Preview GIF photobooth animasi"/><span>GIF siap diunduh</span></div>}
  </section>;
};
