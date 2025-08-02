// pages/api/ensemble-distributed-coordinator.js
import { spawn } from 'child_process';

export default async function handler(req, res) {
  const { message, models = ['gpt2', 'distilbert-sentiment', 'distilbert-qa'], batchSize = 4 } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Spawn Python with distributed Ray inference
    const pythonScript = `
import ray
import json

@ray.remote
def run_model(model_type, prompt):
    from transformers import pipeline
    import torch

    device = 0 if torch.cuda.is_available() else -1

    if model_type == 'gpt2':
        pipe = pipeline('text-generation', model='openai-community/gpt2', device=device)
        out = pipe(prompt, max_length=60, num_return_sequences=1)[0]['generated_text']
        return {'model':'gpt2','result':out}
    if model_type == 'distilbert-sentiment':
        pipe = pipeline('sentiment-analysis', model='distilbert/distilbert-base-uncased-finetuned-sst-2-english', device=device)
        out = pipe(prompt)[0]
        return {'model':'distilbert-sentiment','result':out}
    if model_type == 'distilbert-qa':
        pipe = pipeline('question-answering', model='distilbert/distilbert-base-cased-distilled-squad', device=device)
        context = prompt + " This is a QA context for distributed inference."
        out = pipe(question=prompt, context=context)
        return {'model':'distilbert-qa','result':out}
    return {'model':model_type,'error':'Unknown model'}

# Initialize Ray (auto-detects if already running)
ray.init(ignore_reinit_error=True)

# Launch all jobs in parallel
prompt = "${message.replace(/"/g,'\\"')}"
jobs = [run_model.remote(m, prompt) for m in ${JSON.stringify(models)}]
results = ray.get(jobs)
print(json.dumps({'results': results}))
`;

    const python = spawn('python3', ['-c', pythonScript]);
    let collected = '';

    python.stdout.on('data', (data) => { collected += data.toString(); });
    python.stderr.on('data', (data) => { collected += data.toString(); });

    python.on('close', (code) => {
      try {
        const jsonMatch = collected.match(/\{[\s\S]+?\}$/m);
        if (jsonMatch) {
          const results = JSON.parse(jsonMatch[0]);
          res.status(200).json({
            distributedResults: results.results,
            nodeCount: models.length,
            status: 'Distributed Processing COMPLETE',
            timestamp: new Date().toISOString()
          });
        } else {
          res.status(500).json({ error: 'No valid model results', output: collected });
        }
      } catch (err) {
        res.status(500).json({ error: 'Result parse error', details: err.message, output: collected });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Distributed coordinator error', details: error.message });
  }
}
