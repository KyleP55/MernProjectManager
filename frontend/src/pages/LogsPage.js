import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import "../css/Logs.css";

import { useApi } from "../util/api";

const COLORS = [
  "#4f46e5",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#a855f7",
];

export default function LogsPage() {
  const api = useApi();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const [logs, setLogs] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await api.get(`/logs?projectId=${projectId}`)
        setLogs(res.data);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [projectId]);

  // Aggregate total time per task for the pie chart
  const chartData = useMemo(() => {
    const map = {};

    logs.forEach((log) => {
      if (!log.tasksWorkedOn?.length) return;

      const duration =
        log.timeOut
          ? (new Date(log.timeOut) - new Date(log.timeIn)) / 60000
          : 0;

      const perTask = duration / log.tasksWorkedOn.length;

      log.tasksWorkedOn.forEach((task) => {
        if (!map[task._id]) {
          map[task._id] = {
            taskId: task._id,
            name: task.name,
            value: 0,
          };
        }
        map[task._id].value += perTask;
      });
    });

    return Object.values(map).filter(d => d.value > 0);
  }, [logs]);

  const filteredLogs = selectedTaskId
    ? logs.filter((l) => l.tasksWorkedOn.some(t => t._id === selectedTaskId))
    : logs;

  if (loading) {
    return <div className="logs-loading">Loading logs...</div>;
  }

  return (
    <div className="logs-page">
      {/* LEFT: Chart */}
      <div className="logs-chart">
        <h2>Time Spent by Task</h2>
        <ResponsiveContainer width="100%" height={500}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={200}
              onClick={
                (data) => setSelectedTaskId(data.taskId)}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={formatMinutesToHours} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        {selectedTaskId && (
          <button
            className="clear-filter"
            onClick={() => setSelectedTaskId(null)}
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* RIGHT: Logs */}
      <div className="logs-list">
        <h2>Logs</h2>

        {filteredLogs.length === 0 ? (
          <p className="empty">No logs to display.</p>
        ) : (
          filteredLogs.map((log) => (
            <div key={log._id} className="log-card">
              <div className="log-header">
                <span className="task-name">
                  {log.tasksWorkedOn[0]?.name || "Unknown Task"}
                </span>
                <span className="duration">
                  {new Date(log.timeIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {" - "}
                  {log.timeOut
                    ? new Date(log.timeOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "Now"}
                  {" · Total: "}
                  {formatLogDuration(log.timeIn, log.timeOut)}
                </span>

              </div>

              {log.notes && (
                <p className="description">{log.notes}</p>
              )}

              <span className="date">
                {new Date(log.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function formatLogDuration(timeIn, timeOut) {
  if (!timeOut) return "In progress";

  const start = new Date(timeIn);
  const end = new Date(timeOut);

  const diffMs = end - start;
  const totalMinutes = Math.floor(diffMs / 60000);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;

  return `${hours}h ${minutes}m`;
}

function formatMinutesToHours(value) {
  const hours = Math.floor(value / 60);
  const minutes = Math.round(value % 60);

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

