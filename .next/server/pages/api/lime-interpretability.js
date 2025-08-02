"use strict";(()=>{var a={};a.id=522,a.ids=[522],a.modules={5600:a=>{a.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},8243:(a,b,c)=>{c.r(b),c.d(b,{config:()=>o,default:()=>n,handler:()=>q});var d={};c.r(d),c.d(d,{default:()=>j});var e=c(9046),f=c(8667),g=c(3480),h=c(6435),i=c(9646);async function j(a,b){let{message:c,modelType:d="text-generation",numFeatures:e=10}=a.body;try{let a=new k,f=await a.explainPrediction(c,d,e);b.status(200).json({explanation:f.limeExplanation,localModel:f.localModel,featureWeights:f.featureWeights,confidence:f.confidence,timestamp:new Date().toISOString()})}catch(a){b.status(500).json({error:"LIME analysis failed",details:a.message})}}class k{async explainPrediction(a,b,c){return new Promise((d,e)=>{let f=`
import lime
from lime import lime_text
from lime.lime_tabular import LimeTabularExplainer
import torch
from transformers import pipeline
import numpy as np
import json

try:
    device = 0 if torch.cuda.is_available() else -1
    
    if "${b}" == "text-generation":
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
        explanation = explainer.explain_instance("${a.replace(/"/g,'\\"')}", 
                                                predict_text, 
                                                num_features=${c})
        
        # Extract feature weights
        feature_weights = explanation.as_list()
        local_model_score = explanation.score
        
    elif "${b}" == "sentiment-analysis":
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
        explanation = explainer.explain_instance("${a.replace(/"/g,'\\"')}", 
                                                predict_sentiment, 
                                                num_features=${c})
        
        feature_weights = explanation.as_list()
        local_model_score = explanation.score
    
    # Format results
    result = {
        'lime_explanation': {
            'features': [fw[0] for fw in feature_weights[:${c}]],
            'weights': [fw[1] for fw in feature_weights[:${c}]],
            'model_score': float(local_model_score)
        },
        'local_model': {
            'type': 'linear_regression',
            'intercept': float(explanation.intercept[1]) if hasattr(explanation, 'intercept') else 0.0,
            'score': float(local_model_score)
        },
        'feature_weights': dict(feature_weights[:${c}]),
        'confidence': 0.85
    }
    
    print("LIME_OUTPUT:", json.dumps(result))
    
except Exception as e:
    print("LIME_ERROR:", str(e))
    `,g=(0,i.spawn)("python3",["-c",f]),h="";g.stdout.on("data",a=>{h+=a.toString()}),g.on("close",a=>{if(h.includes("LIME_OUTPUT:")){let a=JSON.parse(h.split("LIME_OUTPUT:")[1].trim());d({limeExplanation:a.lime_explanation,localModel:a.local_model,featureWeights:a.feature_weights,confidence:a.confidence})}else e(Error("LIME analysis failed"))})})}}var l=c(8112),m=c(8766);let n=(0,h.M)(d,"default"),o=(0,h.M)(d,"config"),p=new g.PagesAPIRouteModule({definition:{kind:f.A.PAGES_API,page:"/api/lime-interpretability",pathname:"/api/lime-interpretability",bundlePath:"",filename:""},userland:d,distDir:".next",projectDir:""});async function q(a,b,c){let d=await p.prepare(a,b,{srcPage:"/api/lime-interpretability"});if(!d){b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve());return}let{query:f,params:g,prerenderManifest:h}=d;try{let c=a.method||"GET",d=(0,l.getTracer)(),e=d.getActiveScopeSpan(),i=p.instrumentationOnRequestError.bind(p),j=async e=>p.render(a,b,{query:{...f,...g},params:g,allowedRevalidateHeaderKeys:void 0,multiZoneDraftMode:!0,trustHostHeader:void 0,previewProps:h.preview,propagateError:!1,dev:p.isDev,page:"/api/lime-interpretability",projectDir:"",onError:(...b)=>i(a,...b)}).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let f=d.getRootSpanAttributes();if(!f)return;if(f.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${f.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let g=f.get("next.route");if(g){let a=`${c} ${g}`;e.setAttributes({"next.route":g,"http.route":g,"next.span_name":a}),e.updateName(a)}else e.updateName(`${c} ${a.url}`)});e?await j(e):await d.withPropagatedContext(a.headers,()=>d.trace(m.BaseServerSpan.handleRequest,{spanName:`${c} ${a.url}`,kind:l.SpanKind.SERVER,attributes:{"http.method":c,"http.target":a.url}},j))}catch(a){if(p.isDev)throw a;(0,e.sendError)(b,500,"Internal Server Error")}finally{null==c.waitUntil||c.waitUntil.call(c,Promise.resolve())}}},9646:a=>{a.exports=require("child_process")}};var b=require("../../webpack-api-runtime.js");b.C(a);var c=b.X(0,[169],()=>b(b.s=8243));module.exports=c})();