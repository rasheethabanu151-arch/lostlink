import { useEffect, useState } from "react";
import { api } from "./api";

const fmt = (d) => (d ? new Date(d).toLocaleString() : "");

export default function Support({ header }) {
  const [text, setText] = useState("");
  const [list, setList] = useState(null);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const load = () => api("/api/support/mine").then(setList).catch(() => setList([]));
  useEffect(() => { load(); }, []);

  const send = async (e) => {
    e.preventDefault();
    setErr(""); setOk("");
    if (!text.trim()) { setErr("Please type your message"); return; }
    try {
      await api("/api/support", "POST", { message: text.trim() });
      setText("");
      setOk("Your message was sent to the support team.");
      load();
    } catch (e2) { setErr(e2.message); }
  };

  return (
    <div>
      {header}
      <div className="wrap supportWrap">
        <h3>Support team</h3>
        <p className="muted">Facing an issue? Send us a message and we will reply here.</p>
        <form className="card" onSubmit={send}>
          <textarea
            rows={4}
            maxLength={1000}
            placeholder="Describe your issue..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {err && <div className="err">{err}</div>}
          {ok && <div className="ok">{ok}</div>}
          <button type="submit">Send message</button>
        </form>

        <h3 className="secTitle">Your messages</h3>
        {list && list.length === 0 && <div className="emptyBox">You have not sent any messages yet.</div>}
        {(list || []).map((m) => (
          <div className="card msgCard" key={m.id}>
            <div className="msgTop">
              <span className={"pill " + (m.status === "OPEN" ? "pillLost" : "pillFound")}>
                {m.status === "OPEN" ? "Waiting for reply" : "Replied"}
              </span>
              <span className="muted msgDate">{fmt(m.createdAt)}</span>
            </div>
            <p className="msgText">{m.message}</p>
            {m.reply && (
              <div className="replyBox"><b>Support team</b> <span className="muted">({fmt(m.repliedAt)})</span><p>{m.reply}</p></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
