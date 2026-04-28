import { promises as fs } from "node:fs";
import path from "node:path";
import { Header } from "@/components/layout/Header";

export const metadata = {
  title: "Reglas de la comunidad",
};

async function loadDoc() {
  const filePath = path.join(process.cwd(), "docs", "POLITICA_CONTENIDO.md");
  return fs.readFile(filePath, "utf-8");
}

export default async function ContenidoPage() {
  const md = await loadDoc();

  return (
    <div className="min-h-screen bg-qn-bg">
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <article className="prose prose-stone prose-headings:font-display rounded-2xl border border-qn-border bg-qn-paper p-8 prose-headings:text-qn-ink prose-p:text-qn-text prose-strong:text-qn-ink prose-a:text-qn-terracotta">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-qn-text">
            {md}
          </pre>
        </article>
      </main>
    </div>
  );
}
