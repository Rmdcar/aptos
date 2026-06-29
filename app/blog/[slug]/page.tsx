// app/blog/[slug]/page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function PostagemBlog({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const pastaConteudo = path.join(process.cwd(), 'conteudo');
  const caminhoArquivo = path.join(pastaConteudo, `${slug}.mdx`);

  if (!fs.existsSync(caminhoArquivo)) {
    notFound();
  }

  const conteudoArquivo = fs.readFileSync(caminhoArquivo, 'utf-8');
  let { data, content } = matter(conteudoArquivo);

  const tituloFinal = data.titulo || data.title || "Artigo sem título";
  const dataFinal = data.data || data.date || "";

  // ----------------------------------------------------------------------
  // LÓGICA BLINDADA: EXTRAÇÃO DO JSON-LD
  // ----------------------------------------------------------------------
  let jsonLdContent = null;

  // 1. Captura a tag <script> independente de aspas simples, duplas ou espaços
  const regexScript = /<script[^>]*type=['"]application\/ld\+json['"][^>]*>([\s\S]*?)<\/script>/i;
  const matchScript = content.match(regexScript);

  if (matchScript) {
    jsonLdContent = matchScript[1].trim();
    content = content.replace(matchScript[0], ''); // Remove exatamente o que encontrou
  } else {
    // 2. Fallback: Se a IA não usou a tag HTML e mandou só um bloco markdown ```json com os dados do Google
    const regexJson = /```json\s*(\{[\s\S]*"\@context"[\s\S]*\})\s*```/i;
    const matchJson = content.match(regexJson);
    if (matchJson) {
      jsonLdContent = matchJson[1].trim();
      content = content.replace(matchJson[0], '');
    }
  }

  // 3. Limpeza Final: Remove marcações vazias como ```html que possam ter sobrado após o recorte
  content = content.replace(/```(?:html|json|javascript)?\s*```/gi, '');
  // ----------------------------------------------------------------------

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 min-h-screen">
      
      {jsonLdContent && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdContent }}
        />
      )}

      <Link href="/blog" className="text-sm text-blue-600 hover:underline mb-8 inline-block">
        ← Voltar para o Blog
      </Link>
      
      <header className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
          {tituloFinal}
        </h1>
        <time className="text-sm text-zinc-400">{dataFinal}</time>
      </header>

      <article className="prose prose-lg prose-blue dark:prose-invert max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>

      <div className="mt-16 p-8 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-3xl text-center">
        <h3 className="font-bold text-xl mb-2 text-zinc-900 dark:text-zinc-100 mt-0">Pronto para dar o próximo passo?</h3>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm max-w-md mx-auto">
          Este apartamento no Condomínio Arcos do Paraíso preenche todos os requisitos de regularidade e valorização detalhados em nossos artigos.
        </p>
        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition no-underline inline-block">
          Ver Fotos e Preço do Imóvel
        </Link>
      </div>
    </main>
  );
}