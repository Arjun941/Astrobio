"use client";

import { useState, useRef, useEffect } from 'react';
import { getAudioNarrationAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AudioWaveform, Play, Pause, Download, Settings, RotateCcw, Volume2 } from 'lucide-react';
import LoadingSpinner from '@/components/loading-spinner';
import { useToast } from '@/hooks/use-toast';

export default function AudioView({ paperUrl }: { paperUrl: string }) {
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voice, setVoice] = useState<string>('Puck');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [generatedVoice, setGeneratedVoice] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
    };
  }, [audioDataUri]);

  const handleGenerateAudio = async (selectedVoice: string = voice) => {
    setIsLoading(true);
    setAudioDataUri(null);
    setCurrentTime(0);
    setDuration(0);
    const result = await getAudioNarrationAction(paperUrl, selectedVoice);
    setIsLoading(false);

    if (result.error) {
      toast({
        title: "Error Generating Audio",
        description: result.error,
        variant: "destructive",
      });
    } else if ('audioDataUri' in result && result.audioDataUri) {
      setAudioDataUri(result.audioDataUri);
      setGeneratedVoice(selectedVoice);
      setShowVoiceSelector(false);
      toast({
        title: "Audio Generated Successfully",
        description: `The narration has been generated with ${selectedVoice} voice and is ready to play.`,
      });
    }
  };

  const handleInitialGenerate = () => {
    handleGenerateAudio();
  };

  const handleRegenerate = () => {
    handleGenerateAudio(voice);
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current && duration > 0) {
      const seekTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVoiceRegenerate = (selectedVoice: string) => {
    setVoice(selectedVoice);
    handleGenerateAudio(selectedVoice);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Audio Narration</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center space-y-6 min-h-[20rem]">
        <AudioWaveform className="w-16 h-16 text-primary" />
        
        {!audioDataUri && !isLoading && (
          <>
            <p className="text-muted-foreground">Listen to an audio version of this paper using Gemini TTS.</p>
            
            {/* Voice Settings Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="mb-4"
            >
              <Settings className="mr-2 w-4 h-4" />
              {showAdvanced ? 'Hide' : 'Show'} Voice Settings
            </Button>
            
            {/* Voice Selection */}
            {showAdvanced && (
              <div className="w-full max-w-md space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="voice-select">Gemini Voice</Label>
                  <Select value={voice} onValueChange={setVoice}>
                    <SelectTrigger id="voice-select">
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Puck">Puck - Upbeat</SelectItem>
                      <SelectItem value="Charon">Charon - Informative</SelectItem>
                      <SelectItem value="Kore">Kore - Firm</SelectItem>
                      <SelectItem value="Fenrir">Fenrir - Excitable</SelectItem>
                      <SelectItem value="Leda">Leda - Youthful</SelectItem>
                      <SelectItem value="Orus">Orus - Firm</SelectItem>
                      <SelectItem value="Aoede">Aoede - Breezy</SelectItem>
                      <SelectItem value="Zephyr">Zephyr - Bright</SelectItem>
                      <SelectItem value="Callirhoe">Callirhoe - Easy-going</SelectItem>
                      <SelectItem value="Autonoe">Autonoe - Bright</SelectItem>
                      <SelectItem value="Enceladus">Enceladus - Breathy</SelectItem>
                      <SelectItem value="Iapetus">Iapetus - Clear</SelectItem>
                      <SelectItem value="Umbriel">Umbriel - Easy-going</SelectItem>
                      <SelectItem value="Algieba">Algieba - Smooth</SelectItem>
                      <SelectItem value="Despina">Despina - Smooth</SelectItem>
                      <SelectItem value="Erinome">Erinome - Clear</SelectItem>
                      <SelectItem value="Algenib">Algenib - Professional</SelectItem>
                      <SelectItem value="Rasalgethi">Rasalgethi - Deep</SelectItem>
                      <SelectItem value="Laomedeia">Laomedeia - Gentle</SelectItem>
                      <SelectItem value="Achernar">Achernar - Strong</SelectItem>
                      <SelectItem value="Alnilam">Alnilam - Crisp</SelectItem>
                      <SelectItem value="Schedar">Schedar - Warm</SelectItem>
                      <SelectItem value="Gacrux">Gacrux - Rich</SelectItem>
                      <SelectItem value="Pulcherrima">Pulcherrima - Elegant</SelectItem>
                      <SelectItem value="Achird">Achird - Confident</SelectItem>
                      <SelectItem value="Zubenelgenubi">Zubenelgenubi - Balanced</SelectItem>
                      <SelectItem value="Vindemiatrix">Vindemiatrix - Articulate</SelectItem>
                      <SelectItem value="Sadachbia">Sadachbia - Melodic</SelectItem>
                      <SelectItem value="Sadaltager">Sadaltager - Resonant</SelectItem>
                      <SelectItem value="Sulafar">Sulafar - Dynamic</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose from Gemini's 30 professional voices
                  </p>
                </div>
              </div>
            )}
            
            <Button onClick={handleInitialGenerate} size="lg" className="mt-4">
              Generate Narration
            </Button>
          </>
        )}

        {isLoading && (
          <>
            <LoadingSpinner />
            <p className="mt-4">Generating audio, this can take a minute...</p>
          </>
        )}

        {audioDataUri && (
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Generated with <strong>{generatedVoice}</strong> voice
              </p>
            </div>
            
            <audio 
              ref={audioRef} 
              src={audioDataUri} 
              onEnded={handleAudioEnd} 
              onPlay={() => setIsPlaying(true)} 
              onPause={() => setIsPlaying(false)}
              style={{ display: 'none' }}
            />
            
            {/* Audio Progress Slider */}
            <div className="space-y-2">
              <Slider
                value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
                className="w-full"
                disabled={duration === 0}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button onClick={togglePlayback} size="lg">
                {isPlaying ? <Pause className="mr-2 w-4 h-4" /> : <Play className="mr-2 w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button asChild variant="outline">
                <a href={audioDataUri} download="narration.wav">
                  <Download className="w-4 h-4" />
                </a>
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={[volume * 100]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-8">{Math.round(volume * 100)}%</span>
            </div>

            {/* Regenerate Options */}
            <div className="space-y-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={handleRegenerate} 
                disabled={isLoading}
                className="w-full"
              >
                <RotateCcw className="mr-2 w-4 h-4" />
                Regenerate with {generatedVoice}
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => setShowVoiceSelector(!showVoiceSelector)}
                className="w-full"
              >
                <Settings className="mr-2 w-4 h-4" />
                {showVoiceSelector ? 'Hide' : 'Try'} Different Voice
              </Button>

              {/* Voice Selector for Regeneration */}
              {showVoiceSelector && (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                  <Label className="text-sm font-medium">Choose a different voice:</Label>
                  <Select onValueChange={handleVoiceRegenerate} disabled={isLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select voice to regenerate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Puck">Puck - Upbeat</SelectItem>
                      <SelectItem value="Charon">Charon - Informative</SelectItem>
                      <SelectItem value="Kore">Kore - Firm</SelectItem>
                      <SelectItem value="Fenrir">Fenrir - Excitable</SelectItem>
                      <SelectItem value="Leda">Leda - Youthful</SelectItem>
                      <SelectItem value="Orus">Orus - Firm</SelectItem>
                      <SelectItem value="Aoede">Aoede - Breezy</SelectItem>
                      <SelectItem value="Zephyr">Zephyr - Bright</SelectItem>
                      <SelectItem value="Callirhoe">Callirhoe - Easy-going</SelectItem>
                      <SelectItem value="Autonoe">Autonoe - Bright</SelectItem>
                      <SelectItem value="Enceladus">Enceladus - Breathy</SelectItem>
                      <SelectItem value="Iapetus">Iapetus - Clear</SelectItem>
                      <SelectItem value="Umbriel">Umbriel - Easy-going</SelectItem>
                      <SelectItem value="Algieba">Algieba - Smooth</SelectItem>
                      <SelectItem value="Despina">Despina - Smooth</SelectItem>
                      <SelectItem value="Erinome">Erinome - Clear</SelectItem>
                      <SelectItem value="Algenib">Algenib - Professional</SelectItem>
                      <SelectItem value="Rasalgethi">Rasalgethi - Deep</SelectItem>
                      <SelectItem value="Laomedeia">Laomedeia - Gentle</SelectItem>
                      <SelectItem value="Achernar">Achernar - Strong</SelectItem>
                      <SelectItem value="Alnilam">Alnilam - Crisp</SelectItem>
                      <SelectItem value="Schedar">Schedar - Warm</SelectItem>
                      <SelectItem value="Gacrux">Gacrux - Rich</SelectItem>
                      <SelectItem value="Pulcherrima">Pulcherrima - Elegant</SelectItem>
                      <SelectItem value="Achird">Achird - Confident</SelectItem>
                      <SelectItem value="Zubenelgenubi">Zubenelgenubi - Balanced</SelectItem>
                      <SelectItem value="Vindemiatrix">Vindemiatrix - Articulate</SelectItem>
                      <SelectItem value="Sadachbia">Sadachbia - Melodic</SelectItem>
                      <SelectItem value="Sadaltager">Sadaltager - Resonant</SelectItem>
                      <SelectItem value="Sulafar">Sulafar - Dynamic</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Selecting a voice will immediately regenerate the audio
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
