import { GIFEncoder, quantize, applyPalette } from 'gifenc';

/** Encode full opaque frames; disposal prevents traces from previous poses. */
export function createGifStream() {
  const encoder = GIFEncoder();
  let dimensions: [number,number] | undefined;
  let count = 0;
  return {
    addFrame(data:Uint8Array | Uint8ClampedArray,width:number,height:number,delay:number) {
      if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>65535||height>65535||data.length!==width*height*4)throw new Error('Ukuran frame GIF tidak valid.');
      if(dimensions && (dimensions[0]!==width || dimensions[1]!==height))throw new Error('Ukuran setiap frame GIF harus sama.');
      dimensions=[width,height];
      const palette=quantize(data,256,{format:'rgb565'});
      const indexed=applyPalette(data,palette);
      encoder.writeFrame(indexed,width,height,{palette,delay:Math.max(20,Math.round(delay/10)*10),repeat:0,dispose:1});
      count++;
    },
    finish() {
      if(!count)throw new Error('Belum ada gambar untuk GIF.');
      encoder.finish();
      return encoder.bytes();
    },
  };
}
