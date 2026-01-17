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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🗺️</span>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Complete Learning Roadmap
              </h1>
              <p className="text-gray-600 text-sm mt-1">Click on any node to mark it as completed</p>
            </div>
          </div>
        </div>

        {/* Roadmap Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Skill Development Path</h2>
                <p className="text-sm text-gray-600">Interactive learning flow with completion tracking</p>
              </div>
              <div className="text-4xl">✨</div>
            </div>
          </div>
          
          <div className="h-[75vh] bg-white">
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
        </div>

        {/* Info Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium">💡 Tip</p>
            <p className="text-gray-700 mt-2 text-sm">Click on any topic to mark it as completed and track your progress</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium">🎯 Goal</p>
            <p className="text-gray-700 mt-2 text-sm">Complete all courses to master the skill and earn XP</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm font-medium">🚀 Progress</p>
            <p className="text-gray-700 mt-2 text-sm">Go back to dashboard to see detailed progress and get AI help</p>
          </div>
        </div>
      </div>
    </div>
  );
}
