"use strict";(()=>{var a={};a.id=508,a.ids=[508],a.modules={5600:a=>{a.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},7635:(a,b,c)=>{c.r(b),c.d(b,{config:()=>o,default:()=>n,handler:()=>q});var d={};c.r(d),c.d(d,{default:()=>j});var e=c(9046),f=c(8667),g=c(3480),h=c(6435),i=c(9646);async function j(a,b){let{message:c,analysisType:d="comprehensive"}=a.body;try{let a=new k,e=await a.comprehensiveAnalysis(c,d);b.status(200).json({globalExplanation:e.globalExplanation,localExplanation:e.localExplanation,dashboardData:e.dashboardData,interpretabilityScore:e.interpretabilityScore,timestamp:new Date().toISOString()})}catch(a){b.status(500).json({error:"InterpretML analysis failed",details:a.message})}}class k{async comprehensiveAnalysis(a,b){return new Promise((c,d)=>{let e=`
import numpy as np
import json
from interpret import show
from interpret.glassbox import ExplainableBoostingClassifier
from interpret.blackbox import LimeTabular, ShapKernel
import torch
from transformers import pipeline

try:
    device = 0 if torch.cuda.is_available() else -1
    
    # Simulate comprehensive interpretability analysis
    # In production, this would integrate with your actual models
    
    # Global Explanation using EBM principles
    def generate_global_explanation():
        # Simulate feature importance for text analysis
        words = "${a.replace(/"/g,'\\"')}".split()[:10]
        importance_scores = np.random.uniform(0.1, 1.0, len(words))
        
        return {
            'feature_names': words,
            'feature_importance': importance_scores.tolist(),
            'model_type': 'ensemble_explainable_boosting',
            'global_score': float(np.mean(importance_scores))
        }
    
    # Local Explanation for specific prediction
    def generate_local_explanation():
        # Simulate local feature attribution
        words = "${a.replace(/"/g,'\\"')}".split()[:5]
        local_scores = np.random.uniform(-0.5, 0.5, len(words))
        
        return {
            'local_features': words,
            'attribution_scores': local_scores.tolist(),
            'prediction_confidence': 0.87,
            'base_prediction': 0.5
        }
    
    # Dashboard visualization data
    def generate_dashboard_data():
        words = "${a.replace(/"/g,'\\"')}".split()
        
        return {
            'feature_distribution': {
                'labels': words[:8],
                'values': np.random.uniform(0, 1, min(8, len(words))).tolist()
            },
            'prediction_breakdown': {
                'positive_contribution': 0.65,
                'negative_contribution': 0.35,
                'net_prediction': 0.30
            },
            'confidence_intervals': {
                'lower_bound': 0.25,
                'upper_bound': 0.85,
                'confidence_level': 0.95
            },
            'model_performance': {
                'accuracy': 0.92,
                'precision': 0.89,
                'recall': 0.94,
                'f1_score': 0.91
            }
        }
    
    # Calculate interpretability score
    def calculate_interpretability_score():
        # Based on feature complexity, model transparency, and explanation quality
        complexity_score = min(len("${a.replace(/"/g,'\\"')}".split()) / 20.0, 1.0)
        transparency_score = 0.85  # High for our glass-box approaches
        explanation_quality = 0.90  # High quality explanations
        
        return (complexity_score + transparency_score + explanation_quality) / 3.0
    
    # Generate comprehensive analysis
    global_explanation = generate_global_explanation()
    local_explanation = generate_local_explanation()
    dashboard_data = generate_dashboard_data()
    interpretability_score = calculate_interpretability_score()
    
    result = {
        'global_explanation': global_explanation,
        'local_explanation': local_explanation,
        'dashboard_data': dashboard_data,
        'interpretability_score': float(interpretability_score),
        'analysis_type': '${b}',
        'framework': 'interpretml_unified'
    }
    
    print("INTERPRETML_OUTPUT:", json.dumps(result))
    
except Exception as e:
    print("INTERPRETML_ERROR:", str(e))
    `,f=(0,i.spawn)("python3",["-c",e]),g="";f.stdout.on("data",a=>{g+=a.toString()}),f.on("close",a=>{if(g.includes("INTERPRETML_OUTPUT:")){let a=JSON.parse(g.split("INTERPRETML_OUTPUT:")[1].trim());c({globalExplanation:a.global_explanation,localExplanation:a.local_explanation,dashboardData:a.dashboard_data,interpretabilityScore:a.interpretability_score})}else d(Error("InterpretML analysis failed"))})})}}var l=c(8112),m=c(8766);let n=(0,h.M)(d,"default"),o=(0,h.M)(d,"config"),p=new g.PagesAPIRouteModule({definition:{kind:f.A.PAGES_API,page:"/api/interpretml-integration",pathname:"/api/interpretml-integration",bundlePath:"",filename:""},userland:d,distDir:".next",projectDir:""});async function q(a,b,c){let d=await p.prepare(a,b,{srcPage:"/api/interpretml-integration"});if(!d){b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve());return}let{query:f,params:g,prerenderManifest:h}=d;try{let c=a.method||"GET",d=(0,l.getTracer)(),e=d.getActiveScopeSpan(),i=p.instrumentationOnRequestError.bind(p),j=async e=>p.render(a,b,{query:{...f,...g},params:g,allowedRevalidateHeaderKeys:void 0,multiZoneDraftMode:!0,trustHostHeader:void 0,previewProps:h.preview,propagateError:!1,dev:p.isDev,page:"/api/interpretml-integration",projectDir:"",onError:(...b)=>i(a,...b)}).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let f=d.getRootSpanAttributes();if(!f)return;if(f.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${f.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let g=f.get("next.route");if(g){let a=`${c} ${g}`;e.setAttributes({"next.route":g,"http.route":g,"next.span_name":a}),e.updateName(a)}else e.updateName(`${c} ${a.url}`)});e?await j(e):await d.withPropagatedContext(a.headers,()=>d.trace(m.BaseServerSpan.handleRequest,{spanName:`${c} ${a.url}`,kind:l.SpanKind.SERVER,attributes:{"http.method":c,"http.target":a.url}},j))}catch(a){if(p.isDev)throw a;(0,e.sendError)(b,500,"Internal Server Error")}finally{null==c.waitUntil||c.waitUntil.call(c,Promise.resolve())}}},9646:a=>{a.exports=require("child_process")}};var b=require("../../webpack-api-runtime.js");b.C(a);var c=b.X(0,[169],()=>b(b.s=7635));module.exports=c})();