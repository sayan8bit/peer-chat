const chatBox = document.getElementById("chat");
const peerIdInput = document.getElementById("peer-id-input");
const msgInput = document.getElementById("msg");

let conn;
let peerId = localStorage.getItem("peer_id");

// Create Peer with saved ID or generate new
const peer = new Peer(peerId || undefined);

peer.on("open", (id) => {
  document.getElementById("my-id").textContent = id;
  localStorage.setItem("peer_id", id);
});

// Handle incoming connection
peer.on("connection", (connection) => {
  conn = connection;
  conn.on("data", (data) => {
    chatBox.innerHTML += `<div>👤 Friend: ${data}</div>`;
  });
  conn.on("open", () => {
    chatBox.innerHTML += `<div>🔗 Connected!</div>`;
  });
});

// Connect to other peer
function connectToPeer() {
  const targetId = peerIdInput.value.trim();
  if (!targetId) return;

  conn = peer.connect(targetId);
  conn.on("open", () => {
    chatBox.innerHTML += `<div>🔗 Connected to ${targetId}</div>`;
    conn.on("data", (data) => {
      chatBox.innerHTML += `<div>👤 Friend: ${data}</div>`;
    });
  });
}

// Send message
function sendMsg() {
  const msg = msgInput.value.trim();
  if (!msg || !conn || conn.open === false) return;
  conn.send(msg);
  chatBox.innerHTML += `<div>🧑 You: ${msg}</div>`;
  msgInput.value = "";
}
