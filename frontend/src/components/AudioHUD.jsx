import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Activity } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export default function AudioHUD() {
  const [muted, setMuted] = useState(soundFX.isMuted);

  const toggleSound = () => {
    const isNowMuted = soundFX.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      soundFX.playClick();
    }
  };

  return (
    <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md text-xs font-mono select-none">
      <button
        onClick={toggleSound}
        className={`flex items-center gap-1.5 transition-colors ${
          muted ? 'text-slate-500 hover:text-slate-300' : 'text-cyan-400 hover:text-cyan-300'
        }`}
        title={muted ? 'Unmute Cyber SFX' : 'Mute Cyber SFX'}
      >
        {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 animate-pulse" />}
        <span className="hidden sm:inline text-[11px] font-semibold">{muted ? 'SFX: OFF' : 'SFX: ON'}</span>
      </button>

      {/* Cyber Frequency Waveform Bars */}
      {!muted && (
        <div className="flex items-end gap-0.5 h-3 px-1">
          <span className="w-0.5 bg-cyan-400 h-2 animate-pulse" style={{ animationDuration: '0.6s' }} />
          <span className="w-0.5 bg-violet-400 h-3 animate-pulse" style={{ animationDuration: '0.4s' }} />
          <span className="w-0.5 bg-sky-400 h-1.5 animate-pulse" style={{ animationDuration: '0.8s' }} />
          <span className="w-0.5 bg-emerald-400 h-2.5 animate-pulse" style={{ animationDuration: '0.5s' }} />
        </div>
      )}
    </div>
  );
}

