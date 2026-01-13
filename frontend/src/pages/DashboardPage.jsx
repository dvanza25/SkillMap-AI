import { useEffect, useState } from "react";
import { api as axios } from "../api/client";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { AiChat } from "../components/AiChat";

export default function DashboardPage() {
  const [xp, setXp] = useState(0);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [completedNodes, setCompletedNodes] = useState(new Set());
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch XP
        const userRes = await axios.get("/auth/me/");
        setXp(userRes.data.xp || 0);

        // Fetch roadmap
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
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    fetchData();
  }, []);

  async function onNodeClick(_, node) {
    try {
      const res = await axios.post("/progress/complete-node/", {
        node_id: node.id,
      });

      // Update XP from response
      setXp(res.data.total_xp);

      // Update completed nodes
      if (res.data.completed) {
        setCompletedNodes((prev) => new Set([...prev, node.id]));
        alert(`✅ Completed ${node.data.label}! Earned ${res.data.earned_xp} XP`);
      } else {
        setCompletedNodes((prev) => {
          const updated = new Set(prev);
          updated.delete(node.id);
          return updated;
        });
        alert(`❌ Uncompleted ${node.data.label}! Lost ${res.data.earned_xp} XP`);
      }
    } catch (err) {
      console.error("Error completing node:", err);
      alert("❌ Error updating course status");
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-6 border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">SkillMap AI</h1>
            <p className="text-gray-600 text-sm mt-1">Master your learning journey</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
              <div className="text-gray-600 text-sm font-semibold">Total XP</div>
              <div className="text-4xl font-bold text-blue-600 mt-2">{xp}</div>
              <div className="text-gray-500 text-xs mt-2">Experience Points</div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
              <div className="text-gray-600 text-sm font-semibold">Courses</div>
              <div className="text-4xl font-bold text-green-600 mt-2">{nodes.length}</div>
              <div className="text-gray-500 text-xs mt-2">Total Courses Available</div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
              <div className="text-gray-600 text-sm font-semibold">Completed</div>
              <div className="text-4xl font-bold text-purple-600 mt-2">{completedNodes.size}</div>
              <div className="text-gray-500 text-xs mt-2">Courses Completed</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Roadmap Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Learning Roadmap</h2>
                  <p className="text-gray-600 text-sm mt-1">Click on any course to complete it and earn XP</p>
                </div>

                <div className="h-96 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  {nodes.length > 0 ? (
                    <ReactFlow
                      nodes={nodes.map((n) => ({
                        ...n,
                        style: {
                          background: completedNodes.has(n.id) ? "#10b981" : "#6366f1",
                          color: "white",
                          border: "2px solid #4f46e5",
                          borderRadius: "8px",
                          padding: "10px",
                          fontWeight: "600",
                          fontSize: "12px",
                          cursor: "pointer",
                        },
                      }))}
                      edges={edges}
                      fitView
                      onNodeClick={onNodeClick}
                    >
                      <Background />
                      <Controls />
                    </ReactFlow>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      Loading roadmap...
                    </div>
                  )}
                </div>
              </div>

              {/* Tips Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">💡 Quick Tips</h3>
                  <ul className="text-sm space-y-2">
                    <li>✓ Click on courses to complete them</li>
                    <li>✓ Earn XP points for each course</li>
                    <li>✓ Track your progress in real-time</li>
                    <li>✓ Follow the recommended learning path</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">🎯 Your Progress</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completion Rate</span>
                        <span>{nodes.length > 0 ? Math.round((completedNodes.size / nodes.length) * 100) : 0}%</span>
                      </div>
                      <div className="w-full bg-white rounded-full h-2">
                        <div
                          className="bg-green-400 h-2 rounded-full transition-all"
                          style={{
                            width: `${nodes.length > 0 ? (completedNodes.size / nodes.length) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Chat Sidebar */}
            <div className="lg:col-span-1">
              <div className="h-full sticky top-6">
                <AiChat />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
