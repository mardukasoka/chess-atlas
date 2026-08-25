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


  goBack() {
    const current =
      this.getCurrent();

    if (
      !current ||
      current.parentId === null
    ) {
      return null;
    }

    const parent =
      this.getNode(
        current.parentId
      );

    if (!parent) {
      return null;
    }

    this.currentId =
      parent.id;

    return parent;
  }


  reset() {
    this.nodes = [];
    this.currentId = null;
    this.nextId = 1;
  }

load(data) {
  if (
    !data ||
    data.version !==
      "atlas-5d-state-v0.1" ||
    !Array.isArray(data.nodes)
  ) {
    return false;
  }

  this.nodes =
    data.nodes;

  this.currentId =
    data.currentId;

  this.nextId =
    this.nodes.reduce(
      (max, node) => {
        const number =
          Number(
            String(node.id)
              .replace(
                "state-",
                ""
              )
          );

        return Math.max(
          max,
          number + 1
        );
      },
      1
    );

  return true;
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