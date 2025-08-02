"use strict";(()=>{var a={};a.id=516,a.ids=[516],a.modules={2907:(a,b,c)=>{c.r(b),c.d(b,{config:()=>o,default:()=>n,handler:()=>q});var d={};c.r(d),c.d(d,{default:()=>j});var e=c(9046),f=c(8667),g=c(3480),h=c(6435),i=c(9646);async function j(a,b){let{message:c,aiModel:d="text-generation"}=a.body;if("POST"!==a.method)return b.status(405).json({error:"Method not allowed"});try{let a=await k(c,d);b.status(200).json({response:a.output,model:a.model,processingTime:a.processingTime,timestamp:new Date().toISOString(),isRealAI:!0})}catch(a){b.status(500).json({error:"Real AI processing failed",details:a.message,fallback:"Your confirmed AI models (GPT-2, DistilBERT) are still available"})}}async function k(a,b){return new Promise((c,d)=>{let e=Date.now(),f=`
import sys
from transformers import pipeline
import torch

try:
    # Use your confirmed working models
    if "${b}" == "text-generation":
        # Use your downloaded GPT-2 model (548MB)
        generator = pipeline('text-generation', model='openai-community/gpt2', device=0 if torch.cuda.is_available() else -1)
        result = generator("${a.replace(/"/g,'\\"')}", max_length=100, num_return_sequences=1, pad_token_id=50256)
        output = result[0]['generated_text']
    elif "${b}" == "sentiment-analysis":
        # Use your downloaded DistilBERT model (268MB)
        analyzer = pipeline('sentiment-analysis', model='distilbert/distilbert-base-uncased-finetuned-sst-2-english', device=0 if torch.cuda.is_available() else -1)
        result = analyzer("${a.replace(/"/g,'\\"')}")
        output = f"Message: '${a.replace(/"/g,'\\"')}'
Sentiment: {result[0]['label']} (confidence: {result[0]['score']:.3f})
This is REAL AI analysis using your DistilBERT model on CUDA GPU."
    elif "${b}" == "question-answering":
        # Use your downloaded Question-Answering model (261MB)
        qa_pipeline = pipeline('question-answering', model='distilbert/distilbert-base-cased-distilled-squad', device=0 if torch.cuda.is_available() else -1)
        context = "This is a test of the real AI bridge system using actual downloaded models including GPT-2 for text generation, DistilBERT for sentiment analysis, and question-answering capabilities."
        result = qa_pipeline(question="${a.replace(/"/g,'\\"')}", context=context)
        output = f"Question: '${a.replace(/"/g,'\\"')}'
Answer: {result['answer']}
Confidence: {result['score']:.3f}
This is REAL AI question-answering using your DistilBERT model."
    else:
        # Default to text generation with your GPT-2 model
        generator = pipeline('text-generation', model='openai-community/gpt2', device=0 if torch.cuda.is_available() else -1)
        result = generator("${a.replace(/"/g,'\\"')}", max_length=75, num_return_sequences=1, pad_token_id=50256)
        output = result[0]['generated_text']
    
    print("REAL_AI_OUTPUT:", output)
    
except Exception as e:
    print("REAL_AI_ERROR:", str(e))
    `,g=(0,i.spawn)("python3",["-c",f]),h="",j="";g.stdout.on("data",a=>{h+=a.toString()}),g.stderr.on("data",a=>{j+=a.toString()}),g.on("close",a=>{let f=Date.now()-e;if(0===a&&h.includes("REAL_AI_OUTPUT:"))c({output:h.split("REAL_AI_OUTPUT:")[1].trim(),model:`${b} (using confirmed working models: GPT-2, DistilBERT on CUDA)`,processingTime:`${f}ms`,isActualAI:!0});else if(h.includes("REAL_AI_ERROR:")){let a=h.split("REAL_AI_ERROR:")[1].trim();d(Error(`AI Model Error: ${a}`))}else d(Error(`Python execution failed: ${j}`))})})}var l=c(8112),m=c(8766);let n=(0,h.M)(d,"default"),o=(0,h.M)(d,"config"),p=new g.PagesAPIRouteModule({definition:{kind:f.A.PAGES_API,page:"/api/real-ai-bridge",pathname:"/api/real-ai-bridge",bundlePath:"",filename:""},userland:d,distDir:".next",projectDir:""});async function q(a,b,c){let d=await p.prepare(a,b,{srcPage:"/api/real-ai-bridge"});if(!d){b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve());return}let{query:f,params:g,prerenderManifest:h}=d;try{let c=a.method||"GET",d=(0,l.getTracer)(),e=d.getActiveScopeSpan(),i=p.instrumentationOnRequestError.bind(p),j=async e=>p.render(a,b,{query:{...f,...g},params:g,allowedRevalidateHeaderKeys:void 0,multiZoneDraftMode:!0,trustHostHeader:void 0,previewProps:h.preview,propagateError:!1,dev:p.isDev,page:"/api/real-ai-bridge",projectDir:"",onError:(...b)=>i(a,...b)}).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let f=d.getRootSpanAttributes();if(!f)return;if(f.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${f.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let g=f.get("next.route");if(g){let a=`${c} ${g}`;e.setAttributes({"next.route":g,"http.route":g,"next.span_name":a}),e.updateName(a)}else e.updateName(`${c} ${a.url}`)});e?await j(e):await d.withPropagatedContext(a.headers,()=>d.trace(m.BaseServerSpan.handleRequest,{spanName:`${c} ${a.url}`,kind:l.SpanKind.SERVER,attributes:{"http.method":c,"http.target":a.url}},j))}catch(a){if(p.isDev)throw a;(0,e.sendError)(b,500,"Internal Server Error")}finally{null==c.waitUntil||c.waitUntil.call(c,Promise.resolve())}}},5600:a=>{a.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},9646:a=>{a.exports=require("child_process")}};var b=require("../../webpack-api-runtime.js");b.C(a);var c=b.X(0,[169],()=>b(b.s=2907));module.exports=c})();