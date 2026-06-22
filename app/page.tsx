import Image from "next/image";
import type { Metadata } from "next";

// 1. OTIMIZAÇÃO DE METADATA (SEO Básico e Avançado)
export const metadata: Metadata = {
  title: "Apartamento à Venda em Anápolis | 2 Quartos, 53m² [Nome do Bairro/Condomínio]",
  description: "Excelente oportunidade em Anápolis. Apartamento de 53m², 2 quartos (1 suíte), 1 vaga e documentação 100% regularizada para financiamento bancário. Agende sua visita direto com o proprietário.",
  keywords: ["apartamento a venda anapolis", "comprar apartamento anapolis", "imovel residencial anapolis", "apartamento 2 quartos anapolis"],
};

export default function Home() {
  // Lista automática das suas 10 imagens (da img1 à img10)
  const imagensGaleria = Array.from({ length: 10 }, (_, i) => `/img${i + 1}.jpeg`);

  // 2. DADOS ESTRUTURADOS PARA O GOOGLE (Invisível, mas crucial para SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SingleFamilyResidence",
    "name": "Apartamento Residencial de Alto Padrão em Anápolis",
    "description": "Apartamento de 53m² com 2 quartos (1 suíte) e vaga de garagem à venda em Anápolis.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Anápolis",
      "addressRegion": "GO",
      "addressCountry": "BR"
    },
    "numberOfRooms": 2,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": 53,
      "unitCode": "MTK"
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 scroll-smooth">
      {/* Injeção de Schema do Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HEADER / BARRA DE NAVEGAÇÃO ESTILO PORTAL */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800/50 px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-xl tracking-tight text-blue-600 dark:text-blue-400">Meu AP</span>
        <a
          href="https://wa.me/5562991070509"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium py-2 px-4 rounded-full text-sm transition-colors"
        >
          Falar com Proprietário
        </a>
      </header>
      
      {/* HERO SECTION */}
      <main className="flex flex-col items-center justify-center w-full pt-16 pb-12 px-6 text-center max-w-5xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 rounded-full">
          Oportunidade Única de Venda
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">
          Apartamento Moderno à Venda em Anápolis
        </h1>
        <p className="max-w-2xl text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
          Localização estratégica em uma das regiões mais valorizadas. Acabamento refinado, ambientes integrados e documentação impecável, pronta para transferência imediata ou financiamento.
        </p>
        
        {/* IMAGEM PRINCIPAL (Destaque Fachada/Sala) */}
        <div className="w-full aspect-[16/10] sm:aspect-[16/9] relative rounded-3xl overflow-hidden shadow-2xl mb-12 border border-zinc-200 dark:border-zinc-800">
           <Image
            src="/img1.jpeg" 
            alt="Apartamento à venda em Anápolis - Vista Principal"
            fill
            className="object-cover hover:scale-105 transition-transform duration-700"
            priority
          /> 
        </div>

        {/* BOTÃO PRINCIPAL DE CONVERSÃO */}
        <a
          href="https://wa.me/5562991070509?text=Olá!%20Gostaria%20de%20receber%20mais%20informações%20sobre%20o%20apartamento%20em%20Anápolis."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-10 rounded-full transition-all hover:scale-105 hover:shadow-green-600/20 shadow-xl text-lg flex items-center gap-2 mb-16"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.66.986 3.288 1.448 4.805 1.449 5.452 0 9.889-4.434 9.892-9.884.001-2.64-1.03-5.123-2.905-6.999-1.875-1.875-4.37-2.903-7.01-2.903-5.46 0-9.896 4.435-9.899 9.886-.001 1.773.49 3.51 1.42 5.037L1.24 21.147l4.145-1.087z"/>
          </svg>
          Agendar Visita Particular
        </a>
      </main>

      {/* SEÇÃO DE INFRAESTRUTURA / CARACTERÍSTICAS */}
      <section className="w-full max-w-5xl mx-auto py-12 px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center border-t border-zinc-200 dark:border-zinc-800/50">
        <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
          <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">2</span>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1">Dormitórios (1 Suíte)</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
          <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">53m²</span>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1">Área Útil</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
          <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">1</span>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1">Vaga de Garagem</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
          <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">100%</span>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1">Escriturado e Registrado</span>
        </div>
      </section>

      {/* GALERIA DE IMAGENS PROFISSIONAL (Grids de Tamanhos Diferentes) */}
      <section className="w-full max-w-5xl mx-auto py-16 px-6 border-t border-zinc-200 dark:border-zinc-800/50">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Galeria de Fotos</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">Conheça detalhadamente cada ambiente do imóvel.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {imagensGaleria.map((src, index) => (
            <div 
              key={index} 
              className={`relative rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-900 group shadow-md border border-zinc-200/40 dark:border-zinc-800/50 
                ${index === 0 ? "sm:col-span-2 sm:row-span-2 aspect-[16/10]" : "aspect-[4/3]"}
              `}
            >
              <Image
                src={src}
                alt={`Apartamento à Venda em Anápolis - Foto ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </section>

      {/* DETALHES DO IMÓVEL & DIFERENCIAIS */}
      <section className="w-full max-w-5xl mx-auto py-12 px-6 border-t border-zinc-200 dark:border-zinc-800/50 grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Sobre o Imóvel</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
            Perfeito para morar ou investir na cidade de Anápolis. A planta inteligente aproveita ao máximo os 53m², gerando integração perfeita entre a sala de estar, sala de jantar e a cozinha americana. 
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            A suíte principal foi planejada para máximo conforto térmico e acústico. Conta com acabamento em pisos modernos, pias em granito e infraestrutura pronta para ar-condicionado.
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Diferenciais Jurídicos e Fiscais</h3>
          <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
            <li className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span> Documentação 100% livre de ônus ou gravames.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span> IPTU e taxas de condomínio rigorosamente em dia.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span> Imóvel apto para emissão imediata da guia de ITBI e registro.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span> Aceita financiamento por qualquer banco (Caixa, Itaú, Bradesco, BB).
            </li>
          </ul>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800/50 py-8 px-6 text-center text-xs text-zinc-400">
        <p>© 2026 RMC Imóveis. Todos os direitos reservados. Venda direta com o proprietário.</p>
      </footer>
    </div>
  );
}