import React, { useState, useEffect } from 'react';
import './App.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import logoImg from './images/logo2.jpg'; 

function App() {
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  // SEU WORKER (Certifique-se de que este link está correto)
  const WORKER_URL = "https://api-vitrine.devrod1701.workers.dev"; 

  useEffect(() => {
    const carregarProduto = async () => {
      try {
        setLoading(true);

        // 1. Verifica se tem busca manual na URL (?id=... ou ?q=...)
        const params = new URLSearchParams(window.location.search);
        const idUrl = params.get('id'); 
        const buscaUrl = params.get('q'); 

        let endpoint = '';

        if (idUrl) {
            // Prioridade 1: Link direto com ID (ex: ?id=MLB...)
            const cleanId = idUrl.replace(/-/g, '').trim();
            endpoint = `https://api.mercadolibre.com/items/${cleanId}`;
        } else if (buscaUrl) {
            // Prioridade 2: Link de busca (ex: ?q=iphone)
            endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${buscaUrl}&limit=1`;
        } else {
            // Prioridade 3 (Automática): Buscar lista via Worker e SORTEAR
            try {
                const workerResponse = await fetch(WORKER_URL);
                const workerData = await workerResponse.json();

                if (workerData.ids && workerData.ids.length > 0) {
                  // --- AQUI ESTÁ O SORTEIO ALEATÓRIO ---
                  // Escolhe um número aleatório entre 0 e o tamanho da lista
                  const indiceAleatorio = Math.floor(Math.random() * workerData.ids.length);
                  const idSorteado = workerData.ids[indiceAleatorio]; 
                  
                  endpoint = `https://api.mercadolibre.com/items/${idSorteado}`;
                } else {
                  // Fallback: Se a lista vier vazia, mostra um produto padrão
                  endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=fone%20bluetooth&limit=1`;
                }
            } catch (workerError) {
                console.error("Erro no Worker:", workerError);
                // Fallback de segurança se o Worker falhar
                const ID_BACKUP = "MLB3402773599"; // Ar Condicionado (exemplo)
                endpoint = `https://api.mercadolibre.com/items/${ID_BACKUP}`;
            }
        }

        // 2. Busca os detalhes do produto final na API do ML
        const response = await fetch(endpoint);
        const data = await response.json();

        let itemEncontrado = null;
        if (data.results && data.results.length > 0) {
            itemEncontrado = data.results[0];
        } else if (data.id) {
            itemEncontrado = data;
        }

        setProduto(itemEncontrado);

      } catch (error) {
        console.error("Erro geral:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarProduto();
  }, []);

  const formatMoney = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const calcularDesconto = (original, atual) => {
    if (!original) return null;
    return Math.round(((original - atual) / original) * 100);
  };

  return (
    <div className="container">
      <header>
        <div className="logo-area">
           <img src={logoImg} alt="Logo" />
        </div>
        <h1>Ofertas Premium BR</h1>
        <p className="subtitle">Monitoramos os preços 24h por dia.</p>
      </header>

      <main>
        <p className="headline">Pare de rasgar dinheiro. <br />Receba <span className="highlight">Erros de Preço</span> e Cupons Secretos no seu celular.</p>

        <a href="LINK_DO_SEU_GRUPO_WHATSAPP_AQUI" className="btn-whatsapp">
          <FontAwesomeIcon icon={faWhatsapp} className="icon-zap" />
          ENTRAR NO GRUPO VIP ➤
        </a>
        <span className="secure-text">🔒 Grupo Silencioso | Sem Spam | 100% Grátis</span>

        <div className="daily-offer">
          <span className="offer-tag">🔥 Oportunidade Relâmpago</span>
          
          {loading ? (
            <div style={{padding: '40px', textAlign: 'center'}}>
               <p>Buscando melhor oferta...</p>
            </div>
          ) : produto ? (
            <>
              <img 
                src={produto.thumbnail ? produto.thumbnail.replace('I.jpg', 'W.jpg') : ''} 
                alt={produto.title} 
                style={{
                    width: '180px', 
                    height: '180px', 
                    objectFit: 'contain', 
                    display: 'block', 
                    margin: '10px auto'
                }}
              />
              
              <h3 style={{fontSize: '1rem', lineHeight: '1.4', marginBottom: '10px'}}>
                {produto.title}
              </h3>
              
              <p style={{ fontSize: '1.2rem', marginTop: '10px' }}>
                {produto.original_price && (
                  <>De: <strike style={{color: '#94a3b8', fontSize: '0.9rem'}}>{formatMoney(produto.original_price)}</strike><br/></>
                )}
                Por: <strong style={{color: '#0F172A', fontSize: '1.5rem'}}>{formatMoney(produto.price)}</strong>
              </p>

              {produto.original_price && (
                <div style={{
                    backgroundColor: '#dcfce7', color: '#166534', display: 'inline-block',
                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                    fontWeight: 'bold', marginTop: '5px'
                }}>
                  {calcularDesconto(produto.original_price, produto.price)}% OFF
                </div>
              )}
              
              <a href={produto.permalink} target="_blank" rel="noopener noreferrer" className="btn-offer">
                Ver Detalhes no ML
              </a>
            </>
          ) : (
            <p>Oferta expirada ou não encontrada.</p>
          )}
        </div>
      </main>

      <footer>
        <p>© 2025 Oferta Premium BR.</p>
      </footer>
    </div>
  );
}

export default App;