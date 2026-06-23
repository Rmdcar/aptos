// arquivo: gerar-post.mjs
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ai = new GoogleGenAI({}); 

// Função para transformar o título em um link amigável (remove acentos e espaços)
function criarSlug(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9]+/g, "-")     // Troca espaços por hífen
    .replace(/(^-|-$)+/g, "");       // Tira hifens sobrando nas pontas
}

async function automatizarBlog() {
  const dataHoje = new Date().toISOString().split('T')[0];

  // 1. SUA LISTA DE PAUTAS (Você pode adicionar quantos assuntos quiser aqui)
  const listaDeAssuntos = [
    "Como usar o FGTS na compra do primeiro apartamento",
    "Qual a documentação necessária para transferência de imóvel",
    "Bairros com maior potencial de valorização em Anápolis",
    "Vantagens de comprar um apartamento novo versus usado",
    "Como financiar um imóvel pela Caixa Econômica",
    "Dicas de investimento imobiliário: como avaliar o valor de mercado"
  ];

  // 2. ESCOLHE UM ASSUNTO ALEATÓRIO DA LISTA
  const assuntoEscolhido = listaDeAssuntos[Math.floor(Math.random() * listaDeAssuntos.length)];
  
  // 3. GERA A URL DINÂMICA BASEADA NO ASSUNTO
  const slug = `${criarSlug(assuntoEscolhido)}-${Date.now()}`;
  
  console.log(`🤖 1. Solicitando artigo ao Gemini sobre: "${assuntoEscolhido}"...`);

  // O prompt agora usa a variável ${assuntoEscolhido}
  const prompt = `
    Aja como um perito e investidor imobiliário experiente que atua em Anápolis, Goiás.
    Escreva um artigo de blog altamente técnico, persuasivo e focado em SEO sobre o seguinte tema: "${assuntoEscolhido}".
    
    Traga uma visão analítica baseada em dados locais. Quando falar sobre valores ou análises de mercado, ensine o leitor a avaliar o preço do metro quadrado real, reforçando a importância fundamental de excluir os ágios de financiamentos anteriores das pesquisas para não distorcer o valor aritmético final da propriedade. Aborde também impactos de impostos municipais (ITBI, IPTU) quando for pertinente ao tema.
    
    O formato de saída DEVE ser EXATAMENTE um arquivo MDX válido, incluindo o frontmatter no topo, conforme o modelo abaixo. Não adicione nenhum texto antes ou depois.

    ---
    titulo: "Insira um título chamativo e otimizado para SEO aqui"
    resumo: "Insira um resumo persuasivo de 2 linhas aqui"
    data: "${dataHoje}"
    ---

    # Seu conteúdo começa aqui com Markdown...
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let conteudoMdx = response.text;

    // Limpeza robusta das marcações de código
    conteudoMdx = conteudoMdx.trim();
    conteudoMdx = conteudoMdx.replace(/^```(mdx|markdown|md)?\s*/i, '');
    conteudoMdx = conteudoMdx.replace(/\s*```$/i, '');
    conteudoMdx = conteudoMdx.trim();

    console.log("✅ 2. Artigo gerado! Salvando arquivo...");

    const pastaConteudo = path.join(__dirname, 'conteudo');
    
    if (!fs.existsSync(pastaConteudo)){
        fs.mkdirSync(pastaConteudo);
    }

    const caminhoArquivo = path.join(pastaConteudo, `${slug}.mdx`);
    fs.writeFileSync(caminhoArquivo, conteudoMdx);

    console.log(`📝 3. Arquivo salvo em: ${caminhoArquivo}`);
    console.log("🚀 4. Enviando para o GitHub para atualizar o site live...");

    execSync('git add .');
    execSync(`git commit -m "Auto-post: Artigo gerado sobre ${assuntoEscolhido}"`);
    execSync('git push origin main'); 

    console.log("🎉 Sucesso! O site já está sendo atualizado pela Vercel.");

  } catch (erro) {
    console.error("❌ Ocorreu um erro:", erro);
  }
}

automatizarBlog();