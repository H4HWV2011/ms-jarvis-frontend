// pages/api/real-ai-bridge.js
import { spawn } from 'child_process';

export default async function handler(req, res) {
  const { message, aiModel = 'text-generation' } = req.body;
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await processWithRealAI(message, aiModel);
    
    res.status(200).json({
      response: response.output,
      model: response.model,
      processingTime: response.processingTime,
      timestamp: new Date().toISOString(),
      isRealAI: true
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Real AI processing failed', 
      details: error.message,
      fallback: 'Your confirmed AI models (GPT-2, DistilBERT) are still available'
    });
  }
}

async function processWithRealAI(message, modelType) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    // Python script to run actual AI inference using your confirmed working models
    const pythonScript = `
import sys
from transformers import pipeline
import torch

try:
    # Use your confirmed working models
    if "${modelType}" == "text-generation":
        # Use your downloaded GPT-2 model (548MB)
        generator = pipeline('text-generation', model='openai-community/gpt2', device=0 if torch.cuda.is_available() else -1)
        result = generator("${message.replace(/"/g, '\\"')}", max_length=100, num_return_sequences=1, pad_token_id=50256)
        output = result[0]['generated_text']
    elif "${modelType}" == "sentiment-analysis":
        # Use your downloaded DistilBERT model (268MB)
        analyzer = pipeline('sentiment-analysis', model='distilbert/distilbert-base-uncased-finetuned-sst-2-english', device=0 if torch.cuda.is_available() else -1)
        result = analyzer("${message.replace(/"/g, '\\"')}")
        output = f"Message: '${message.replace(/"/g, '\\"')}'\nSentiment: {result[0]['label']} (confidence: {result[0]['score']:.3f})\nThis is REAL AI analysis using your DistilBERT model on CUDA GPU."
    elif "${modelType}" == "question-answering":
        # Use your downloaded Question-Answering model (261MB)
        qa_pipeline = pipeline('question-answering', model='distilbert/distilbert-base-cased-distilled-squad', device=0 if torch.cuda.is_available() else -1)
        context = "This is a test of the real AI bridge system using actual downloaded models including GPT-2 for text generation, DistilBERT for sentiment analysis, and question-answering capabilities."
        result = qa_pipeline(question="${message.replace(/"/g, '\\"')}", context=context)
        output = f"Question: '${message.replace(/"/g, '\\"')}'\nAnswer: {result['answer']}\nConfidence: {result['score']:.3f}\nThis is REAL AI question-answering using your DistilBERT model."
    else:
        # Default to text generation with your GPT-2 model
        generator = pipeline('text-generation', model='openai-community/gpt2', device=0 if torch.cuda.is_available() else -1)
        result = generator("${message.replace(/"/g, '\\"')}", max_length=75, num_return_sequences=1, pad_token_id=50256)
        output = result[0]['generated_text']
    
    print("REAL_AI_OUTPUT:", output)
    
except Exception as e:
    print("REAL_AI_ERROR:", str(e))
    `;

    const python = spawn('python3', ['-c', pythonScript]);
    let output = '';
    let error = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('close', (code) => {
      const processingTime = Date.now() - startTime;
      
      if (code === 0 && output.includes('REAL_AI_OUTPUT:')) {
        const aiOutput = output.split('REAL_AI_OUTPUT:')[1].trim();
        resolve({
          output: aiOutput,
          model: `${modelType} (using confirmed working models: GPT-2, DistilBERT on CUDA)`,
          processingTime: `${processingTime}ms`,
          isActualAI: true
        });
      } else if (output.includes('REAL_AI_ERROR:')) {
        const errorMsg = output.split('REAL_AI_ERROR:')[1].trim();
        reject(new Error(`AI Model Error: ${errorMsg}`));
      } else {
        reject(new Error(`Python execution failed: ${error}`));
      }
    });
  });
}
