import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

export default function RoadmapGraph({
  nodes,
  edges,
  selectedNodeId,
  onNodeClick,
}) {
  const styledNodes = nodes.map((n) => {
    let background = "#f3f4f6"; // normal (light gray)
    let borderColor = "#e5e7eb";
    let borderWidth = "2px";
    let color = "#1f2937";

    if (n.id === selectedNodeId) {
      background = "#3b82f6"; // selected (blue)
      borderColor = "#1d4ed8";
      borderWidth = "3px";
      color = "#ffffff";
    } else if (n.data.completed) {
      background = "#10b981"; // completed (green)
      borderColor = "#059669";
      borderWidth = "2px";
      color = "#ffffff";
    }

    return {
      ...n,
      style: {
        background,
        border: `${borderWidth} solid ${borderColor}`,
        padding: "15px",
        borderRadius: "12px",
        cursor: "pointer",
        color,
        fontWeight: "600",
        fontSize: "14px",
        boxShadow: n.id === selectedNodeId ? "0 4px 20px rgba(59, 130, 246, 0.4)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        whiteSpace: "normal",
        textAlign: "center",
        minWidth: "100px",
      },
    };
  });

  return (
    <div className="h-[500px] rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden shadow-lg border border-gray-200">
      <ReactFlow
        nodes={styledNodes}
        edges={edges}
        onNodeClick={(_, node) => onNodeClick(node)}
        fitView
      >
        <Background color="#d1d5db" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
