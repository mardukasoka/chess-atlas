"use strict";

const WorkerTransport=require("./stockfish-worker.js");

function fakeWorker(){
  const listeners={};
  return {
    sent:[],
    terminated:false,
    postMessage(message){this.sent.push(message);},
    addEventListener(type,handler){listeners[type]=handler;},
    emit(type,data){listeners[type]?.(data);},
    terminate(){this.terminated=true;}
  };
}

test("worker transport forwards UCI commands and resolves bestmove",async()=>{
  const worker=fakeWorker();
  const transport=WorkerTransport.createWorkerTransport({worker,timeoutMs:1000});
  transport.send("position startpos");
  const pending=transport.waitForBestmove();
  worker.emit("message",{data:"info depth 4 score cp 20"});
  worker.emit("message",{data:"bestmove e2e4 ponder e7e5"});
  await expect(pending).resolves.toBe("bestmove e2e4 ponder e7e5");
  expect(worker.sent).toEqual(["position startpos"]);
});

test("worker transport supports stop and disposal",()=>{
  const worker=fakeWorker();
  const transport=WorkerTransport.createWorkerTransport({worker});
  transport.stop();
  transport.dispose();
  expect(worker.sent).toEqual(["stop"]);
  expect(worker.terminated).toBe(true);
});

test("worker transport rejects overlapping searches",async()=>{
  const worker=fakeWorker();
  const transport=WorkerTransport.createWorkerTransport({worker,timeoutMs:1000});
  const first=transport.waitForBestmove();
  await expect(transport.waitForBestmove()).rejects.toThrow(/already pending/);
  worker.emit("message",{data:"bestmove d2d4"});
  await expect(first).resolves.toBe("bestmove d2d4");
});
