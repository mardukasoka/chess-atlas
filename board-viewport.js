"use strict";
(()=>{
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  function init(target){
    if(!target||target.closest(".atlas-board-viewport"))return;
    const computed=getComputedStyle(target);
    const ratio=computed.aspectRatio&&computed.aspectRatio!=="auto"?computed.aspectRatio:"1 / 1";
    const wrapper=document.createElement("div");
    wrapper.className="atlas-board-viewport";
    wrapper.style.aspectRatio=ratio;
    const stage=document.createElement("div");
    stage.className="atlas-board-stage";
    const controls=document.createElement("div");
    controls.className="atlas-board-zoom-controls";
    controls.innerHTML='<button type="button" data-zoom="out" aria-label="Zoom out">−</button><span class="atlas-board-zoom-readout" aria-live="polite">100%</span><button type="button" data-zoom="in" aria-label="Zoom in">+</button><button type="button" data-zoom="reset">Fit</button><span class="atlas-board-zoom-help">Pinch to zoom · drag when zoomed</span>';
    target.parentNode.insertBefore(wrapper,target);
    wrapper.appendChild(stage);
    stage.appendChild(target);
    wrapper.parentNode.insertBefore(controls,wrapper.nextSibling);
    target.classList.add("atlas-zoom-target");

    let state={scale:1,x:0,y:0};
    const pointers=new Map();
    let gesture=null;
    const readout=controls.querySelector(".atlas-board-zoom-readout");
    function bounds(){const rect=wrapper.getBoundingClientRect();return{w:rect.width,h:rect.height}}
    function clampPan(){const {w,h}=bounds();const maxX=Math.max(0,(w*state.scale-w)/2),maxY=Math.max(0,(h*state.scale-h)/2);state.x=clamp(state.x,-maxX,maxX);state.y=clamp(state.y,-maxY,maxY)}
    function render(){clampPan();stage.style.transform=`translate(${state.x}px,${state.y}px) scale(${state.scale})`;readout.textContent=`${Math.round(state.scale*100)}%`}
    function setScale(next){const previous=state.scale;state.scale=clamp(next,1,3);if(state.scale===1){state.x=0;state.y=0}else if(previous>0){const ratio=state.scale/previous;state.x*=ratio;state.y*=ratio}render()}
    function reset(){state={scale:1,x:0,y:0};render()}
    controls.addEventListener("click",event=>{const action=event.target.closest("button")?.dataset.zoom;if(action==="in")setScale(state.scale+0.25);if(action==="out")setScale(state.scale-0.25);if(action==="reset")reset()});
    wrapper.addEventListener("wheel",event=>{event.preventDefault();setScale(state.scale*(event.deltaY<0?1.12:0.9))},{passive:false});
    wrapper.addEventListener("pointerdown",event=>{pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});wrapper.setPointerCapture?.(event.pointerId);if(pointers.size===1&&state.scale>1){gesture={kind:"pan",start:[event.clientX,event.clientY],origin:[state.x,state.y]}}if(pointers.size===2){const pts=[...pointers.values()];const dx=pts[0].x-pts[1].x,dy=pts[0].y-pts[1].y;gesture={kind:"pinch",distance:Math.hypot(dx,dy),scale:state.scale}}});
    wrapper.addEventListener("pointermove",event=>{if(!pointers.has(event.pointerId))return;pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});if(gesture?.kind==="pan"&&pointers.size===1&&state.scale>1){state.x=gesture.origin[0]+event.clientX-gesture.start[0];state.y=gesture.origin[1]+event.clientY-gesture.start[1];render()}else if(pointers.size>=2){const pts=[...pointers.values()].slice(0,2);const distance=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y);if(gesture?.kind!=="pinch")gesture={kind:"pinch",distance,scale:state.scale};setScale(gesture.scale*(distance/Math.max(1,gesture.distance)))}});
    function release(event){pointers.delete(event.pointerId);if(pointers.size===0)gesture=null;else if(pointers.size===1&&state.scale>1){const p=[...pointers.values()][0];gesture={kind:"pan",start:[p.x,p.y],origin:[state.x,state.y]}}}
    wrapper.addEventListener("pointerup",release);wrapper.addEventListener("pointercancel",release);
    new MutationObserver(()=>{wrapper.hidden=target.hidden;controls.hidden=target.hidden}).observe(target,{attributes:true,attributeFilter:["hidden"]});
    wrapper.hidden=target.hidden;controls.hidden=target.hidden;
    window.addEventListener("resize",render,{passive:true});
    render();
  }
  function initialise(){document.querySelectorAll("#board,#board.board,[data-atlas-zoom-board]").forEach(init)}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialise);else initialise();
  window.ChessAtlasBoardViewport=Object.freeze({init});
})();