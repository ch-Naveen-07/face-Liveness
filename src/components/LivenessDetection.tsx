import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import * as blazeface from '@tensorflow-models/blazeface';
import * as tf from '@tensorflow/tfjs';
import { Camera, ShieldCheck, AlertCircle, Play } from 'lucide-react';

const LivenessDetection = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReal, setIsReal] = useState<boolean | null>(null);
  const [model, setModel] = useState<blazeface.BlazeFaceModel | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const loadedModel = await blazeface.load();
      setModel(loadedModel);
      setIsLoading(false);
    };
    loadModel();
  }, []);

  const checkLiveness = async () => {
    if (!model || !webcamRef.current) return;

    const video = webcamRef.current.video;
    if (!video) return;

    // Get predictions
    const predictions = await model.estimateFaces(video, false);
    
    // If we detect exactly one face, consider it real
    if (predictions.length === 1) {
      setIsReal(true);
      setTimeout(() => {
        navigate('/success');
      }, 2000);
    } else {
      setIsReal(false);
    }
  };

  useEffect(() => {
    if (!isLoading && isVerifying) {
      const interval = setInterval(checkLiveness, 1000);
      return () => clearInterval(interval);
    }
  }, [isLoading, model, isVerifying]);

  const startVerification = () => {
    setIsVerifying(true);
    setIsReal(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Camera className="mx-auto h-12 w-12 text-cyan-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Liveness Detection
          </h2>
          <p className="mt-2 text-sm text-cyan-400">
            {!isVerifying 
              ? "Click Start Verification when ready" 
              : "Please look at the camera for verification"}
          </p>
        </div>

        <div className="mt-8 relative">
          <div className={`
            rounded-lg overflow-hidden
            ${isReal === true ? 'ring-4 ring-green-500' : ''}
            ${isReal === false ? 'ring-4 ring-red-500' : ''}
            shadow-[0_0_20px_rgba(0,255,255,0.5)]
          `}>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full"
            />
          </div>

          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-cyan-400">Loading...</div>
            </div>
          ) : null}

          <div className="mt-4 text-center">
            {!isVerifying && !isLoading && (
              <button
                onClick={startVerification}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-cyan-400 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 shadow-[0_0_10px_rgba(0,255,255,0.5)] hover:shadow-[0_0_20px_rgba(0,255,255,0.7)]"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Verification
              </button>
            )}
            {isVerifying && (
              <>
                {isReal === true && (
                  <div className="flex items-center justify-center space-x-2 text-green-500">
                    <ShieldCheck className="h-5 w-5" />
                    <span>Real Person Verified!</span>
                  </div>
                )}
                {isReal === false && (
                  <div className="flex items-center justify-center space-x-2 text-red-500">
                    <AlertCircle className="h-5 w-5" />
                    <span>Please ensure only one real person is visible</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivenessDetection;