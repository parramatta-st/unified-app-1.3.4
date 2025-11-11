import Header from '../../components/Header';

export default function Feedback() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Feedback</h1>
        <p className="text-neutral-300">Feedback sending is enabled via /api/send-feedback. (UI minimized in this build.)</p>
      </main>
    </div>
  );
}
