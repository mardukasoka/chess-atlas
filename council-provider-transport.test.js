const Bridge=require('./council-provider-transport.js');
const Council=require('./council-game-agent.js');

describe('Council provider transport',()=>{
  test('converts a legal-choice request into the WebLLM Council participant contract',async()=>{
    const participant={id:'local-test',runtime:'webllm'};
    const generate=jest.fn(async ({participant:seen,transcript,round})=>{
      expect(seen).toBe(participant);
      expect(round).toBe(1);
      expect(transcript).toHaveLength(1);
      expect(transcript[0].role).toBe('user');
      expect(transcript[0].content).toContain('Chess Atlas legal-choice task.');
      expect(transcript[0].content).toContain('"id":"a0"');
      return {content:'{"actionId":"a0","explanation":"only legal move"}'};
    });
    const transport=Bridge.create({generateCouncilParticipant:generate,participant});
    const agent=Council.create({transport});
    const legal=[{type:'move',from:[0,0],to:[0,1]}];
    await expect(agent.chooseAction({gameId:'test',snapshot:{turn:'white'},legalActions:legal})).resolves.toBe(legal[0]);
    expect(generate).toHaveBeenCalledTimes(1);
  });

  test('does not store provider credentials or require a provider-specific runtime',()=>{
    const participant={id:'remote-choice',runtime:'anything'};
    const transport=Bridge.create({participant,generate:async()=>'{"actionId":"a0"}'});
    expect(transport.participant).toBe(participant);
    expect(Object.keys(transport)).toEqual(['participant','choose']);
  });

  test('rejects empty provider output',async()=>{
    const transport=Bridge.create({participant:{id:'x'},generate:async()=>({content:'   '})});
    await expect(transport.choose({protocol:'chess-atlas/legal-choice-v1',gameId:'go',instruction:'choose',snapshot:{},actions:[]})).rejects.toThrow('empty legal-choice response');
  });

  test('rejects unrelated request protocols',()=>{
    expect(()=>Bridge.requestToUserMessage({protocol:'other'})).toThrow('Unsupported Council game request');
  });
});
