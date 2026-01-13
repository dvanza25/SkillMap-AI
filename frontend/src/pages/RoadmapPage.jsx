import { useEffect, useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import { api as axios } from "../api/client";

export default function RoadmapPage() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    async function loadRoadmap() {
      const [nodesRes, edgesRes] = await Promise.all([
        axios.get("/roadmap/nodes/"),
        axios.get("/roadmap/edges/"),
      ]);

      setNodes(
        nodesRes.data.map((n) => ({
          id: n.node_id,
          data: { label: `${n.label} (+${n.xp} XP)` },
          position: { x: n.position_x, y: n.position_y },
        }))
      );

      setEdges(
        edgesRes.data.map((e, idx) => ({
          id: `e-${idx}`,
          source: e.source,
          target: e.target,
        }))
      );
    }

    loadRoadmap();
  }, []);

  async function onNodeClick(_, node) {
    await axios.post("/progress/complete-node/", {
      node_id: node.id,
    });

    alert(`Completed ${node.data.label}`);
  }

  return (
    <div className="h-[80vh] border rounded-md">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onNodeClick={onNodeClick}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
