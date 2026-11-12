/* Uniform line icons for each subject (24x24, 1.6 stroke, drawn in currentColor). */
const ICONS={
psir:'<path d="M3 9h18M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 20h18M12 3 3 8h18z"/>',
history:'<path d="M6 4h11a2 2 0 0 1 2 2v12H8a2 2 0 0 0-2 2V4z"/><path d="M6 20a2 2 0 0 0 2 2h11M10 8h6M10 12h6"/>',
geography:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
environment:'<path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path d="M5 19 13 11"/>',
world:'<path d="M7 3h10M7 21h10M8 3c0 5 8 6 8 9s-8 4-8 9M16 3c0 5-8 6-8 9s8 4 8 9"/>',
communism:'<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z"/>',
astronomy:'<circle cx="12" cy="12" r="4"/><ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-20 12 12)"/><path d="M19 4h.01M5 5h.01M20 18h.01"/>',
physics:'<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
chemistry:'<path d="M9 3h6M10 3v6L4.5 18.5A1.6 1.6 0 0 0 6 21h12a1.6 1.6 0 0 0 1.5-2.5L14 9V3"/><path d="M7 15h10"/>',
biology:'<path d="M7 3c0 6 10 6 10 12s-10 3-10 6M17 3c0 6-10 6-10 12s10 3 10 6"/><path d="M8.5 6h7M8.5 18h7M10 12h4"/>',
quantum:'<path d="M2 12c2-6 4-6 6 0s4 6 6 0 4-6 6 0 2 3 2 3"/><circle cx="12" cy="12" r="9" stroke-dasharray="2 3"/>'};
const icon=(id,cls='ic')=>`<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[id]||ICONS.psir}</svg>`;
