"use strict";

/*
 * Provider-agnostic bridge from Chess Atlas legal-choice requests to the
 * existing WebLLM Council participant contract.
 *
 * The actual provider function is injected. Chess Atlas therefore has no
 * dependency on WebLLM, Anthropic, or a remote API client and stores no keys.
 */
(function(root,factory){const api=factory();if(typeof module!=="undefined"&&module.exports)module.exports=api;if(root)root.ChessAtlasCouncilProviderTransport=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  function compactJson(value){return JSON.stringify(value);}

  function requestToUserMessage(request){
    if(!request||request.protocol!=="chess-atlas/legal-choice-v1")throw new TypeError("Unsupported Council game request");
    return [
      "Chess Atlas legal-choice task.",
      `Game: ${request.gameId}.`,
      request.instruction,
      `Snapshot: ${compactJson(request.snapshot)}`,
      `Legal actions: ${compactJson(request.actions)}`,
      "Return only JSON, for example: {\"actionId\":\"a0\",\"explanation\":\"brief reason\"}."
    ].join("\n");
  }

  function extractContent(result){
    if(typeof result==="string")return result;
    if(result&&typeof result.content==="string")return result.content;
    if(result&&result.message&&typeof result.message.content==="string")return result.message.content;
    if(result&&typeof result.raw==="string")return result.raw;
    return "";
  }

  function create(options={}){
    const generate=options.generateCouncilParticipant||options.generate;
    const participant=options.participant;
    if(typeof generate!=="function")throw new TypeError("Council provider transport requires generateCouncilParticipant");
    if(!participant||typeof participant!=="object")throw new TypeError("Council provider transport requires participant");
    return Object.freeze({
      participant,
      async choose(request){
        const transcript=[{role:"user",content:requestToUserMessage(request)}];
        const result=await generate({
          participant,
          transcript,
          round:Number.isFinite(options.round)?options.round:1,
          signal:options.signal||null
        });
        const content=extractContent(result).trim();
        if(!content)throw new Error("Council participant returned an empty legal-choice response");
        return content;
      }
    });
  }

  return Object.freeze({requestToUserMessage,extractContent,create});
});
