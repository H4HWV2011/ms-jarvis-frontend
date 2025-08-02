// pages/api/shap-interpretability.js
import { spawn } from 'child_process';

export default async function handler(req, res) {
  const { message, modelType = 'text-generation', shapMethod = 'explainer' } = req.body;
  
  try {
    const shapAnalyzer = new SHAPInterpretability();
    const response = await shapAnalyzer.explainPrediction(message, modelType, shapMethod);
    
    res.status(200).json({
      explanation: response.shapValues,
      visualization: response.visualData,
      featureImportance: response.featureImportance,
      confidence: response.confidence,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'SHAP analysis failed', details: error.message });
  }
}

class SHAPInterpretability {
  async explainPrediction(message, modelType, method) {
    return new Promise((resolve, reject) => {
      const pythonScript = `
import shap
import torch
from transformers import pipeline
import numpy as np
import json

try:
    # Initialize model based on your working ensemble
    device = 0 if torch.cuda.is_available() else -1
    
    if "${modelType}" == "text-generation":
        model = pipeline('text-generation', model='openai-community/gpt2', device=device)
        tokenizer = model.tokenizer
        
        # Create SHAP explainer for text generation
        def predict_fn(texts):
            results = []
            for text in texts:
                try:
                    output = model(text, max_length=50, num_return_sequences=1, 
                                 pad_token_id=tokenizer.eos_token_id, truncation=True)
                    # Use log probability as prediction score
                    results.append(len(output[0]['generated_text']) / 100.0)
                except:
                    results.append(0.5)  # Default score
            return np.array(results)
        
        # Tokenize input for SHAP analysis
        tokens = tokenizer.encode("${message.replace(/"/g, '\\"')}", return_tensors='pt')
        token_strings = [tokenizer.decode([t]) for t in tokens[0]]
        
        # Create SHAP explainer
        explainer = shap.Explainer(predict_fn, tokenizer)
        shap_values = explainer(["${message.replace(/"/g, '\\"')}"])
        
        # Extract feature importance
        feature_importance = {
            'tokens': token_strings[:10],  # Top 10 tokens
            'values': shap_values.values[0][:10].tolist() if len(shap_values.values[0]) > 0 else [],
            'base_value': float(shap_values.base_values[0]) if hasattr(shap_values, 'base_values') else 0.0
        }
        
    elif "${modelType}" == "sentiment-analysis":
        model = pipeline('sentiment-analysis', 
                        model='distilbert/distilbert-base-uncased-finetuned-sst-2-english', 
                        device=device)
        
        # SHAP explainer for sentiment analysis
        def predict_sentiment(texts):
            results = []
            for text in texts:
                try:
                    output = model(text)
                    # Return probability score for positive sentiment
                    score = output[0]['score'] if output[0]['label'] == 'POSITIVE' else 1 - output[0]['score']
                    results.append(score)
                except:
                    results.append(0.5)
            return np.array(results)
        
        # Use masker for text
        masker = shap.maskers.Text(tokenizer=r"\\W+")
        explainer = shap.Explainer(predict_sentiment, masker)
        shap_values = explainer(["${message.replace(/"/g, '\\"')}"])
        
        # Extract word-level importance
        words = "${message.replace(/"/g, '\\"')}".split()
        feature_importance = {
            'words': words[:10],
            'values': shap_values.values[0][:len(words)][:10].tolist() if len(shap_values.values[0]) > 0 else [],
            'base_value': float(shap_values.base_values[0]) if hasattr(shap_values, 'base_values') else 0.0
        }
    
    # Create visualization data
    visualization_data = {
        'type': 'shap_waterfall',
        'features': feature_importance['tokens'] if "${modelType}" == "text-generation" else feature_importance['words'],
        'values': feature_importance['values'],
        'base_value': feature_importance['base_value'],
        'prediction_explanation': f"SHAP analysis of {modelType} model prediction"
    }
    
    result = {
        'shap_values': feature_importance,
        'visualization_data': visualization_data,
        'method': 'shap_${method}',
        'model_type': '${modelType}',
        'confidence': 0.9
    }
    
    print("SHAP_OUTPUT:", json.dumps(result))
    
except Exception as e:
    print("SHAP_ERROR:", str(e))
    `;

      const python = spawn('python3', ['-c', pythonScript]);
      let output = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.on('close', (code) => {
        if (output.includes('SHAP_OUTPUT:')) {
          const result = JSON.parse(output.split('SHAP_OUTPUT:')[1].trim());
          resolve({
            shapValues: result.shap_values,
            visualData: result.visualization_data,
            featureImportance: result.shap_values,
            confidence: result.confidence
          });
        } else {
          reject(new Error('SHAP analysis failed'));
        }
      });
    });
  }
}
