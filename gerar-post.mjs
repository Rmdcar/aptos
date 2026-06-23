// arquivo: gerar-post.js
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Configuração de caminhos do Node
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializa a API do Gemini
const ai = new GoogleGenAI({}); 

async function automatizarBlog() {
  const dataHoje = new Date().toISOString().split('T')[0]; // Ex: 2026-06-23
  const slug = `analise-mercado-imobiliario-anapolis-${Date.now()}`; // URL única
  
  console.log("🤖 1. Solicitando artigo ao Gemini...");

  // O prompt instrui o Gemini a usar a sua visão técnica
  const prompt = `
    Aja como um perito e investidor imobiliário experiente que atua em Anápolis, Goiás.
    Escreva um artigo de blog altamente técnico e persuasivo sobre a "Valorização Imobiliária na região do Arcos do Paraíso e cuidados tributários".
    Traga uma visão analítica: ensine o leitor a avaliar o preço do metro quadrado real, reforçando a importância de excluir os ágios de financiamentos anteriores das pesquisas para não distorcer o valor da propriedade.
    
    O formato de saída DEVE ser EXATAMENTE um arquivo MDX válido, incluindo o frontmatter no topo, conforme o modelo abaixo. Não adicione nenhum texto antes ou depois.

    ---
    titulo: "Insira um título chamativo aqui"
    resumo: "Insira um resumo de 2 linhas aqui"
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

    // ---------------------------------------------------------
    // CORREÇÃO: Limpeza robusta das marcações de código
    // ---------------------------------------------------------
    conteudoMdx = conteudoMdx.trim();
    conteudoMdx = conteudoMdx.replace(/^```(mdx|markdown|md)?\s*/i, '');
    conteudoMdx = conteudoMdx.replace(/\s*```$/i, '');
    conteudoMdx = conteudoMdx.trim();
    // ---------------------------------------------------------

    console.log("✅ 2. Artigo gerado! Salvando arquivo...");

    // Define onde a pasta 'conteudo' fica no seu projeto
    const pastaConteudo = path.join(__dirname, 'conteudo');
    
    // Cria a pasta se ela não existir
    if (!fs.existsSync(pastaConteudo)){
        fs.mkdirSync(pastaConteudo);
    }

    const caminhoArquivo = path.join(pastaConteudo, `${slug}.mdx`);
    fs.writeFileSync(caminhoArquivo, conteudoMdx);

    console.log(`📝 3. Arquivo salvo em: ${caminhoArquivo}`);
    console.log("🚀 4. Enviando para o GitHub para atualizar o site live...");

    // Executa os comandos Git direto pelo Node
    execSync('git add .');
    execSync(`git commit -m "Auto-post: Novo artigo MDX gerado via Gemini"`);
    execSync('git push origin main'); // Substitua 'main' se sua branch principal for 'master'

    console.log("🎉 Sucesso! O site já está sendo atualizado pela Vercel.");

  } catch (erro) {
    console.error("❌ Ocorreu um erro:", erro);
  }
}

automatizarBlog();