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
  "Minha_Casa_Minha_Vida": [
    "Minha Casa Minha Vida em Anapolis: Guia Completo para Comprar em 2026",
    "Quem pode financiar pelo Minha Casa Minha Vida em Anapolis",
    "Documentos necessarios para comprar apartamento pelo Minha Casa Minha Vida",
    "Como funciona a entrada no Minha Casa Minha Vida",
    "Como usar o FGTS para comprar apartamento Minha Casa Minha Vida",
    "Quanto preciso ganhar para financiar um apartamento pela Caixa",
    "Como simular financiamento Minha Casa Minha Vida",
    "Quanto fica a parcela de um apartamento MRV",
    "Vale a pena comprar apartamento pelo Minha Casa Minha Vida",
    "Erros que podem reprovar seu financiamento imobiliario"
  ],

  "Apartamentos_MRV": [
    "Apartamento MRV vale a pena em 2026",
    "Como funciona a compra de um apartamento MRV",
    "Apartamento MRV na planta ou pronto: qual escolher",
    "Condominios MRV em Anapolis: guia completo",
    "Custos para morar em apartamento MRV",
    "Taxa de condominio MRV: quanto custa",
    "Como funciona a entrega das chaves da MRV",
    "Apartamento MRV para morar ou investir",
    "O que verificar antes de comprar um apartamento MRV",
    "Vantagens e desvantagens dos apartamentos MRV"
  ],

  "Financiamento_Imobiliario": [
    "Como funciona o financiamento imobiliario Caixa",
    "Quanto preciso dar de entrada para comprar um apartamento",
    "Financiamento Caixa ou Itau: qual vale mais a pena",
    "Como aumentar as chances de aprovacao no financiamento",
    "O que diminui o valor aprovado pela Caixa",
    "Como funciona a avaliacao do imovel pela Caixa",
    "Posso financiar mesmo com nome negativado",
    "Financiamento SAC ou PRICE: qual escolher",
    "Primeiro apartamento financiado: guia completo",
    "Tudo sobre financiamento de apartamento para iniciantes"
  ],

  "Custos_da_Compra": [
    "Quanto custa comprar um apartamento alem da entrada",
    "ITBI na compra do apartamento: como calcular",
    "Registro do imovel: quanto custa",
    "Escritura ou registro: qual a diferenca",
    "Quais taxas devo pagar ao comprar um apartamento",
    "Como economizar nos custos da compra do primeiro imovel",
    "Quem paga o ITBI",
    "Quanto custa transferir um apartamento",
    "Checklist financeiro para comprar apartamento",
    "Despesas mensais de quem mora em apartamento"
  ],

  "Mercado_Imobiliario_Anapolis": [
    "Melhores bairros para comprar apartamento em Anapolis",
    "Onde comprar apartamento barato em Anapolis",
    "Apartamento novo ou usado em Anapolis",
    "Bairros com maior potencial de valorizacao",
    "Vale a pena comprar apartamento em Anapolis",
    "Mercado imobiliario de Anapolis em 2026",
    "Quanto custa um apartamento em Anapolis",
    "Como escolher o melhor bairro para morar",
    "Apartamento para investir em Anapolis",
    "Tendencias do mercado imobiliario em Anapolis"
  ],

  "Condominio_Arcos_do_Paraiso": [
    "Condominio Arcos do Paraiso vale a pena",
    "Como e morar no Arcos do Paraiso",
    "Apartamento a venda no Arcos do Paraiso",
    "Quanto custa um apartamento no Arcos do Paraiso",
    "Infraestrutura do Condominio Arcos do Paraiso",
    "Taxa de condominio do Arcos do Paraiso",
    "Seguranca do Condominio Arcos do Paraiso",
    "Localizacao do Arcos do Paraiso",
    "Vantagens de morar no Arcos do Paraiso",
    "Guia completo do Condominio Arcos do Paraiso"
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