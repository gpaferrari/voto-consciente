/**
 * Serviço de Integração com APIs Públicas e Oficiais do Brasil
 * 
 * 1. API da Câmara dos Deputados (v2) - CORS Aberto
 * 2. API do Banco Central do Brasil (SGS) - Séries Temporais Oficiais
 */

export interface CamaraDeputySummary {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
  email: string;
}

export interface BCBSeriesItem {
  data: string;
  valor: string;
}

/**
 * Busca deputados federais em tempo real na API da Câmara dos Deputados
 */
export async function searchDeputiesByName(name: string): Promise<CamaraDeputySummary[]> {
  try {
    const url = `https://dadosabertos.camara.leg.br/api/v2/deputados?nome=${encodeURIComponent(name)}&ordem=ASC&ordenarPor=nome`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.dados || [];
  } catch (err) {
    console.warn('Falha na consulta em tempo real da API da Câmara (usando dados locais):', err);
    return [];
  }
}

/**
 * Consulta a última taxa SELIC na API do Banco Central (Série 432)
 */
export async function fetchLatestSelicRate(): Promise<string | null> {
  try {
    const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json');
    if (!response.ok) return null;
    const data: BCBSeriesItem[] = await response.json();
    return data && data.length > 0 ? `${data[0].valor}%` : null;
  } catch (err) {
    console.warn('API BCB SGS offline:', err);
    return null;
  }
}

/**
 * Consulta o último IPCA acumulado de 12 meses na API do Banco Central (Série 13522)
 */
export async function fetchLatestIpcaRate(): Promise<string | null> {
  try {
    const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados/ultimos/1?formato=json');
    if (!response.ok) return null;
    const data: BCBSeriesItem[] = await response.json();
    return data && data.length > 0 ? `${data[0].valor}%` : null;
  } catch (err) {
    console.warn('API BCB SGS offline:', err);
    return null;
  }
}
