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
  ["ITBI em Anápolis"]: [
    "ITbi eletrônico em Anápolis"
    ],

  
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
Você é um especialista em SEO, copywriting e mercado imobiliário de Anápolis-GO.

Seu objetivo é criar o melhor conteúdo existente na internet para responder completamente à intenção de busca do usuário.

Escreva um artigo original, profundo e atualizado sobre:

"${assuntoEscolhido}"

O artigo deve possuir entre 2.800 e 4.000 palavras.

===========================
OBJETIVO
===========================

O conteúdo deve ser capaz de disputar as primeiras posições do Google para a palavra-chave principal.

O público-alvo são pessoas que desejam:

- comprar o primeiro apartamento;
- financiar um imóvel pela Caixa;
- comprar apartamento Minha Casa Minha Vida;
- comprar apartamento MRV;
- comprar apartamento em Anápolis.

Sempre escreva pensando em intenção de compra.

Nunca escreva como advogado.

Nunca escreva como jornalista.

Escreva como um consultor imobiliário experiente.

===========================
SEO
===========================

A palavra-chave principal deve aparecer:

- no título
- na introdução
- em um H2
- em vários H3
- na conclusão
- na meta description

Utilize naturalmente dezenas de palavras relacionadas, como:

- apartamento MRV
- Minha Casa Minha Vida
- apartamento em Anápolis
- financiamento Caixa
- FGTS
- entrada do imóvel
- apartamento novo
- condomínio
- parcelas
- imóvel financiado
- primeiro apartamento
- avaliação da Caixa
- Arcos do Paraíso

Escreva utilizando SEO semântico.

Nunca faça keyword stuffing.

===========================
ESTRUTURA
===========================

O artigo deve conter:

# Introdução

Uma introdução envolvente mostrando o problema e prometendo a solução.

Depois desenvolva entre 8 e 15 seções H2.

Cada H2 deve conter diversos H3.

Inclua:

- listas
- bullet points
- tabelas
- comparativos
- checklists
- exemplos reais
- dicas práticas
- erros comuns
- vantagens
- desvantagens

Inclua uma tabela comparativa sempre que fizer sentido.

===========================
FEATURED SNIPPETS
===========================

Crie diversas respostas curtas (40–60 palavras) para perguntas comuns do Google.

Exemplos:

"O que é..."

"Vale a pena..."

"Quanto custa..."

"Como funciona..."

"Quem pode..."

===========================
EEAT
===========================

Sempre cite fontes oficiais quando apropriado:

- Caixa Econômica Federal
- Prefeitura de Anápolis
- Governo Federal
- Código Civil
- Registro de Imóveis
- Banco Central

Nunca invente dados.

Quando não houver dado oficial, deixe isso claro.

===========================
CONVERSÃO
===========================

Ao longo do texto incentive naturalmente o leitor a:

- simular financiamento
- utilizar FGTS
- visitar apartamentos
- conhecer o Condomínio Arcos do Paraíso
- entrar em contato

O CTA deve parecer natural.

===========================
LINKAGEM INTERNA
===========================

${linksInternosContexto}

Sempre utilize os links internos quando fizer sentido.

===========================
FORMATAÇÃO MDX
===========================

Retorne exatamente este Frontmatter:

---
title: "Título SEO otimizado"
description: "Meta description com até 155 caracteres"
slugGerado: "${slugGerado}"
canonical: "${urlCanonica}"
date: "${dataHoje}"
category: "${categoriaEscolhida}"
keywords: "palavra chave principal, secundaria 1, secundaria 2"
---

Depois escreva apenas Markdown.

Utilize:

# H1

## H2

### H3

Tabelas em Markdown.

Listas.

Caixas de destaque usando blockquote.

No final inclua:

1. Conclusão
2. FAQ com pelo menos 10 perguntas
3. CTA final

===========================
SCHEMA
===========================

No final do arquivo gere:

<script type="application/ld+json">

incluindo:

- Article, FAQPage e BreadcrumbList

Todos os campos devem estar preenchidos corretamente.

Não explique o que está fazendo.

Retorne apenas o arquivo MDX.
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
      Sua tarefa é APENAS corrigir possíveis erros gramaticais, garantir que o tom seja de investidor experiente, verificar se o Frontmatter está intacto e se a tag de JSON-LD está fechada corretamente no final.
      
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