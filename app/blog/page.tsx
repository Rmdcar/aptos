// app/blog/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const metadata: Metadata = {
  title: "Blog Imobiliário Anápolis | Dicas e Mercado",
  description: "Dicas sobre financiamento, FGTS, documentação e as melhores oportunidades do mercado imobiliário em Anápolis/GO.",
};

// Função que busca todos os arquivos gerados na pasta conteudo
function getTodosArtigos() {
  const pastaConteudo = path.join(process.cwd(), 'conteudo');
  
  if (!fs.existsSync(pastaConteudo)) {
    return [];
  }

  const arquivos = fs.readdirSync(pastaConteudo);
  
  return arquivos
    .filter((arquivo) => arquivo.endsWith('.mdx'))
    .map((arquivo) => {
      const caminho = path.join(pastaConteudo, arquivo);
      const conteudoArquivo = fs.readFileSync(caminho, 'utf-8');
      const { data } = matter(conteudoArquivo); 
      
      return {
        slugGerado: arquivo.replace('.mdx', ''),
        titulo: data.title || "Artigo sem título",
        resumo: data.resumo || "",
        data: data.date || "",
      };
    });
}

export default function BlogIndex() {
  const artigos = getTodosArtigos();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 min-h-screen">
      <Link href="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Voltar para o Apartamento
      </Link>
      <h1 className="text-4xl font-extrabold mb-4">Blog Imobiliário</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-12">Análises e guias para compra, venda e investimentos em Anápolis.</p>

      <div className="grid gap-8">
        {artigos.length > 0 ? (
          artigos.map((artigo) => (
            <article key={artigo.slugGerado} className="border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl hover:shadow-lg transition-shadow bg-white dark:bg-zinc-900">
              <time className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2 block">{artigo.data}</time>
              <h2 className="text-2xl font-bold mb-3">
                <Link href={`/blog/${artigo.slugGerado}`} className="hover:text-blue-600 transition-colors">
                  {artigo.titulo}
                </Link>
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4 text-sm">{artigo.resumo}</p>
              <Link href={`/blog/${artigo.slugGerado}`} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                Ler artigo completo →
              </Link>
            </article>
          ))
        ) : (
          <p className="text-zinc-500">Nenhum artigo encontrado na pasta conteudo.</p>
        )}
      </div>
    </main>
  );
}