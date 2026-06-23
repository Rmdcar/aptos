// app/blog/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";

// Normalmente, aqui você faria um "fetch" dos seus textos em um banco 
// de dados, no Prismic, ou em arquivos Markdown (MDX).
export default function PostagemBlog({ params }: { params: { slug: string } }) {
  // O params.slug vai ser exatamente o que está na URL
  const { slug } = params;

  // Renderização simples para o exemplo
  return (
    <article className="max-w-3xl mx-auto px-6 py-16 min-h-screen">
      <Link href="/blog" className="text-sm text-blue-600 hover:underline mb-8 inline-block">
        ← Voltar para o Blog
      </Link>
      
      {/* Título Baseado no Slug (Provisório até conectar um banco de dados/MDX) */}
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight">
        {slug.replace(/-/g, ' ').toUpperCase()}
      </h1>
      
      <div className="prose prose-lg text-zinc-700 max-w-none">
        <p>Aqui entrará o texto completo de 1000 a 2000 palavras com todas as marcações H2, H3, listas e tabelas que o Google adora ler para posicionar bem o site.</p>
        
        <h2>O que você precisa saber primeiro</h2>
        <p>Desenvolvimento do raciocínio técnico, análise tributária ou dicas de mercado.</p>
        
        {/* Call To Action no meio do texto para gerar Vendas */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8 rounded-r-xl">
          <h3 className="text-lg font-bold text-blue-800 mb-2 mt-0">Dica Prática</h3>
          <p className="text-blue-900 text-sm mb-4">
            Se você está buscando um imóvel que atende exatamente a todos esses critérios para aprovação rápida, confira nossa unidade quitada e pronta para morar.
          </p>
          <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition inline-block">
            Ver Apartamento no Arcos do Paraíso
          </Link>
        </div>
        
        <p>Conclusão do texto com chamadas fortes para ação.</p>
      </div>
    </article>
  );
}