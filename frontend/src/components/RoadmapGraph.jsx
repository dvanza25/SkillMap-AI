import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

export function RoadmapGraph({ nodes, onNodeClick }) {
  return (
    <div className="h-[500px] border rounded">
      <ReactFlow
        nodes={nodes}
        edges={nodes.slice(1).map((n, i) => ({
          id: `e${i}`,
          source: nodes[i].id,
          target: n.id,
        }))}
        onNodeClick={(_, node) => onNodeClick(node)}
        fitView
      />
    </div>
  );
}
