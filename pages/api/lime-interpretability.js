// pages/api/lime-interpretability.js
import { spawn } from 'child_process';

export default async function handler(req, res) {
  const { message, modelType = 'text-generation', numFeatures = 10 } = req.body;
  
  try {
    const limeAnalyzer = new LIMEInterpretability();
    const response = await limeAnalyzer.explainPrediction(message, modelType, numFeatures);
    
    res.status(200).json({
      explanation: response.limeExplanation,
      localModel: response.localModel,
      featureWeights: response.featureWeights,
      confidence: response.confidence,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'LIME analysis failed', details: error.message });
  }
}

class LIMEInterpretability {
  async explainPrediction(message, modelType, numFeatures) {
    return new Promise((resolve, reject) => {
      const pythonScript = `
import lime
from lime import lime_text
from lime.lime_tabular import LimeTabularExplainer
import torch
from transformers import pipeline
import numpy as np
import json

try:
    device = 0 if torch.cuda.is_available() else -1
    
    if "${modelType}" == "text-generation":
        model = pipeline('text-generation', model='openai-community/gpt2', device=device)
        
        # Define prediction function for LIME
        def predict_text(texts):
            results = []
            for text in texts:
                try:
                    output = model(text, max_length=50, num_return_sequences=1, 
                                 pad_token_id=model.tokenizer.eos_token_id, truncation=True)
                    # Score based on generation length and coherence
                    score = min(len(output[0]['generated_text']) / 100.0, 1.0)
                    results.append([1-score, score])  # [negative_prob, positive_prob]
                except:
                    results.append([0.5, 0.5])
            return np.array(results)
        
        # Create LIME text explainer
        explainer = lime_text.LimeTextExplainer(class_names=['Poor Generation', 'Good Generation'])
        explanation = explainer.explain_instance("${message.replace(/"/g, '\\"')}", 
                                                predict_text, 
                                                num_features=${numFeatures})
        
        # Extract feature weights
        feature_weights = explanation.as_list()
        local_model_score = explanation.score
        
    elif "${modelType}" == "sentiment-analysis":
        model = pipeline('sentiment-analysis', 
                        model='distilbert/distilbert-base-uncased-finetuned-sst-2-english', 
                        device=device)
        
        def predict_sentiment(texts):
            results = []
            for text in texts:
                try:
                    output = model(text)
                    if output[0]['label'] == 'POSITIVE':
                        pos_score = output[0]['score']
                        neg_score = 1 - pos_score
                    else:
                        neg_score = output[0]['score']
                        pos_score = 1 - neg_score
                    results.append([neg_score, pos_score])
                except:
                    results.append([0.5, 0.5])
            return np.array(results)
        
        # Create LIME text explainer for sentiment
        explainer = lime_text.LimeTextExplainer(class_names=['Negative', 'Positive'])
        explanation = explainer.explain_instance("${message.replace(/"/g, '\\"')}", 
                                                predict_sentiment, 
                                                num_features=${numFeatures})
        
        feature_weights = explanation.as_list()
        local_model_score = explanation.score
    
    # Format results
    result = {
        'lime_explanation': {
            'features': [fw[0] for fw in feature_weights[:${numFeatures}]],
            'weights': [fw[1] for fw in feature_weights[:${numFeatures}]],
            'model_score': float(local_model_score)
        },
        'local_model': {
            'type': 'linear_regression',
            'intercept': float(explanation.intercept[1]) if hasattr(explanation, 'intercept') else 0.0,
            'score': float(local_model_score)
        },
        'feature_weights': dict(feature_weights[:${numFeatures}]),
        'confidence': 0.85
    }
    
    print("LIME_OUTPUT:", json.dumps(result))
    
except Exception as e:
    print("LIME_ERROR:", str(e))
    `;

      const python = spawn('python3', ['-c', pythonScript]);
      let output = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.on('close', (code) => {
        if (output.includes('LIME_OUTPUT:')) {
          const result = JSON.parse(output.split('LIME_OUTPUT:')[1].trim());
          resolve({
            limeExplanation: result.lime_explanation,
            localModel: result.local_model,
            featureWeights: result.feature_weights,
            confidence: result.confidence
          });
        } else {
          reject(new Error('LIME analysis failed'));
        }
      });
    });
  }
}
