import { Eye, Gauge, Layers, Shield, Sparkles, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// 🔹 Backend base URLs (Vite env se aayenge, warna local fallback)
const GET_API_BASE =
	import.meta.env.VITE_GET_API_BASE_URL ||
	"http://neuralix.apforge.info/api/get";
const ADD_API_BASE =
	import.meta.env.VITE_ADD_API_BASE_URL ||
	"http://neuralix.apforge.info/api/add";

type Task = {
	id: number;
	title: string;
	description?: string | null;
	created_at?: string | null;
};

function App() {
	const [_activeFeature, setActiveFeature] = useState(0);

	const [tasks, setTasks] = useState<Task[]>([]);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [_loading, setLoading] = useState(false);
	const [adding, setAdding] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [showGetStarted, setShowGetStarted] = useState(false);

	const taskPanelRef = useRef<HTMLDivElement | null>(null);
	const examplesRef = useRef<HTMLDivElement | null>(null);

	const features = [
		{
			icon: Eye,
			title: "Object Recognition",
			description:
				"Real-time AI-powered object detection and tracking in augmented space",
			color: "from-cyan-500 to-blue-600",
		},
		{
			icon: Layers,
			title: "Spatial Mapping",
			description: "Advanced 3D environment mapping and surface detection",
			color: "from-blue-500 to-violet-600",
		},
		{
			icon: Sparkles,
			title: "AI Enhancement",
			description: "Machine learning models for enhanced AR experiences",
			color: "from-violet-500 to-fuchsia-600",
		},
		{
			icon: Zap,
			title: "Real-time Processing",
			description: "Ultra-low latency AR rendering and interaction",
			color: "from-fuchsia-500 to-pink-600",
		},
	];

	const stats = [
		{ label: "Processing Speed", value: "60 FPS", icon: Gauge },
		{ label: "Accuracy Rate", value: "99.2%", icon: Shield },
		{ label: "Active Users", value: "50K+", icon: Eye },
	];

	// ✅ FIXED: useCallback + no any
	const fetchTasks = useCallback(async () => {
		try {
			setLoading(true);
			const res = await fetch(`${GET_API_BASE}/tasks`);
			const data = await res.json();
			setTasks(data.tasks || []);
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.error(err);
				setError(err.message);
			} else {
				setError("Failed to load tasks");
			}
		} finally {
			setLoading(false);
		}
	}, []);

	// ✅ FIXED: no any
	const addTask = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;

		try {
			setAdding(true);
			setError(null);

			const res = await fetch(`${ADD_API_BASE}/tasks`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title, description }),
			});

			if (!res.ok) {
				throw new Error(`POST /tasks failed: ${res.status}`);
			}

			setTitle("");
			setDescription("");
			await fetchTasks();
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.error(err);
				setError(err.message);
			} else {
				setError("Failed to add task");
			}
		} finally {
			setAdding(false);
		}
	};

	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

	const _handleLaunchDemo = () => {
		taskPanelRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const handleViewExamples = () => {
		examplesRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const handleOpenGetStarted = () => {
		setShowGetStarted(true);
	};

	const handleCloseGetStarted = () => {
		setShowGetStarted(false);
	};

	const handleGetStartedSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setShowGetStarted(false);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
			<nav className="border-b border-white/10 backdrop-blur-xl bg-slate-900/50">
				<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
					<h1 className="text-xl font-bold">Anurag AIOps</h1>
					<div className="flex gap-4">
						<button type="button" onClick={handleViewExamples}>
							Documentation
						</button>
						<button type="button" onClick={handleViewExamples}>
							Pricing
						</button>
						<button type="button" onClick={handleOpenGetStarted}>
							Get Started
						</button>
					</div>
				</div>
			</nav>

			<section className="max-w-7xl mx-auto px-6 pt-20">
				<div className="grid grid-cols-3 gap-6">
					{stats.map((stat) => (
						<div key={stat.label} className="text-center">
							<stat.icon className="mx-auto text-cyan-400" />
							<div className="text-xl font-bold">{stat.value}</div>
							<div className="text-sm text-slate-400">{stat.label}</div>
						</div>
					))}
				</div>

				<div ref={taskPanelRef} className="mt-10">
					<form onSubmit={addTask} className="flex gap-2">
						<input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Task title"
						/>
						<button type="submit" disabled={adding}>
							{adding ? "Adding..." : "Add Task"}
						</button>
					</form>

					{error && <p className="text-red-400">{error}</p>}

					{tasks.map((t) => (
						<div key={t.id}>{t.title}</div>
					))}
				</div>

				<div className="mt-12">
					{features.map((feature, i) => {
						const Icon = feature.icon;
						return (
							<button
								key={feature.title}
								type="button"
								onClick={() => setActiveFeature(i)}
							>
								<Icon /> {feature.title}
							</button>
						);
					})}
				</div>
			</section>

			{showGetStarted && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/60">
					<div className="bg-slate-900 p-6 rounded-xl">
						<form onSubmit={handleGetStartedSubmit}>
							<button type="button" onClick={handleCloseGetStarted}>
								Close
							</button>
							<button type="submit">Request Demo</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
