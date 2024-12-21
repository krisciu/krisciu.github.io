/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log('Starting image generation with prompt:', prompt);

    // Get the prediction from Replicate
    const prediction = await replicate.predictions.create({
      version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      input: {
        prompt: prompt,
        negative_prompt: "text, watermark, low quality, cartoon"
      }
    });

    // Wait for the prediction to complete
    let finalPrediction = await replicate.wait(prediction);
    
    console.log('Final prediction:', finalPrediction);

    // The output should be in finalPrediction.output
    if (finalPrediction.output && finalPrediction.output[0]) {
      const imageUrl = finalPrediction.output[0];
      console.log('Generated image URL:', imageUrl);
      return NextResponse.json({ url: imageUrl });
    } else {
      throw new Error('No output received from Replicate');
    }

  } catch (error: any) {  // Type the error as 'any' to access .message
    console.error('Detailed API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate image', 
        details: error?.message || 'Unknown error' 
      },
      { status: 500 }
    );
  }
}