// app/blog/page.tsx
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Imobiliário Anápolis | Dicas e Mercado",
  description: "Dicas sobre financiamento, FGTS, documentação e as melhores oportunidades do mercado imobiliário em Anápolis/GO.",
};

// Simulando um banco de dados ou arquivos markdown
const artigos = [
  {
    slug: "como-usar-fgts-compra-imovel-anapolis",
    titulo: "Como usar o FGTS na compra do seu primeiro apartamento",
    resumo: "Entenda as regras atualizadas e o passo a passo para utilizar seu saldo na compra de imóveis na planta ou prontos.",
    data: "23 Jun 2026",
  },
  {
    slug: "bairros-mais-valorizados-anapolis",
    titulo: "Onde Investir: Análise dos Bairros com Maior Valorização",
    resumo: "Descubra as regiões com maior potencial de retorno e como avaliar o preço do metro quadrado real, excluindo ágios.",
    data: "20 Jun 2026",
  },
  {
    slug: "documentacao-transferencia-imovel",
    titulo: "O Guia Definitivo da Documentação para Transferência",
    resumo: "Lista completa de certidões, funcionamento do ITBI e custos de cartório em Anápolis.",
    data: "15 Jun 2026",
  }
];

export default function BlogIndex() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-4">Blog Imobiliário</h1>
      <p className="text-zinc-600 mb-12">Tudo o que você precisa saber para comprar ou investir em Anápolis com segurança.</p>

      <div className="grid gap-8">
        {artigos.map((artigo) => (
          <article key={artigo.slug} className="border border-zinc-200 p-6 rounded-2xl hover:shadow-lg transition-shadow bg-white">
            <time className="text-xs text-blue-600 font-semibold mb-2 block">{artigo.data}</time>
            <h2 className="text-2xl font-bold mb-3">
              <Link href={`/blog/${artigo.slug}`} className="hover:text-blue-600 transition-colors">
                {artigo.titulo}
              </Link>
            </h2>
            <p className="text-zinc-600 mb-4">{artigo.resumo}</p>
            <Link href={`/blog/${artigo.slug}`} className="text-sm font-semibold text-blue-600 hover:underline">
              Ler artigo completo →
            </Link>
          </article>
        ))}
      </div>
      
      {/* Botão para voltar para a venda do apartamento */}
      <div className="mt-16 p-8 bg-zinc-100 rounded-2xl text-center">
        <h3 className="font-bold text-lg mb-2">Procurando um apartamento pronto para morar?</h3>
        <p className="text-zinc-600 mb-4 text-sm">Conheça nossa oportunidade exclusiva no Arcos do Paraíso.</p>
        <Link href="/" className="bg-zinc-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-zinc-800 transition">
          Ver Apartamento
        </Link>
      </div>
    </main>
  );
}