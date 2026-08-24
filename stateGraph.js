"use strict";

class StateGraph {
  constructor() {
    this.nodes = [];
    this.currentId = null;
    this.nextId = 1;
  }

  addState({
    game = "chess",
    timeline = "history",
    time = 0,
    parentId = this.currentId,
    action = null,
    state = null
  } = {}) {
    const node = {
      id: `state-${this.nextId++}`,
      game,
      timeline,
      time,
      parentId,
      action,
      state
    };

    this.nodes.push(node);
    this.currentId = node.id;

    return node;
  }

  getCurrent() {
    return (
      this.nodes.find(
        node => node.id === this.currentId
      ) || null
    );
  }

  getNode(id) {
    return (
      this.nodes.find(
        node => node.id === id
      ) || null
    );
  }

  getChildren(id) {
    return this.nodes.filter(
      node => node.parentId === id
    );
  }

  reset() {
    this.nodes = [];
    this.currentId = null;
    this.nextId = 1;
  }

  export() {
    return {
      version: "atlas-5d-state-v0.1",
      currentId: this.currentId,
      nodes: this.nodes
    };
  }
}

window.StateGraph = StateGraph;