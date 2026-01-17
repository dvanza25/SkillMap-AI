import { useEffect, useState } from "react";
import api from "../utils/axios";
import ChatPanel from "../components/ChatPanel";
import RoadmapGraph from "../components/RoadmapGraph";

export default function DashboardPage() {
  const [rfNodes, setRfNodes] = useState([]);
  const [rfEdges, setRfEdges] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 📊 Progress calculations
  const totalCourses = rfNodes.length;
  const completedCourses = rfNodes.filter(n => n.data.completed).length;

  const progressPercent =
    totalCourses === 0
      ? 0
      : Math.round((completedCourses / totalCourses) * 100);

  const totalXP = rfNodes
    .filter(n => n.data.completed)
    .reduce((sum, n) => sum + (n.data.xp || 0), 0);

  // 🔹 Load roadmap
  useEffect(() => {
    Promise.all([
      api.get("roadmap/nodes/"),
      api.get("roadmap/edges/"),
    ])
      .then(([nodesRes, edgesRes]) => {
        const nodes = nodesRes.data.results || nodesRes.data || [];
        const edges = edgesRes.data.results || edgesRes.data || [];

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
              background: "#f9fafb", // selection handled separately
              border: "1px solid #ccc",
              padding: 10,
              borderRadius: 8,
            },
          }))
        );

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

  // 🧠 Select node for AI Tutor (ONLY ONE)
  const handleNodeSelect = (node) => {
    setSelectedNodeId(node.id);

    setRfNodes((prev) =>
      prev.map((n) => ({
        ...n,
        style: {
          ...n.style,
          background:
            n.id === node.id ? "#dcfce7" : "#f9fafb",
        },
      }))
    );
  };

  // ✅ Toggle checklist completion (BACKEND SYNCED)
  const toggleCourseCompletion = async (nodeId) => {
    try {
      const res = await api.post(
        `roadmap/nodes/${nodeId}/toggle/`
      );

      const { completed } = res.data;

      setRfNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  completed,
                },
              }
            : n
        )
      );
    } catch (err) {
      console.error("Failed to toggle completion", err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* LEFT: Roadmap */}
      <div className="w-2/3 p-6 space-y-6 overflow-y-auto">
        <h1 className="text-2xl font-bold">My Learning Roadmap</h1>

        {/* 📊 Progress Summary */}
        <div className="bg-white p-4 rounded shadow space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded h-3">
            <div
              className="bg-green-500 h-3 rounded transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="text-sm text-gray-600">
            Completed {completedCourses} of {totalCourses} courses
          </div>

          <div className="font-semibold text-green-700">
            Total XP: {totalXP}
          </div>
        </div>

        {/* ✅ Checklist */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Course Checklist</h2>

          <ul className="space-y-2">
            {rfNodes.map((node) => (
              <li
                key={node.id}
                className="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={node.data.completed}
                  onChange={() =>
                    toggleCourseCompletion(node.id)
                  }
                />

                <span
                  className={
                    node.data.completed
                      ? "line-through text-gray-500"
                      : ""
                  }
                >
                  {node.data.label}
                </span>

                <span className="text-xs text-gray-500 ml-auto">
                  +{node.data.xp} XP
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* 🗺 React Flow */}
        {loading ? (
          <p className="text-gray-500">Loading roadmap...</p>
        ) : (
          <RoadmapGraph
            nodes={rfNodes}
            edges={rfEdges}
            onNodeClick={handleNodeSelect}
          />
        )}
      </div>

      {/* RIGHT: AI Tutor */}
      <div className="w-1/3 border-l">
        <ChatPanel selectedNodeId={selectedNodeId} />
      </div>
    </div>
  );
}
