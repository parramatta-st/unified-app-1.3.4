import Header from '../components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-4">Success Tutoring Portal</h1>
        <p className="text-neutral-300 mb-6">Send lesson feedback and print materials from one place.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <a href="/feedback" className="rounded-xl border border-neutral-800 p-5 hover:border-neutral-700 bg-neutral-900">Feedback</a>
          <a href="/print" className="rounded-xl border border-neutral-800 p-5 hover:border-neutral-700 bg-neutral-900">Print</a>
        </div>
      </main>
    </div>
  );
}
