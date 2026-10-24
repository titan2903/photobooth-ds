import React from 'react';
import { FilterConfig } from '../types/photobooth';

export const FilterEffects: React.FC<{ filter: FilterConfig }> = ({ filter }) => (
  <span className="photo-effects" aria-hidden="true">
    {filter.hasGrain && <span className="photo-effect-grain" />}
    {filter.hasFilmScratches && <span className="photo-effect-scratches" />}
    {filter.hasScanlines && <span className="photo-effect-scanlines" />}
  </span>
);
