import Link from "next/link"; 
import Image from "next/image";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// 1. FUNÇÃO QUE LÊ OS ARQUIVOS MDX (Node.js nativo rodando no servidor Next.js)
function getUltimosArtigos() {
  const pastaConteudo = path.join(process.cwd(), 'conteudo');
  
  // Se a pasta não existir ainda, retorna um array vazio para não quebrar o site
  if (!fs.existsSync(pastaConteudo)) {
    return [];
  }

  const arquivos = fs.readdirSync(pastaConteudo);
  
  const artigos = arquivos
    .filter((arquivo) => arquivo.endsWith('.mdx')) // Pega só os .mdx
    .map((arquivo) => {
      const caminho = path.join(pastaConteudo, arquivo);
      const conteudoArquivo = fs.readFileSync(caminho, 'utf-8');
      
      // O gray-matter extrai o titulo, resumo e data que estão no topo do MDX
      const { data } = matter(conteudoArquivo); 
      
      return {
        slug: arquivo.replace('.mdx', ''), // Tira a extensão para virar a URL
        titulo: data.titulo || "Artigo sem título",
        resumo: data.resumo || "",
        dataPublicacao: new Date(data.data || Date.now()) 
      };
    });

  // Ordena do mais recente para o mais antigo e pega no máximo os 4 últimos
  return artigos
    .sort((a, b) => b.dataPublicacao.getTime() - a.dataPublicacao.getTime())
    .slice(0, 4);
}

// 2. OTIMIZAÇÃO DE METADATA (Manteve-se igual)
export const metadata: Metadata = {
  title: "Apartamento Novo em Anápolis - 53,45m², 2 Qts | Condomínio Arcos do Paraíso",
  description: "Oportunidade de venda rápida em Anápolis. Apartamento novo (nunca habitado) de R$ 200 mil por R$ 190.000. Quitado, escriturado e pronto para financiar ou usar FGTS.",
  keywords: [
    "apartamento venda anapolis", 
    "imovel anapolis 2 quartos", 
    "condominio arcos do paraiso", 
    "comprar primeiro apartamento", 
    "financiamento caixa apartamento",
    "usar fgts comprar apartamento",
    "bairros anapolis valorizacao",
    "transferencia imovel documentacao"
  ],
  openGraph: {
    title: "Apartamento à Venda no Arcos do Paraíso - Anápolis/GO | R$ 190.000",
    description: "Imóvel novo, nunca habitado, com piso amadeirado instalado. Documentação 100% regular para transferência imediata.",
    images: ["https://apartamentoanapolis.online/img1.jpeg"],
    url: "https://apartamentoanapolis.online",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apartamento Novo à Venda em Anápolis - R$ 190.000",
    description: "Área de 53,45 m², 2 quartos, pronto para morar ou alugar. Preço abaixo do mercado para venda rápida.",
    images: ["https://apartamentoanapolis.online/img1.jpeg"],
  }
};

// Transformamos o Home em async para poder processar os artigos antes de renderizar
export default async function Home() {
  const imagensGaleria = Array.from({ length: 10 }, (_, i) => `/img${i + 1}.jpeg`);
  
  // Executa a função para pegar os artigos da pasta 'conteudo'
  const ultimosArtigos = getUltimosArtigos();

  // Dados Estruturados do Schema.org
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": "Apartamento Novo à Venda no Condomínio Arcos do Paraíso",
    "description": "Excelente oportunidade para morar ou investir em Anápolis. Apartamento de 53,45 m² nunca habitado, com piso amadeirado e documentação regularizada.",
    "url": "https://apartamentoanapolis.online",
    "datePosted": "2026-06-23", 
    "offers": {
      "@type": "Offer",
      "price": "190000",
      "priceCurrency": "BRL",
      "priceValidUntil": "2027-12-31"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Anápolis",
      "addressRegion": "GO",
      "addressCountry": "BR"
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 scroll-smooth">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <meta name="google-site-verification" content="3hErJbktd4G6zm-WygBd7B9euH4Ir6CnTYchqwx2wMA" />
      
      {/* HEADER MANTIDO IGUAL... */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800/50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl tracking-tight text-blue-600 dark:text-blue-400">Meu AP</span>
          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 border-l border-zinc-200 dark:border-zinc-800 pl-3">
            <span>Arcos do Paraíso</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/blog" className="hidden sm:block text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 transition-colors">
            Blog & Guias
          </Link>
          <a href="https://wa.me/5562991070509" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-full text-sm transition-colors flex items-center gap-1.5">
            Falar com Proprietário
          </a>
        </div>
      </header>
      
      {/* HERO SECTION MANTIDA IGUAL... */}
      <main className="flex flex-col items-center justify-center w-full pt-16 pb-12 px-6 text-center max-w-5xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-full">
          Preço Reduzido para Venda Rápida
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 max-w-4xl bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">
          Apartamento Novo no Arcos do Paraíso
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 max-w-xl">
          Anápolis - GO • Venda Direta com o Proprietário • Aberto a Propostas Reais
        </p>

        <div className="mb-10 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center gap-4 px-8">
          <div className="text-left">
            <span className="text-sm text-zinc-400 line-through block">Valor anterior: R$ 200.000,00</span>
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">R$ 190.000,00</span>
          </div>
          <span className="hidden sm:block text-zinc-300 dark:text-zinc-700">|</span>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xs text-center sm:text-left">
            Imóvel <strong>100% quitado</strong>, em meu nome e com certidão de matrícula regularizada.
          </p>
        </div>
        
        <div className="w-full aspect-[16/10] sm:aspect-[16/9] relative rounded-3xl overflow-hidden shadow-2xl mb-12 border border-zinc-200 dark:border-zinc-800">
           <Image src="/img1.jpeg" alt="Apartamento novo à venda em Anápolis - Condomínio Arcos do Paraíso" fill className="object-cover hover:scale-105 transition-transform duration-700" priority /> 
        </div>

        <a href="https://wa.me/5562991070509?text=Olá!%20Gostaria%20de%20receber%20mais%20informações%20sobre%20o%20apartamento%20no%20Arcos%20do%20Paraíso." target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-10 rounded-full transition-all hover:scale-105 hover:shadow-green-600/20 shadow-xl text-lg flex items-center gap-2 mb-6">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.66.986 3.288 1.448 4.805 1.449 5.452 0 9.889-4.434 9.892-9.884.001-2.64-1.03-5.123-2.905-6.999-1.875-1.875-4.37-2.903-7.01-2.903-5.46 0-9.896 4.435-9.899 9.886-.001 1.773.49 3.51 1.42 5.037L1.24 21.147l4.145-1.087z"/></svg>
          Negociar Direto com Proprietário
        </a>

        <div className="flex gap-4 text-xs font-medium text-zinc-500 mb-12">
          <a href="https://www.facebook.com/marketplace/item/1344294441143473" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors underline">Ver no Facebook Marketplace</a>
          <span>•</span>
          <a href="https://www.instagram.com/meu.apto.mrv/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors underline">Acompanhar no Instagram</a>
        </div>
      </main>

      {/* SEÇÃO DE INFRAESTRUTURA E GALERIA MANTIDA IGUAL... */}
      <section className="w-full max-w-5xl mx-auto py-12 px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center border-t border-zinc-200 dark:border-zinc-800/50">
        <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800"><span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">2</span><span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1">Dormitórios amplos</span></div>
        <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800"><span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">53,45m²</span><span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1">Área Privativa</span></div>
        <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800"><span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">Novo</span><span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1">Nunca Habitado</span></div>
        <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800"><span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">✓</span><span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1">Quitado / Matrícula OK</span></div>
      </section>

      <section className="w-full max-w-5xl mx-auto py-16 px-6 border-t border-zinc-200 dark:border-zinc-800/50">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Imagens Reais do Imóvel</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">Confira os detalhes internos, acabamento e a estrutura do condomínio padrão MRV.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {imagensGaleria.map((src, index) => (
            <div key={index} className={`relative rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-900 group shadow-md border border-zinc-200/40 dark:border-zinc-800/50 ${index === 0 ? "sm:col-span-2 sm:row-span-2 aspect-[16/10]" : "aspect-[4/3]"}`}>
              <Image src={src} alt={`Apartamento no Condomínio Arcos do Paraíso Anápolis - Foto ${index + 1}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </section>

      <section className="w-full max-w-5xl mx-auto py-12 px-6 border-t border-zinc-200 dark:border-zinc-800/50 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Sobre a Propriedade</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">Uma unidade inteiramente nova, ideal para quem busca realizar o sonho da primeira moradia ou para investidores focados em renda estável com locação em Anápolis. O imóvel conta com distribuição inteligente dos ambientes, excelente ventilação natural e a segurança de um condomínio fechado.</p>
          <ul className="grid grid-cols-2 gap-3 mt-6 text-sm text-zinc-700 dark:text-zinc-300">
            <li className="flex items-center gap-2">🔹 2 Quartos confortáveis</li><li className="flex items-center gap-2">🔹 Cozinha integrada</li><li className="flex items-center gap-2">🔹 Banheiro social</li><li className="flex items-center gap-2">🔹 Sala de estar aconchegante</li>
          </ul>
          <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-2xl mt-6">
            <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">🪵 Diferencial Concluído: Piso Amadeirado</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">O apartamento já conta com piso amadeirado de alto padrão instalado em toda a sua extensão, agregando sofisticação térmica e visual, pronto para receber sua mobília sem gastos extras com reformas de acabamento básico.</p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg mb-4">Garantias Jurídicas e Facilidades</h3>
            <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold mt-0.5">✔</span><div><strong>Documentação Cristalina:</strong> Imóvel totalmente em meu nome, sem restrições jurídicas, alienações judiciais ou gravames. Certidão de matrícula emitida e perfeitamente válida.</div></li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold mt-0.5">✔</span><div><strong>Impostos Regularizados:</strong> Obrigações fiscais e taxas condominiais rigorosamente em dia, facilitando os cálculos e a emissão imediata das guias de ITBI.</div></li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold mt-0.5">✔</span><div><strong>Financiamento Amplo:</strong> Estrutura aprovada para processos habitacionais em grandes redes bancárias (Caixa Econômica, Banco do Brasil, Itaú, Bradesco ou Santander).</div></li>
            </ul>
          </div>
          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400">*Estudo propostas à vista ou fluxo de financiamento aprovado compatíveis com a realidade do mercado local.</div>
        </div>
      </section>

      {/* 3. CENTRAL DE CONTEÚDO DINÂMICA (Lê os arquivos MDX) */}
      <section className="w-full max-w-5xl mx-auto py-16 px-6 border-t border-zinc-200 dark:border-zinc-800/50 bg-zinc-100/40 dark:bg-zinc-900/20 rounded-3xl my-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3 text-center">Guia do Comprador: Mercado Imobiliário em Anápolis</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-center mb-10 text-sm">
            Acompanhe nossas análises técnicas sobre financiamento, ITBI e mercado imobiliário.
          </p>

          <div className="space-y-8">
            {ultimosArtigos.length > 0 ? (
              // Se tiver arquivos na pasta 'conteudo', ele cria as caixas dinamicamente
              ultimosArtigos.map((artigo) => (
                <div key={artigo.slug} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
                  <h3 className="font-bold text-base text-blue-600 dark:text-blue-400 mb-2">{artigo.titulo}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                    {artigo.resumo}
                  </p>
                  <Link href={`/blog/${artigo.slug}`} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
                    Ler artigo completo <span>→</span>
                  </Link>
                </div>
              ))
            ) : (
              // Fallback: Se a pasta estiver vazia, avisa o usuário (evita erro na tela)
              <div className="text-center p-8 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl">
                <p className="text-zinc-500">Novos artigos sendo preparados. Volte em breve!</p>
              </div>
            )}
          </div>
          
          {ultimosArtigos.length > 0 && (
             <div className="mt-8 text-center">
                <Link href="/blog" className="inline-block bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium py-2 px-6 rounded-full text-sm transition-colors">
                  Ver todos os artigos do Blog
                </Link>
             </div>
          )}
        </div>
      </section>

      {/* CTA Flutuante para Mobile */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 sm:hidden">
        <a href="https://wa.me/5562991070509?text=Olá!%20Gostaria%20de%20receber%20mais%20informações%20sobre%20o%20apartamento%20no%20Arcos%20do%20Paraíso." target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full shadow-2xl flex items-center gap-2 text-sm animate-pulse">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.66.986 3.288 1.448 4.805 1.449 5.452 0 9.889-4.434 9.892-9.884.001-2.64-1.03-5.123-2.905-6.999-1.875-1.875-4.37-2.903-7.01-2.903-5.46 0-9.896 4.435-9.899 9.886-.001 1.773.49 3.51 1.42 5.037L1.24 21.147l4.145-1.087z"/></svg>
          Falar no WhatsApp
        </a>
      </div>

      {/* FOOTER */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800/50 py-8 px-6 text-center text-xs text-zinc-400 flex flex-col sm:flex-row justify-between items-center max-w-5xl mx-auto gap-4">
        <p>© 2026 Meu AP - Condomínio Arcos do Paraíso. Todos os direitos reservados. Venda direta de particular para particular.</p>
        <div className="flex items-center gap-4">
          <Link href="/blog" className="hover:text-blue-500 transition-colors">Blog e Dicas Imobiliárias</Link>
          <span>•</span>
          <p>Anápolis/GO</p>
        </div>
      </footer>
    </div>
  );
}