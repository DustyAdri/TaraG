import { useState, type FormEvent } from "react";

/** Figure 1: mock login. Any username and password signs in; real accounts are future work. */
export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setMessage("Please enter your username and password.");
      return;
    }
    onLogin();
  };

  return (
    <div className="login-page">
      <LoginScenery />
      <form className="login-card" onSubmit={submit} noValidate>
        <h1 className="login-title">TaraG!</h1>
        <label className="sr-only" htmlFor="login-username">
          Username
        </label>
        <input
          id="login-username"
          className="login-input"
          placeholder="Username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="sr-only" htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
          className="login-input"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="login-message" role="alert">
          {message}
        </p>
        <button type="submit" className="login-button">
          Login
        </button>
        <button
          type="button"
          className="login-link"
          onClick={() => setMessage("Sign-up is coming soon. For this demo, any username and password works.")}
        >
          Sign up here!
        </button>
      </form>
    </div>
  );
}

/** Sky, clouds and rolling hills drawn in SVG (stands in for the landscape photo). */
function LoginScenery() {
  return (
    <svg className="login-scenery" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f78d0" />
          <stop offset="0.45" stopColor="#6fb0ea" />
          <stop offset="0.62" stopColor="#cfe6f4" />
        </linearGradient>
        <linearGradient id="field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8cc63f" />
          <stop offset="1" stopColor="#4f9a1f" />
        </linearGradient>
        <filter id="soft" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="blur-trees">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <rect width="1440" height="900" fill="url(#sky)" />
      <g fill="#fff" filter="url(#soft)" opacity="0.92">
        <ellipse cx="700" cy="120" rx="190" ry="45" />
        <ellipse cx="620" cy="140" rx="120" ry="35" />
        <ellipse cx="820" cy="150" rx="130" ry="32" />
        <ellipse cx="270" cy="100" rx="70" ry="20" />
        <ellipse cx="1260" cy="110" rx="110" ry="28" />
      </g>
      <path d="M0 470 C 220 400 420 420 640 460 S 1100 420 1440 440 V900 H0z" fill="#557b2a" />
      <g filter="url(#blur-trees)">
        {TREES.map(([x, y, r, c], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={c} />
        ))}
      </g>
      <path d="M0 560 C 300 500 520 600 820 560 S 1250 500 1440 540 V900 H0z" fill="#7ab231" />
      <path d="M0 640 C 380 590 760 680 1100 640 S 1380 610 1440 620 V900 H0z" fill="url(#field)" />
    </svg>
  );
}

const TREE_COLORS = ["#2f5d1a", "#3d6e1f", "#6b8f22", "#a7a52a", "#c9b23a", "#4f7a1d"];
const TREES: [number, number, number, string][] = Array.from({ length: 140 }, (_, i) => {
  const x = (i * 53) % 1480;
  const y = 455 + ((i * 37) % 85);
  const r = 22 + ((i * 29) % 30);
  return [x, y, r, TREE_COLORS[i % TREE_COLORS.length]!];
});
