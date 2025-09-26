import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraIcon } from './icons/CameraIcon';
import { PhotoIcon } from './icons/PhotoIcon';

interface CameraViewProps {
  onCapture: (imageBase64: string) => void;
  onCancel: () => void;
  prompt: string;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onCancel, prompt }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Prioritize back camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setError(null);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Não foi possível acessar a câmera. Verifique as permissões do seu navegador.");
    }
  }, [stream]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      canvas.width = videoWidth;
      canvas.height = videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, videoWidth, videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const base64Data = dataUrl.split(',')[1];
        onCapture(base64Data);
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const base64Data = dataUrl.split(',')[1];
        onCapture(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black z-20 flex flex-col">
      <div className="relative w-full h-full flex items-center justify-center">
        {error ? (
          <div className="text-white text-center p-4">
            <p>{error}</p>
            <button onClick={startCamera} className="mt-4 px-4 py-2 bg-blue-500 rounded">Tentar Novamente</button>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
        )}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
             <h2 className="text-white text-center text-lg font-semibold">{prompt}</h2>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-around items-center p-4 bg-gradient-to-t from-black/60 to-transparent">
        <button 
            onClick={onCancel} 
            className="text-white font-semibold py-3 px-5 rounded-full bg-white/20 backdrop-blur-sm"
            aria-label="Cancelar"
        >
            Cancelar
        </button>

        <button
          onClick={handleCapture}
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-white/50 shadow-lg"
          aria-label="Capturar Imagem"
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600">
             <CameraIcon className="w-8 h-8"/>
          </div>
        </button>
        
        <button 
            onClick={triggerFileSelect} 
            className="p-4 rounded-full bg-white/20 backdrop-blur-sm"
            aria-label="Selecionar da Galeria"
        >
            <PhotoIcon className="w-7 h-7 text-white" />
        </button>
      </div>
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
};

export default CameraView;