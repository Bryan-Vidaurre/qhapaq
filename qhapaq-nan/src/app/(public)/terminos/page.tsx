import { promises as fs } from "node:fs";
import path from "node:path";
import { Header } from "@/components/layout/Header";

export const metadata = {
  title: "Términos y condiciones",
};

async function loadDoc() {
  return fs.readFile(path.join(process.cwd(), "docs", "TERMINOS.md"), "utf-8");
}

export default async function TerminosPage() {
  const md = await loadDoc();
  return (
    <div className="min-h-screen bg-qn-bg">
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <article className="rounded-2xl border border-qn-border bg-qn-paper p-8">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-qn-text">
            {md}
          </pre>
        </article>
      </main>
    </div>
  );
}
