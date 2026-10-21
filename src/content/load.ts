import {validateContent,type Validation} from './validate';
import type {ContentBundle} from './schema';
export type Loaded={ok:true;content:ContentRepository;report:Validation}|{ok:false;report:Validation};
/** Parses an untrusted file atomically. Never modifies the caller's active bundle. */
export function loadContent(text:string):Loaded{
 if(new TextEncoder().encode(text).length>5*1024*1024)return {ok:false,report:{ok:false,issues:[{severity:'error',code:'file-size',path:'',message:'Content exceeds 5 MiB.'}],coverage:{expected:0,included:0,missing:[]}}};
 let raw:unknown;try{raw=JSON.parse(text)}catch{return {ok:false,report:{ok:false,issues:[{severity:'error',code:'json',path:'',message:'Invalid JSON file.'}],coverage:{expected:0,included:0,missing:[]}}}}
 const report=validateContent(raw);
 if(!report.ok||!report.bundle)return {ok:false,report};
 return {ok:true,content:new ContentRepository(report.bundle),report};
}
export class ContentRepository{
 private readonly data:ContentBundle;
 constructor(bundle:ContentBundle){this.data=structuredClone(bundle)}
 snapshot(){return structuredClone(this.data)}
 getVocabulary(id:string){return structuredClone(this.data.vocabulary.find(v=>v.id===id))}
 getMicroLessons(lessonId:string){const l=this.data.lessons.find(x=>x.id===lessonId);return structuredClone(l?.microLessonIds.map(mid=>this.data.microLessons.find(m=>m.id===mid)!)??[])}
 findOriginalExercise(lessonNumber:number,exerciseNumber:string,itemNumber:number){const normalized=exerciseNumber.replace(/[·-]/g,'.');return structuredClone(this.data.exercises.find(e=>e.source?.lessonNumber===lessonNumber&&e.source.exerciseNumber.replace(/[·-]/g,'.')===normalized&&e.source.itemNumber===itemNumber))}
 getAnswer(exerciseId:string){return structuredClone(this.data.answerKeys.find(a=>a.exerciseId===exerciseId))}
 getPronunciation(frenchTextId:string){const text=this.data.frenchTexts.find(t=>t.id===frenchTextId);if(!text)return undefined;return structuredClone({text:text.text,asset:this.data.audioAssets.find(a=>a.id===text.audioAssetId)})}
}
