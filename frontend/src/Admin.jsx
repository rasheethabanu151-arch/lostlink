import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { api, getRole, setRole, setToken, setUsername } from "./api";

const fmt = (d) => (d ? new Date(d).toLocaleString() : "-");
const isType = (p, t) => (p.type || "").toUpperCase() === t;

function PostTable({ rows, empty }) {
  if (!rows.length) return <div className="emptyBox">{empty}</div>;
  return (
    <div className="tblWrap">
      <table className="tbl">
        <thead>
          <tr>
            <th>#</th><th>Title</th><th>Type</th><th>Category</th><th>Location</th>
            <th>Posted by</th><th>Status</th><th>Claimed by</th><th>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td><b>{p.title}</b></td>
              <td><span className={"pill " + (isType(p, "LOST") ? "pillLost" : "pillFound")}>{p.type}</span></td>
              <td>{p.category}</td>
              <td>{p.location}</td>
              <td>{p.owner}</td>
              <td>{p.status}</td>
              <td>{p.claimedBy || "-"}</td>
              <td>{fmt(p.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Admin() {
  const nav = useNavigate();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [err, setErr] = useState("");

  const load = () => {
    api("/api/admin/stats").then(setStats).catch((e) => setErr(e.message));
    api("/api/admin/posts").then(setPosts).catch(() => {});
    api("/api/admin/claim-attempts").then(setAttempts).catch(() => {});
    api("/api/admin/messages").then(setMsgs).catch(() => {});
  };
  useEffect(() => { if (getRole() === "ADMIN") load(); }, []);

  if (getRole() !== "ADMIN") return <Navigate to="/feed" replace />;

  const logout = () => { setToken(null); setUsername(null); setRole(null); nav("/"); };

  const sendReply = async (id) => {
    const text = (drafts[id] || "").trim();
    if (!text) return;
    try {
      await api("/api/admin/messages/" + id + "/reply", "POST", { reply: text });
      setDrafts({ ...drafts, [id]: "" });
      load();
    } catch (e) { setErr(e.message); }
  };

  const lost = posts.filter((p) => isType(p, "LOST"));
  const found = posts.filter((p) => isType(p, "FOUND"));
  const claimed = posts.filter((p) => (p.status || "").toUpperCase() === "CLAIMED");
  const openCount = stats ? stats.openMessages : 0;

  const tabs = [
    ["overview", "Overview"],
    ["lost", "Lost items"],
    ["found", "Found items"],
    ["claims", "Claims"],
    ["messages", "Messages" + (openCount ? " (" + openCount + ")" : "")],
  ];
  const cards = stats ? [
    ["👥", stats.users, "Users"],
    ["🔎", stats.lostPosts, "Lost posts"],
    ["📦", stats.foundPosts, "Found posts"],
    ["✅", stats.claimed, "Items claimed"],
    ["⚠️", stats.failedClaimUsers, "Failed claim users"],
    ["💬", stats.openMessages, "Open messages"],
  ] : [];

  return (
    <div>
      <div className="header">
        <span className="logo">🔗 LostLink Admin</span>
        <div className="hright">
          <span className="hi">Admin panel</span>
          <button className="link" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="wrap adminWrap">
        <div className="tabs">
          {tabs.map(([k, label]) => (
            <button key={k} className={"tab" + (tab === k ? " active" : "")} onClick={() => setTab(k)}>{label}</button>
          ))}
          <button className="tab refresh" onClick={load}>↻ Refresh</button>
        </div>
        {err && <div className="err">{err}</div>}

        {tab === "overview" && (
          <div className="statGrid">
            {cards.map(([icon, n, label]) => (
              <div className="stat" key={label}>
                <div className="statIcon">{icon}</div>
                <div className="statNum">{n}</div>
                <div className="statLabel">{label}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "lost" && <PostTable rows={lost} empty="No lost items posted yet." />}
        {tab === "found" && <PostTable rows={found} empty="No found items posted yet." />}

        {tab === "claims" && (
          <div>
            <h3 className="secTitle">Successfully claimed items</h3>
            <PostTable rows={claimed} empty="No items have been claimed yet." />
            <h3 className="secTitle">Failed claim attempts</h3>
            {attempts.length === 0 ? (
              <div className="emptyBox">No failed attempts.</div>
            ) : (
              <div className="tblWrap">
                <table className="tbl">
                  <thead><tr><th>User</th><th>Post</th><th>Failures</th><th>Locked until</th></tr></thead>
                  <tbody>
                    {attempts.map((a, i) => (
                      <tr key={i}><td>{a.user}</td><td>{a.post}</td><td>{a.failures}</td><td>{fmt(a.lockedUntil)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "messages" && (
          <div>
            <h3 className="secTitle">Received messages</h3>
            {msgs.length === 0 && <div className="emptyBox">No messages from users yet.</div>}
            {msgs.map((m) => (
              <div className="card msgCard" key={m.id}>
                <div className="msgTop">
                  <b>{m.username}</b> <span className="muted">{m.email}</span>
                  <span className={"pill " + (m.status === "OPEN" ? "pillLost" : "pillFound")}>{m.status}</span>
                  <span className="muted msgDate">{fmt(m.createdAt)}</span>
                </div>
                <p className="msgText">{m.message}</p>
                {m.reply ? (
                  <div className="replyBox"><b>Your reply</b> <span className="muted">({fmt(m.repliedAt)})</span><p>{m.reply}</p></div>
                ) : (
                  <div>
                    <textarea
                      rows={2}
                      placeholder="Type your reply..."
                      value={drafts[m.id] || ""}
                      onChange={(e) => setDrafts({ ...drafts, [m.id]: e.target.value })}
                    />
                    <button type="button" className="replyBtn" onClick={() => sendReply(m.id)}>Send reply</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
