/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState, useEffect } from 'react';
import { createApi } from 'unsplash-js';

// Define the shape of the Unsplash API response for type safety
type UnsplashResponse = {
  response?: {
    urls: {
      regular: string;
    };
  };
};

// Initialize the Unsplash API client with your access key
const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || ''
});

// Get Replicate API key from environment variables
const replicateApiKey = process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN;

const ImageGame = () => {
  // Game state management
  const [score, setScore] = useState(0);
  const [totalPlayed, setTotalPlayed] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<{real: string | null, ai: string | null}>({
    real: null,
    ai: null
  });
  // Randomly determine if the real image should be on the left
  const [isLeftReal] = useState(Math.random() < 0.5);

  // Function to generate an AI image using the Replicate API
  const generateAiImage = async (prompt: string): Promise<string> => {
    // First, create the prediction request
    const prediction = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${replicateApiKey}`,
      },
      body: JSON.stringify({
        version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        input: { prompt }
      })
    });
    
    const predictionData = await prediction.json();
    
    // Poll for the result until the image is generated
    while (true) {
      const response = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionData.id}`,
        {
          headers: {
            Authorization: `Token ${replicateApiKey}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.status === "succeeded") {
        return data.output[0];
      } else if (data.status === "failed") {
        throw new Error("Image generation failed");
      }
      
      // Wait for 1 second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  // Function to fetch both real and AI images
  const fetchImages = async () => {
    setLoading(true);
    try {
      // Get a random nature photo from Unsplash
      const realImage = await unsplash.photos.getRandom({
        query: 'nature landscape',
        orientation: 'landscape'
      }) as UnsplashResponse;

      // Generate a matching AI image
      const aiImageUrl = await generateAiImage(
        "beautiful nature landscape, photorealistic, 4k"
      );

      // Update state with both images if we have them
      if (realImage.response?.urls && aiImageUrl) {
        setImages({
          real: realImage.response.urls.regular,
          ai: aiImageUrl
        });
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
    setLoading(false);
  };

  // Handle the user's guess
  const handleGuess = (guessedReal: boolean) => {
    const correct = guessedReal === isLeftReal;
    setIsCorrect(correct);
    setShowResult(true);
    setScore(prev => correct ? prev + 1 : prev);
    setTotalPlayed(prev => prev + 1);
  };

  // Set up the next round
  const nextRound = async () => {
    setShowResult(false);
    setImages({ real: null, ai: null });
    await fetchImages();
  };

  // Load initial images when component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header section with score */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Real or AI?</h1>
          <p className="text-xl">Score: {score}/{totalPlayed}</p>
        </div>

        {/* Loading spinner or game interface */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left image */}
            <div className="flex flex-col">
              <div className="relative aspect-[4/3] bg-gray-900 rounded-t-lg overflow-hidden">
                {images.real && images.ai && (
                  <img 
                    src={isLeftReal ? images.real : images.ai} 
                    alt="Left image" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {!showResult && (
                <button 
                  className="w-full p-4 bg-blue-600 hover:bg-blue-700 transition rounded-b-lg text-lg font-medium"
                  onClick={() => handleGuess(true)}
                >
                  This is the REAL image
                </button>
              )}
            </div>

            {/* Right image */}
            <div className="flex flex-col">
              <div className="relative aspect-[4/3] bg-gray-900 rounded-t-lg overflow-hidden">
                {images.real && images.ai && (
                  <img 
                    src={isLeftReal ? images.ai : images.real} 
                    alt="Right image" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {!showResult && (
                <button 
                  className="w-full p-4 bg-blue-600 hover:bg-blue-700 transition rounded-b-lg text-lg font-medium"
                  onClick={() => handleGuess(false)}
                >
                  This is the REAL image
                </button>
              )}
            </div>
          </div>
        )}

        {/* Result and next round button */}
        {showResult && (
          <div className="space-y-4">
            <div className={`p-6 rounded-lg text-center text-lg ${isCorrect ? "bg-green-600" : "bg-red-600"}`}>
              {isCorrect 
                ? "Correct! You successfully identified the real image!"
                : "Wrong! Better luck next time!"}
            </div>
            <button 
              className="w-full p-4 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-lg font-medium"
              onClick={nextRound}
            >
              Next Round
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGame;