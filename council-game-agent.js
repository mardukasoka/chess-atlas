"use strict";

/*
 * Constrained Council/LLM chooser for Chess Atlas.
 *
 * The model never supplies executable game state or a free-form move. It sees
 * a compact snapshot plus numbered legal-action descriptions and must return
 * one supplied action id. That id is mapped back to the original action object
 * so game-agents.js and the authoritative rules module remain the final gate.
 */
(function(root,factory){const api=factory();if(typeof module!=="undefined"&&module.exports)module.exports=api;if(root)root.ChessAtlasCouncilGameAgent=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  const MAX_ACTIONS=512;
  const MAX_EXPLANATION=800;

  function safeClone(value,depth=0){
    if(depth>6)return "[truncated]";
    if(value==null||typeof value==="string"||typeof value==="number"||typeof value==="boolean")return value;
    if(Array.isArray(value))return value.slice(0,128).map(v=>safeClone(v,depth+1));
    if(typeof value==="object"){
      const out={};
      for(const [key,val] of Object.entries(value)){
        if(typeof val==="function")continue;
        if(["enginePosition","position"].includes(key)&&typeof val==="string"&&val.length>600){out[key]=val.slice(0,600);continue;}
        out[key]=safeClone(val,depth+1);
      }
      return out;
    }
    return String(value);
  }

  function describeAction(action,index){
    const copy=safeClone(action);
    if(copy&&typeof copy==="object"){
      delete copy.actor;
      delete copy.engineMove;
      delete copy.uci;
      delete copy.move;
    }
    return Object.freeze({id:`a${index}`,action:copy});
  }

  function parseDecision(value){
    if(typeof value==="string"){
      const text=value.trim();
      try{return parseDecision(JSON.parse(text));}catch(_){
        const match=text.match(/\ba(\d+)\b/i);
        return match?{actionId:`a${Number(match[1])}`,explanation:text}:null;
      }
    }
    if(!value||typeof value!=="object")return null;
    const raw=value.actionId??value.action_id??value.id??value.choice;
    let actionId=null;
    if(typeof raw==="number"&&Number.isInteger(raw)&&raw>=0)actionId=`a${raw}`;
    else if(typeof raw==="string"&&/^a\d+$/i.test(raw.trim()))actionId=raw.trim().toLowerCase();
    const explanation=typeof value.explanation==="string"?value.explanation.slice(0,MAX_EXPLANATION):typeof value.reason==="string"?value.reason.slice(0,MAX_EXPLANATION):"";
    return actionId?{actionId,explanation}:null;
  }

  function create(options={}){
    const transport=options.transport;
    if(!transport||typeof transport.choose!=="function")throw new TypeError("Council game agent requires choose transport");
    let lastDecision=null;
    return Object.freeze({
      id:options.id||"council",
      name:options.name||"AI Council",
      kind:"council",
      getLastDecision(){return lastDecision;},
      async chooseAction(context){
        const legal=Array.isArray(context?.legalActions)?context.legalActions:[];
        if(!legal.length){lastDecision=null;return null;}
        if(legal.length>MAX_ACTIONS)throw new Error(`Council action set exceeds ${MAX_ACTIONS}`);
        const offered=legal.map(describeAction);
        const request=Object.freeze({
          protocol:"chess-atlas/legal-choice-v1",
          gameId:String(context?.gameId||"unknown"),
          instruction:"Choose exactly one actionId from actions. Do not invent a move. Return JSON with actionId and optional explanation.",
          snapshot:safeClone(context?.snapshot||null),
          actions:offered
        });
        const parsed=parseDecision(await transport.choose(request));
        if(!parsed)throw new Error("Council returned no valid action id");
        const index=Number(parsed.actionId.slice(1));
        if(!Number.isInteger(index)||index<0||index>=legal.length)throw new Error(`Council selected action outside legalActions: ${parsed.actionId}`);
        lastDecision=Object.freeze({actionId:parsed.actionId,explanation:parsed.explanation||""});
        return legal[index];
      }
    });
  }

  return Object.freeze({MAX_ACTIONS,safeClone,describeAction,parseDecision,create});
});
