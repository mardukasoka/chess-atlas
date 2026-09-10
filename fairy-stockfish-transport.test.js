const T=require('./fairy-stockfish-transport.js');

describe('Fairy-Stockfish external transport',()=>{
  test('pthread capability requires WASM, Worker, SharedArrayBuffer and isolation',()=>{
    const good={WebAssembly:{},Worker:function(){},SharedArrayBuffer:function(){},crossOriginIsolated:true};
    expect(T.readyForPthreads(good)).toBe(true);
    expect(T.readyForPthreads({...good,crossOriginIsolated:false})).toBe(false);
  });

  test('factory remains lazy and receives variant position search commands',async()=>{
    let created=0;const listeners=[];const sent=[];
    const engine={
      postMessage(command){sent.push(command);if(command.startsWith('go '))setTimeout(()=>listeners.slice().forEach(fn=>fn('bestmove a4a5')),0);},
      addMessageListener(fn){listeners.push(fn);},
      removeMessageListener(fn){const i=listeners.indexOf(fn);if(i>=0)listeners.splice(i,1);},
      terminate(){}
    };
    const transport=T.create({factory:async()=>{created++;return engine;},timeoutMs:1000,env:{}});
    expect(created).toBe(0);expect(transport.loaded).toBe(false);
    await expect(transport.bestMove({variant:'xiangqi',position:'fen-data',search:'go depth 4'})).resolves.toBe('a4a5');
    expect(created).toBe(1);expect(transport.loaded).toBe(true);
    expect(sent).toEqual(['setoption name UCI_Variant value xiangqi','position fen fen-data','go depth 4']);
  });
});
