import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from "@xyflow/react";
import { produce } from "immer";
import { nanoid } from "nanoid";
import { create } from "zustand";

import { BuilderNodeType } from "@/components/flow-builder/components/blocks/types";
import { Tag } from "@/types/tag";

interface State {
  nodes: Node[];
  edges: Edge[];
  sidebar: {
    active: "node-properties" | "available-nodes" | "console" | "none";
    panels: {
      nodeProperties: {
        selectedNode: { id: string; type: BuilderNodeType } | null | undefined;
      };
    };
  };
}

interface Actions {
  actions: {
    addLog: any;
    clearLog: any;
    saveWorkflow: () => {
      id: string;
      name: string;
      nodes: Node[];
      edges: Edge[];
    };
    setWorkflow: (workflow: IFlowState["workflow"]) => void;
    nodes: {
      onNodesChange: (changes: NodeChange[]) => void;
      setNodes: (nodes: Node[]) => void;
      deleteNode: (node: Node) => void;
    };
    edges: {
      onEdgesChange: (changes: EdgeChange[]) => void;
      onConnect: (connection: Connection) => void;
      setEdges: (edges: Edge[]) => void;
      deleteEdge: (edge: Edge) => void;
    };
    sidebar: {
      setActivePanel: (
        panel: "node-properties" | "available-nodes" | "console" | "none"
      ) => void;
      showNodePropertiesOf: (node: {
        id: string;
        type: BuilderNodeType;
      }) => void;
      panels: {
        nodeProperties: {
          setSelectedNode: (
            node: { id: string; type: BuilderNodeType } | undefined | null
          ) => void;
        };
        tags: {
          setTags: (tags: Tag[]) => void;
          createTag: (tag: Tag) => void;
          deleteTag: (tag: Tag) => void;
          updateTag: (tag: Tag, newTag: Tag) => void;
        };
      };
    };
  };
}

export interface IFlowState {
  logs: any;
  tags: Tag[];
  workflow: {
    id: string;
    name: string;
  } & State;
  actions: Actions["actions"];
}

const TAGS = [
  {
    value: "oauth",
    label: "Oauth",
    color: "#ef4444",
  },
  {
    value: "contacts",
    label: "Contacts",
    color: "#ef4444",
  },
  {
    value: "companies",
    label: "Companies",
    color: "#ef4444",
  },
  {
    value: "leads",
    label: "Leads",
    color: "#eab308",
  },
] satisfies Tag[];

export const useFlowStore = create<IFlowState>()((set, get) => ({
  tags: TAGS,
  workflow: {
    id: nanoid(),
    name: "",
    edges: [],
    nodes: [],
    sidebar: {
      active: "none",
      panels: {
        nodeProperties: {
          selectedNode: null,
        },
      },
    },
  },
  logs: [], 
  actions: {
    saveWorkflow: () => {
      const { workflow } = get();
      set({ workflow });
      return workflow;
    },
    setWorkflow: (workflow: IFlowState["workflow"]) => {
      set((state) => ({
        workflow: {
          ...state.workflow,
          ...workflow,
        },
      }));
    },
    addLog: (message: string) => {
      set((state) => ({
        logs: [...state.logs, message], // Append new log message
      }));
    },
    clearLog: () => {
      set((state) => ({
        logs: [],
      }));
    },
    sidebar: {
      setActivePanel: (panel: "node-properties" | "available-nodes" | "console" | "none") =>
        set((state) => ({
          workflow: {
            ...state.workflow,
            sidebar: { ...state.workflow.sidebar, active: panel },
          },
        })),
      showNodePropertiesOf: (node: { id: string; type: BuilderNodeType }) => {
        set((state) => ({
          workflow: {
            ...state.workflow,
            sidebar: {
              ...state.workflow.sidebar,
              active: "node-properties",
              panels: {
                ...state.workflow.sidebar.panels,
                nodeProperties: {
                  ...state.workflow.sidebar.panels.nodeProperties,
                  selectedNode: node,
                },
              },
            },
          },
        }));
      },
      panels: {
        nodeProperties: {
          setSelectedNode: (
            node: { id: string; type: BuilderNodeType } | undefined | null
          ) =>
            set((state) => ({
              workflow: {
                ...state.workflow,
                sidebar: {
                  ...state.workflow.sidebar,
                  panels: {
                    ...state.workflow.sidebar.panels,
                    nodeProperties: {
                      ...state.workflow.sidebar.panels.nodeProperties,
                      selectedNode: node,
                    },
                  },
                },
              },
            })),
        },
        tags: {
          setTags: (tags: Tag[]) => set({ tags }),
          createTag: (tag: Tag) =>
            set((state) => ({
              tags: [...state.tags, tag],
            })),
          updateTag: (tag: Tag, newTag: Tag) =>
            set((state) => ({
              tags: state.tags.map((f) => (f.value === tag.value ? newTag : f)),
            })),
          deleteTag: (tag: Tag) =>
            set((state) => ({
              tags: state.tags.filter((f) => f.value !== tag.value),
            })),
        },
      },
    },
    nodes: {
      onNodesChange: (changes) => {
        set((state) =>
          produce(state, (draft) => {
            const updatedNodes = applyNodeChanges(
              changes,
              draft.workflow.nodes
            );

            draft.workflow.nodes = updatedNodes;
          })
        );
      },
      setNodes: (nodes) => {
        set({ workflow: { ...get().workflow, nodes } });
      },
      deleteNode: (node: Node) => {
        set((state) => ({
          workflow: {
            ...state.workflow,
            nodes: state.workflow.nodes.filter((n) => n.id !== node.id),
          },
        }));
      },
    },
    edges: {
      onEdgesChange: (changes) => {
        set((state) =>
          produce(state, (draft) => {
            const updatedEdges = applyEdgeChanges(
              changes,
              draft.workflow.edges
            );

            draft.workflow.edges = updatedEdges;
          })
        );
      },
      onConnect: (connection) => {
        const edge = { ...connection, id: nanoid(), type: "deletable" } as Edge;
        set({
          workflow: {
            ...get().workflow,
            edges: addEdge(edge, get().workflow.edges),
          },
        });
      },
      setEdges: (edges) => {
        set({ workflow: { ...get().workflow, edges } });
      },
      deleteEdge: (edge: Edge) => {
        set((state) => ({
          workflow: {
            ...state.workflow,
            edges: state.workflow.edges.filter((e) => e.id !== edge.id),
          },
        }));
      },
    },
  },
}));
