// app/sitemap.ts
import type { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://apartamentoanapolis.online'
  
  // 1. Páginas estáticas principais do site
  const paginasEstaticas: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // 2. Leitura dinâmica da pasta de conteúdos para mapear os artigos MDX
  const pastaConteudo = path.join(process.cwd(), 'conteudo')
  
  // Se a pasta existir, varre os arquivos para incluí-los no mapa
  if (fs.existsSync(pastaConteudo)) {
    const arquivos = fs.readdirSync(pastaConteudo).filter(arq => arq.endsWith('.mdx'))
    
    const artigosSitemap = arquivos.map(arquivo => {
      const slug = arquivo.replace('.mdx', '')
      const caminhoCompleto = path.join(pastaConteudo, arquivo)
      
      // Obtém as estatísticas do arquivo físico para saber a data real de modificação
      const statusArquivo = fs.statSync(caminhoCompleto)
      
      return {
        url: `${baseUrl}/blog/${slug}`,
        lastModified: statusArquivo.mtime, // Atualiza a data no Google apenas se o arquivo mudar
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }
    })
    
    // Junta as páginas principais com a lista de artigos gerados por IA
    return [...paginasEstaticas, ...artigosSitemap]
  }

  return paginasEstaticas
}