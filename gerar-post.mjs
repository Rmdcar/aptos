// arquivo: gerar-post.mjs
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// ---------------------------------------------------------
// 1. CONFIGURAÇÕES INICIAIS E UTILITÁRIOS
// ---------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ai = new GoogleGenAI({}); 
const DOMINIO = "https://apartamentoanapolis.online";

// Cores para os Logs no Terminal
const cores = {
  reset: "\x1b[0m",
  verde: "\x1b[32m",
  azul: "\x1b[34m",
  amarelo: "\x1b[33m",
  vermelho: "\x1b[31m",
  ciano: "\x1b[36m"
};

const log = (msg, cor = cores.reset) => console.log(`${cor}${msg}${cores.reset}`);

// Função para criar Slugs amigáveis sem Date.now()
function criarSlug(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/[^a-z0-9]+/g, "-")     
    .replace(/(^-|-$)+/g, "");       
}

// ---------------------------------------------------------
// 2. SISTEMA DE ARQUIVOS E MEMÓRIA DO BLOG (Links e Duplicidade)
// ---------------------------------------------------------
function obterArtigosPublicados(pastaConteudo) {
  if (!fs.existsSync(pastaConteudo)) return [];
  const arquivos = fs.readdirSync(pastaConteudo).filter(arq => arq.endsWith('.mdx'));
  return arquivos.map(arq => ({
    slug: arq.replace('.mdx', ''),
    url: `${DOMINIO}/blog/${arq.replace('.mdx', '')}`
  }));
}

function verificarMudancasGit() {
  try {
    const status = execSync('git status --porcelain').toString();
    return status.trim().length > 0;
  } catch (e) {
    return false;
  }
}

// ---------------------------------------------------------
// 3. TOPICAL AUTHORITY (Clusters de Conteúdo)
// ---------------------------------------------------------
const clustersDeConteudo = {
  "Tributario_Juridico": [
    "O Guia Definitivo do ITBI em Anapolis para Transferencia de Imoveis",
    "Processos Administrativos de 1ª Instância: Contestacao de IPTU e ITBI",
    "Certidoes Negativas e Documentacao para Compra de Imoveis Segura"
  ],
  "Financiamento_Investimento": [
    "Como usar o FGTS na compra do primeiro apartamento na planta ou pronto",
    "Financiamento Caixa vs Itau: Analise de Taxas para Imoveis em Anapolis",
    "Leiloes de Imoveis da Caixa: Como analisar a avaliacao bancaria e lucrar"
  ],
  "Mercado_Local": [
    "Bairros com maior potencial de valorizacao em Anapolis",
    "Apartamento Novo versus Usado: Calculando a depreciação e liquidez",
    "Vantagens de morar no Condominio Arcos do Paraiso em Anapolis"
  ]
};

// ---------------------------------------------------------
// 4. FUNÇÃO PRINCIPAL DE AUTOMAÇÃO
// ---------------------------------------------------------
async function automatizarBlog() {
  log(`\n=================================================`, cores.ciano);
  log(`🚀 INICIANDO GERADOR DE CONTEÚDO SEO PRO 2026`, cores.ciano);
  log(`=================================================\n`, cores.ciano);

  const pastaConteudo = path.join(__dirname, 'conteudo');
  if (!fs.existsSync(pastaConteudo)) fs.mkdirSync(pastaConteudo);

  const artigosPublicados = obterArtigosPublicados(pastaConteudo);
  const slugsPublicados = artigosPublicados.map(a => a.slug);

  // Seleciona um assunto inédito
  let assuntoEscolhido = null;
  let categoriaEscolhida = null;
  let slugGerado = null;

  for (const [categoria, assuntos] of Object.entries(clustersDeConteudo)) {
    for (const assunto of assuntos) {
      const slugTeste = criarSlug(assunto);
      if (!slugsPublicados.includes(slugTeste)) {
        assuntoEscolhido = assunto;
        categoriaEscolhida = categoria;
        slugGerado = slugTeste;
        break;
      }
    }
    if (assuntoEscolhido) break;
  }

  if (!assuntoEscolhido) {
    log(`⚠️ Todos os tópicos atuais já foram publicados! Adicione novos temas ao cluster.`, cores.amarelo);
    return;
  }

  log(`🎯 Pauta selecionada: [${categoriaEscolhida}] ${assuntoEscolhido}`, cores.verde);
  log(`🔗 Slug reservado: ${slugGerado}`, cores.verde);
  
  const linksInternosContexto = artigosPublicados.length > 0 
    ? `\nLinks de artigos já publicados no blog que VOCÊ DEVE inserir contextualmente no texto:\n${artigosPublicados.map(a => `- ${a.url}`).join('\n')}` 
    : "\nNenhum artigo publicado ainda para linkagem interna.";

  // ---------------------------------------------------------
  // ETAPA 1: GERAÇÃO DO DRAFT (Rascunho Focado em EEAT)
  // ---------------------------------------------------------
  log(`\n🤖 Etapa 1: Gerando conteúdo avançado (EEAT + 2500 palavras)...`, cores.azul);
  
  const dataHoje = new Date().toISOString().split('T')[0];
  const urlCanonica = `${DOMINIO}/blog/${slugGerado}`;

  const promptGeracao = `
    Aja como um Perito Contábil Judicial e Investidor Imobiliário altamente qualificado que atua em Anápolis, Goiás.
    Escreva um artigo de blog épico, exaustivo e altamente técnico (objetivando 2.500 a 3.500 palavras) sobre: "${assuntoEscolhido}".

    DIRETRIZES DE SEO E EEAT (Google Helpful Content 2026):
    - Traga uma visão pericial: ensine o leitor a realizar cálculos e avaliar o preço do metro quadrado real, excluindo ágios de financiamentos anteriores para não distorcer a média aritmética.
    - Cite referências de autoridades (ex: Prefeitura de Anápolis, regras da Caixa Econômica, Código Civil).
    - Crie uma seção de FAQ no final com perguntas e respostas diretas.
    - Inclua código JSON-LD (Schema.org) no final do arquivo contendo 'Article', 'FAQPage' e 'BreadcrumbList'.
    ${linksInternosContexto}

    REGRAS DE FORMATAÇÃO MDX:
    O texto DEVE ser retornado com este Frontmatter exato no topo:
    ---
    title: "Título SEO otimizado com a palavra-chave"
    description: "Meta description persuasiva com CTA (máx 155 caracteres)"
    slug: "${slugGerado}"
    canonical: "${urlCanonica}"
    date: "${dataHoje}"
    category: "${categoriaEscolhida}"
    keywords: "palavra chave principal, secundaria 1, secundaria 2"
    ---
    
    [Inicie o texto em Markdown (##, ###, listas, tabelas) logo após os traços do frontmatter]
    [Adicione a tag <script type="application/ld+json"> no final com o JSON-LD]
  `;

  try {
    const draftResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Usando Flash por ser mais rápido e lidar bem com textos longos
      contents: promptGeracao,
    });

    let draftMdx = draftResponse.text;

    // ---------------------------------------------------------
    // ETAPA 2: REVISÃO E POLIMENTO AUTOMÁTICO
    // ---------------------------------------------------------
    log(`\n🕵️ Etapa 2: Revisando qualidade técnica, links e formatação...`, cores.amarelo);
    
    const promptRevisao = `
      Você é um editor-chefe de SEO. Revise o artigo MDX abaixo.
      Sua tarefa é APENAS corrigir possíveis erros gramaticais, garantir que o tom seja de um Perito Contábil experiente, verificar se o Frontmatter está intacto e se a tag de JSON-LD está fechada corretamente no final.
      
      Regra de Ouro: Retorne O ARQUIVO MDX COMPLETO REVISADO, mantendo o frontmatter. Remova qualquer formatação externa de crases (\`\`\`mdx).
      
      ARTIGO PARA REVISÃO:
      ${draftMdx}
    `;

    const revisaoResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptRevisao,
    });

    let conteudoFinal = revisaoResponse.text.trim();
    conteudoFinal = conteudoFinal.replace(/^```(mdx|markdown|md)?\s*/i, '').replace(/\s*```$/i, '').trim();

    // ---------------------------------------------------------
    // ETAPA 3: SALVAMENTO LOCAL E COMMIT INTELIGENTE
    // ---------------------------------------------------------
    const caminhoArquivo = path.join(pastaConteudo, `${slugGerado}.mdx`);
    fs.writeFileSync(caminhoArquivo, conteudoFinal);
    
    log(`\n💾 Etapa 3: Arquivo salvo com sucesso em: ${caminhoArquivo}`, cores.verde);

    if (verificarMudancasGit()) {
      log(`🚀 Etapa 4: Alterações detectadas. Iniciando push para o GitHub...`, cores.azul);
      execSync('git add .');
      execSync(`git commit -m "feat(blog): publica artigo SEO otimizado - ${slugGerado}"`);
      execSync('git push origin main'); // Mude para 'master' se necessário
      log(`\n🎉 SUCESSO! Artigo no ar e site em processo de build na Vercel!`, cores.verde);
    } else {
      log(`\n🛑 Commit ignorado: Nenhuma alteração real detectada nos arquivos.`, cores.amarelo);
    }

  } catch (erro) {
    log(`\n❌ ERRO FATAL: ${erro.message}`, cores.vermelho);
    console.error(erro);
  }
}

automatizarBlog();