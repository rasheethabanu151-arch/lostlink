import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useParams } from "react-router-dom";
import { api, getToken, setToken, getUsername, setUsername } from "./api";

const CATEGORIES = ["Phone", "Wallet", "Keys", "Bag", "Documents", "Other"];
const ICONS = { Phone: "📱", Wallet: "👛", Keys: "🔑", Bag: "🎒", Documents: "🪪", Other: "📦" };

function Protected({ children }) {
  return getToken() ? children : <Navigate to="/" replace />;
}

function Header() {
  const nav = useNavigate();
  return (
    <div className="header">
      <Link to="/feed" className="logo">🔗 LostLink</Link>
      <div className="hright">
        <span className="hi">Hi, {getUsername()}</span>
        <Link to="/my-posts" className="link navlink">My Posts</Link>
        <button className="link" onClick={() => { setToken(null); setUsername(null); nav("/"); }}>Logout</button>
      </div>
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="pwwrap">
      <input type={show ? "text" : "password"} placeholder={placeholder} value={value} onChange={onChange} />
      <button type="button" className="eye" onClick={() => setShow(!show)} aria-label="Show or hide password">
        {show ? "🙈" : "👁️"}
      </button>
    </div>
  );
}

function Auth() {
  const nav = useNavigate();
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ username: "", email: "", contact: "", location: "", password: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  if (getToken()) return <Navigate to="/feed" replace />;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      if (mode === "register") {
        await api("/api/auth/register", "POST", f);
        setMode("login");
        setMsg("Registered! Please login with your email.");
      } else {
        const r = await api("/api/auth/login", "POST", { email: f.email, password: f.password });
        setToken(r.token);
        setUsername(r.username);
        nav("/feed");
      }
    } catch (e2) {
      setErr(e2.message);
    }
  };

  return (
    <div className="wrap">
      <h2>🔗 LostLink</h2>
      <p><small>Lost something? Found something? Connect safely.</small></p>
      <form className="card" onSubmit={submit}>
        <h3>{mode === "login" ? "Login" : "Register"}</h3>
        {mode === "register" && (
          <input placeholder="Username" value={f.username} onChange={set("username")} />
        )}
        <input type="email" placeholder="Email" value={f.email} onChange={set("email")} />
        {mode === "register" && (
          <>
            <input placeholder="Contact (10 digits)" value={f.contact} onChange={set("contact")} />
            <input placeholder="Location (city)" value={f.location} onChange={set("location")} />
          </>
        )}
        <PasswordInput placeholder="Password (min 6)" value={f.password} onChange={set("password")} />
        {err && <div className="err">{err}</div>}
        {msg && <div className="ok">{msg}</div>}
        <button type="submit">{mode === "login" ? "Login" : "Register"}</button>
        <button type="button" className="link" onClick={() => { setMode(mode === "login" ? "register" : "login"); setErr(""); setMsg(""); }}>
          {mode === "login" ? "New here? Register" : "Already have an account? Login"}
        </button>
      </form>
    </div>
  );
}

function Feed() {
  const [posts, setPosts] = useState(null);
  const nav = useNavigate();
  const load = () => api("/api/posts").then(setPosts).catch(() => setPosts([]));
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api("/api/posts/" + id, "DELETE");
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <>
      <Header />
      <div className="wrap">
        <h3>Latest found items</h3>
        {posts === null && <p>Loading...</p>}
        {posts && posts.length === 0 && <p><small>No items yet. Tap + to post one.</small></p>}
        {posts && posts.map((p) => (
          <div key={p.id} className="card post">
            <Link to={"/claim/" + p.id} className="postlink">
              <div className="icon">{ICONS[p.category] || "📦"}</div>
              <div>
                <b>{p.title}</b>
                <div><small>{p.category} · {p.location}{p.mine ? " · Your post" : ""}</small></div>
                <div><small>{new Date(p.createdAt).toLocaleString()}</small></div>
              </div>
            </Link>
            {p.mine && <button className="del" onClick={() => del(p.id)}>🗑️ Delete</button>}
          </div>
        ))}
        <button className="fab" onClick={() => nav("/new")}>+ New post</button>
      </div>
    </>
  );
}

function MyPosts() {
  const [posts, setPosts] = useState(null);
  const load = () => api("/api/posts/mine").then(setPosts).catch(() => setPosts([]));
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api("/api/posts/" + id, "DELETE");
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <>
      <Header />
      <div className="wrap">
        <h3>My posts</h3>
        {posts === null && <p>Loading...</p>}
        {posts && posts.length === 0 && <p><small>You haven't posted anything yet.</small></p>}
        {posts && posts.map((p) => (
          <div key={p.id} className="card post">
            <div className="postlink">
              <div className="icon">{ICONS[p.category] || "📦"}</div>
              <div>
                <b>{p.title}</b>
                <div><small>{p.category} · {p.location}</small></div>
                <div><small>{new Date(p.createdAt).toLocaleString()}</small></div>
                <div>
                  <span className={p.status === "CLAIMED" ? "badge claimed" : "badge open"}>
                    {p.status === "CLAIMED" ? "✅ Claimed" : "Open"}
                  </span>
                  {p.status === "CLAIMED" && p.claimedBy && (
                    <small> · verified by {p.claimedBy}</small>
                  )}
                </div>
              </div>
            </div>
            <button className="del" onClick={() => del(p.id)}>🗑️ Delete</button>
          </div>
        ))}
      </div>
    </>
  );
}

const blankQ = (type) => ({ type, text: "", count: 4, options: ["", "", "", "", ""], correctIdx: -1 });

function CreatePost() {
  const nav = useNavigate();
  const [p, setP] = useState({ title: "", category: "Phone", location: "", description: "" });
  const [qs, setQs] = useState([blankQ("BASIC"), blankQ("UNIQUE")]);
  const [err, setErr] = useState("");
  const upd = (i, patch) => setQs(qs.map((q, j) => (j === i ? { ...q, ...patch } : q)));
  const setOpt = (i, k, v) => {
    const options = [...qs[i].options];
    options[k] = v;
    upd(i, { options });
  };

  const submit = async () => {
    setErr("");
    if (qs.some((q) => q.correctIdx < 0)) { setErr("Select the correct answer (the circle next to an option) for every question"); return; }
    const questions = qs.map((q) => {
      const options = q.options.slice(0, q.count).map((o) => o.trim());
      return { type: q.type, text: q.text.trim(), options, correctAnswer: options[q.correctIdx] || "" };
    });
    try {
      await api("/api/posts", "POST", { ...p, questions });
      nav("/feed");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <>
      <Header />
      <div className="wrap">
        <h3>Post a found item</h3>
        <div className="card">
          <input placeholder="Title (e.g. Phone found near bus stand)" value={p.title} onChange={(e) => setP({ ...p, title: e.target.value })} />
          <select value={p.category} onChange={(e) => setP({ ...p, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input placeholder="Where did you find it?" value={p.location} onChange={(e) => setP({ ...p, location: e.target.value })} />
          <textarea placeholder="Short description (do not include private details)" value={p.description} onChange={(e) => setP({ ...p, description: e.target.value })} />
        </div>

        <h3>Verification questions</h3>
        <small>The owner must answer these. Pick the correct option with the radio button.</small>
        {qs.map((q, i) => (
          <div className="card" key={i}>
            <select value={q.type} onChange={(e) => upd(i, { type: e.target.value })}>
              <option value="BASIC">Basic question</option>
              <option value="UNIQUE">Unique (secret) question</option>
            </select>
            <input placeholder="Enter your question" value={q.text} onChange={(e) => upd(i, { text: e.target.value })} />
            <label>
              <small>Number of options</small>
              <select value={q.count} onChange={(e) => upd(i, { count: Number(e.target.value), correctIdx: -1 })}>
                {[2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            {q.options.slice(0, q.count).map((o, k) => (
              <div className="optrow" key={k}>
                <input type="radio" name={"c" + i} checked={q.correctIdx === k} onChange={() => upd(i, { correctIdx: k })} />
                <input placeholder={"Option " + (k + 1)} value={o} onChange={(e) => setOpt(i, k, e.target.value)} />
              </div>
            ))}
          </div>
        ))}
        <button className="link" onClick={() => setQs([...qs, blankQ("BASIC")])}>+ Add basic question</button>
        <button className="link" onClick={() => setQs([...qs, blankQ("UNIQUE")])}>+ Add unique question</button>
        {err && <div className="err">{err}</div>}
        <br />
        <button onClick={submit}>Set questions and publish</button>
      </div>
    </>
  );
}

function Claim() {
  const { id } = useParams();
  const [qs, setQs] = useState([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api("/api/posts/" + id + "/questions").then(setQs).catch((e) => setErr(e.message));
  }, [id]);

  const pick = async (opt) => {
    const q = qs[step];
    const next = [...answers, { questionId: q.id, answer: opt }];
    setAnswers(next);
    if (step + 1 < qs.length) {
      setStep(step + 1);
    } else {
      try {
        setResult(await api("/api/posts/" + id + "/claim", "POST", { answers: next }));
      } catch (e) {
        setErr(e.message);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="wrap">
        <h3>Verify ownership</h3>
        <div className="bot">Hi! Answer a few questions to prove this item is yours.</div>
        {qs.map((q, i) => i <= step && (
          <div key={q.id}>
            {q.type === "UNIQUE" && (i === 0 || qs[i - 1].type === "BASIC") && (
              <div className="bot">Now a few more detailed questions.</div>
            )}
            <div className="bot">{q.text}</div>
            {answers[i] ? (
              <div className="me">{answers[i].answer}</div>
            ) : (
              <div className="opts">
                {q.options.map((o) => (
                  <button key={o} className="opt" onClick={() => pick(o)}>{o}</button>
                ))}
              </div>
            )}
          </div>
        ))}
        {err && <div className="err">{err}</div>}
        {result && result.verified && (
          <div className="result">
            <h3>✅ Verified</h3>
            <p>Contact {result.finder}:</p>
            <h2><a href={"tel:" + result.contact}>{result.contact}</a></h2>
          </div>
        )}
        {result && !result.verified && (
          <div className="result">
            <h3>⚠️ {result.message}</h3>
            <p><small>You have limited attempts for each item.</small></p>
            <Link to="/feed">Back to items</Link>
          </div>
        )}
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/feed" element={<Protected><Feed /></Protected>} />
        <Route path="/new" element={<Protected><CreatePost /></Protected>} />
        <Route path="/my-posts" element={<Protected><MyPosts /></Protected>} />
        <Route path="/claim/:id" element={<Protected><Claim /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
