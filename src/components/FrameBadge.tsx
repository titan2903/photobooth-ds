import React from 'react';
import { Gem, Layers } from 'lucide-react';
import { FrameTier } from '../types/photobooth';

export const FrameBadge: React.FC<{ tier: FrameTier }> = ({ tier }) => (
  <span className={`frame-tier-badge frame-tier-${tier}`}>
    {tier === 'exclusive' ? <Gem size={11} /> : <Layers size={11} />}
    {tier === 'exclusive' ? 'Eksklusif' : 'Standar'}
  </span>
);
