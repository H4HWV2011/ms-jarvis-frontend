"use strict";(()=>{var a={};a.id=479,a.ids=[479],a.modules={5600:a=>{a.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},9575:(a,b,c)=>{c.r(b),c.d(b,{config:()=>n,default:()=>m,handler:()=>p});var d={};c.r(d),c.d(d,{default:()=>j});var e=c(9046),f=c(8667),g=c(3480),h=c(6435),i=c(9646);async function j(a,b){let{message:c,models:d=["gpt2","distilbert-sentiment","distilbert-qa"],batchSize:e=4}=a.body;if("POST"!==a.method)return b.status(405).json({error:"Method not allowed"});try{let a=`
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
prompt = "${c.replace(/"/g,'\\"')}"
jobs = [run_model.remote(m, prompt) for m in ${JSON.stringify(d)}]
results = ray.get(jobs)
print(json.dumps({'results': results}))
`,e=(0,i.spawn)("python3",["-c",a]),f="";e.stdout.on("data",a=>{f+=a.toString()}),e.stderr.on("data",a=>{f+=a.toString()}),e.on("close",a=>{try{let a=f.match(/\{[\s\S]+?\}$/m);if(a){let c=JSON.parse(a[0]);b.status(200).json({distributedResults:c.results,nodeCount:d.length,status:"Distributed Processing COMPLETE",timestamp:new Date().toISOString()})}else b.status(500).json({error:"No valid model results",output:f})}catch(a){b.status(500).json({error:"Result parse error",details:a.message,output:f})}})}catch(a){b.status(500).json({error:"Distributed coordinator error",details:a.message})}}var k=c(8112),l=c(8766);let m=(0,h.M)(d,"default"),n=(0,h.M)(d,"config"),o=new g.PagesAPIRouteModule({definition:{kind:f.A.PAGES_API,page:"/api/ensemble-distributed-coordinator",pathname:"/api/ensemble-distributed-coordinator",bundlePath:"",filename:""},userland:d,distDir:".next",projectDir:""});async function p(a,b,c){let d=await o.prepare(a,b,{srcPage:"/api/ensemble-distributed-coordinator"});if(!d){b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve());return}let{query:f,params:g,prerenderManifest:h}=d;try{let c=a.method||"GET",d=(0,k.getTracer)(),e=d.getActiveScopeSpan(),i=o.instrumentationOnRequestError.bind(o),j=async e=>o.render(a,b,{query:{...f,...g},params:g,allowedRevalidateHeaderKeys:void 0,multiZoneDraftMode:!0,trustHostHeader:void 0,previewProps:h.preview,propagateError:!1,dev:o.isDev,page:"/api/ensemble-distributed-coordinator",projectDir:"",onError:(...b)=>i(a,...b)}).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let f=d.getRootSpanAttributes();if(!f)return;if(f.get("next.span_type")!==l.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${f.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let g=f.get("next.route");if(g){let a=`${c} ${g}`;e.setAttributes({"next.route":g,"http.route":g,"next.span_name":a}),e.updateName(a)}else e.updateName(`${c} ${a.url}`)});e?await j(e):await d.withPropagatedContext(a.headers,()=>d.trace(l.BaseServerSpan.handleRequest,{spanName:`${c} ${a.url}`,kind:k.SpanKind.SERVER,attributes:{"http.method":c,"http.target":a.url}},j))}catch(a){if(o.isDev)throw a;(0,e.sendError)(b,500,"Internal Server Error")}finally{null==c.waitUntil||c.waitUntil.call(c,Promise.resolve())}}},9646:a=>{a.exports=require("child_process")}};var b=require("../../webpack-api-runtime.js");b.C(a);var c=b.X(0,[169],()=>b(b.s=9575));module.exports=c})();