// app/blog/[slug]/page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { notFound } from "next/navigation";

// Tipagem flexível para suportar tanto Next.js 14 quanto Next.js 15 (Promise)
interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

// Transformamos a função em async para poder dar o 'await' no params
export default async function PostagemBlog({ params }: PageProps) {
  
  // CORREÇÃO 1: Resolve o params de forma segura para qualquer versão do Next.js
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const pastaConteudo = path.join(process.cwd(), 'conteudo');
  const caminhoArquivo = path.join(pastaConteudo, `${slug}.mdx`);

  // Se o arquivo correspondente ao link não existir, joga para página 404
  if (!fs.existsSync(caminhoArquivo)) {
    notFound();
  }

  // Lê o arquivo de texto bruto
  const conteudoArquivo = fs.readFileSync(caminhoArquivo, 'utf-8');
  
  // Extrai os dados do topo (data) e o texto completo do artigo (content)
  const { data, content } = matter(conteudoArquivo);

  // CORREÇÃO 2: Suporta chaves em português ou inglês caso a IA varie a resposta
  const tituloFinal = data.titulo || data.title || "Artigo sem título";
  const dataFinal = data.data || data.date || "";

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 min-h-screen">
      <Link href="/blog" className="text-sm text-blue-600 hover:underline mb-8 inline-block">
        ← Voltar para o Blog
      </Link>
      
      <header className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
          {tituloFinal}
        </h1>
        <time className="text-sm text-zinc-400">{dataFinal}</time>
      </header>

      {/* Renderiza o texto mantendo as quebras de linha corretas */}
      <div className="whitespace-pre-line text-zinc-700 dark:text-zinc-300 space-y-4 text-base sm:text-lg leading-relaxed">
        {content}
      </div>

      <div className="mt-16 p-8 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-3xl text-center">
        <h3 className="font-bold text-xl mb-2 text-zinc-900 dark:text-zinc-100">Pronto para dar o próximo passo?</h3>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm max-w-md mx-auto">
          Este apartamento no Condomínio Arcos do Paraíso preenche todos os requisitos de regularidade e valorização detalhados em nossos artigos.
        </p>
        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition">
          Ver Fotos e Preço do Imóvel
        </Link>
      </div>
    </main>
  );
}