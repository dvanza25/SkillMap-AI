import { useEffect, useState } from "react";
import api from "../utils/axios";
import ChatPanel from "../components/ChatPanel";
import RoadmapGraph from "../components/RoadmapGraph";

export default function DashboardPage() {
  const [rfNodes, setRfNodes] = useState([]);
  const [rfEdges, setRfEdges] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("roadmap/nodes/"),
      api.get("roadmap/edges/"),
    ])
      .then(([nodesRes, edgesRes]) => {
        const nodes = Array.isArray(nodesRes.data)
          ? nodesRes.data
          : nodesRes.data.results || [];

        const edges = Array.isArray(edgesRes.data)
          ? edgesRes.data
          : edgesRes.data.results || [];

        // 🔹 Transform backend nodes → React Flow nodes
        setRfNodes(
          nodes.map((n) => ({
            id: n.node_id,
            position: { x: n.position_x, y: n.position_y },
            data: {
              label: n.label,
              xp: n.xp,
              completed: n.completed,
            },
            style: {
              background: n.completed ? "#dcfce7" : "#f9fafb",
              border: "1px solid #ccc",
              padding: 10,
              borderRadius: 8,
            },
          }))
        );

        // 🔹 Backend edges → React Flow edges
        setRfEdges(
          edges.map((e, idx) => ({
            id: `e-${idx}`,
            source: e.source,
            target: e.target,
            animated: true,
          }))
        );
      })
      .catch((err) => {
        console.error("Failed to load roadmap", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleNodeClick = async (node) => {
    setSelectedNodeId(node.id);
    try {
      await api.post(`roadmap/nodes/${node.id}/complete/`);

      setRfNodes((prev) =>
        prev.map((n) =>
          n.id === node.id
            ? {
                ...n,
                data: {
                  ...n.data,
                  completed: true,
                  xp: n.data.xp + 10,
                },
                style: {
                  ...n.style,
                  background: "#dcfce7",
                },
              }
            : n
        )
      );
    } catch (err) {
      console.error("Failed to complete node", err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Roadmap */}
      <div className="w-2/3 p-6">
        <h1 className="text-2xl font-bold mb-4">My Learning Roadmap</h1>

        {loading ? (
          <p className="text-gray-500">Loading roadmap...</p>
        ) : (
          <RoadmapGraph
            nodes={rfNodes}
            edges={rfEdges}
            onNodeClick={handleNodeClick}
          />
        )}
      </div>

      {/* AI Tutor */}
      <div className="w-1/3 border-l">
        <ChatPanel selectedNodeId={selectedNodeId} />
      </div>
    </div>
  );
}
