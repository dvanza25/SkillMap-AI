import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

export default function RoadmapGraph({ nodes, edges, onNodeClick }) {
  return (
    <div className="h-[500px] border rounded bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={(_, node) => onNodeClick(node)}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
