"use client";

import { useState, useRef } from 'react';
import { getAudioNarrationAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AudioWaveform, Play, Pause, Download, Settings } from 'lucide-react';
import LoadingSpinner from '@/components/loading-spinner';
import { useToast } from '@/hooks/use-toast';

export default function AudioView({ paperUrl }: { paperUrl: string }) {
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voice, setVoice] = useState<string>('Puck');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const handleGenerateAudio = async () => {
    setIsLoading(true);
    setAudioDataUri(null);
    const result = await getAudioNarrationAction(paperUrl, voice);
    setIsLoading(false);

    if (result.error) {
      toast({
        title: "Error Generating Audio",
        description: result.error,
        variant: "destructive",
      });
    } else if ('audioDataUri' in result && result.audioDataUri) {
      setAudioDataUri(result.audioDataUri);
      toast({
        title: "Audio Generated Successfully",
        description: "The narration has been converted to audio and is ready to play.",
      });
    }
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
            
            <Button onClick={handleGenerateAudio} size="lg" className="mt-4">
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
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Generated with <strong>{voice}</strong> voice
            </p>
             <audio ref={audioRef} src={audioDataUri} onEnded={handleAudioEnd} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
            <div className="flex items-center space-x-4">
              <Button onClick={togglePlayback} size="lg">
                {isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button asChild variant="outline">
                <a href={audioDataUri} download="narration.wav">
                  <Download className="mr-2" />
                  Download
                </a>
              </Button>
            </div>
            <Button variant="link" onClick={handleGenerateAudio} disabled={isLoading}>
              Regenerate with {voice}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
