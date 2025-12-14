import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import logoImg from './images/logo2.jpg';

function App() {
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarProduto = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams(window.location.search);
        const idUrl = params.get("id");
        const buscaUrl = params.get("q");

        let produtoFinal = null;

        // PRIORIDADE 1 — ID direto (?id=MLB...)
        if (idUrl) {
          const res = await fetch(
            `https://api.mercadolibre.com/items/${idUrl}`
          );
          produtoFinal = await res.json();

        // PRIORIDADE 2 — Busca personalizada (?q=iphone)
        } else if (buscaUrl) {
          const res = await fetch(
            `https://api.mercadolibre.com/sites/MLB/search?q=${buscaUrl}&limit=20`
          );
          const data = await res.json();
          const lista = data.results || [];

          if (lista.length === 0) {
            throw new Error("Busca vazia");
          }

          produtoFinal = lista[Math.floor(Math.random() * lista.length)];

        // PRIORIDADE 3 — Automático (erro de preço)
        } else {
          const res = await fetch(
            "https://api.mercadolibre.com/sites/MLB/search" +
            "?category=MLB1648" +
            "&price=100-3000" +
            "&sort=discount_desc" +
            "&limit=20"
          );
          const data = await res.json();
          const lista = data.results || [];

          if (lista.length === 0) {
            throw new Error("Automático vazio");
          }

          produtoFinal = lista[Math.floor(Math.random() * lista.length)];
        }

        if (!produtoFinal || produtoFinal.error) {
          throw new Error("Produto inválido");
        }

        setProduto(produtoFinal);

      } catch (error) {
        console.error("Erro ao carregar produto:", error);
        setProduto(null);
      } finally {
        setLoading(false);
      }
    };

    carregarProduto();
  }, []);

  const formatMoney = (value) => {
    if (!value) return "—";
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  };

  const calcularDesconto = (original, atual) => {
    if (!original || !atual) return null;
    return Math.round(((original - atual) / original) * 100);
  };

  const imageUrl =
    produto?.pictures?.[0]?.url ||
    produto?.thumbnail?.replace("I.jpg", "W.jpg") ||
    "";

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
        <p className="headline">
          Pare de rasgar dinheiro. <br />
          Receba <span className="highlight">Erros de Preço</span> e Cupons Secretos no seu celular.
        </p>

        <a
          href="LINK_DO_SEU_GRUPO_WHATSAPP_AQUI"
          className="btn-whatsapp"
        >
          <FontAwesomeIcon icon={faWhatsapp} className="icon-zap" />
          ENTRAR NO GRUPO VIP ➤
        </a>

        <span className="secure-text">
          🔒 Grupo Silencioso | Sem Spam | 100% Grátis
        </span>

        <div className="daily-offer">
          <span className="offer-tag">🔥 Oportunidade Relâmpago</span>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <p>Buscando melhor oferta...</p>
            </div>
          ) : produto ? (
            <>
              <img
                src={imageUrl}
                alt={produto.title}
                style={{
                  width: '180px',
                  height: '180px',
                  objectFit: 'contain',
                  display: 'block',
                  margin: '10px auto'
                }}
              />

              <h3 style={{ fontSize: '1rem', lineHeight: '1.4', marginBottom: '10px' }}>
                {produto.title}
              </h3>

              <p style={{ fontSize: '1.2rem', marginTop: '10px' }}>
                {produto.original_price && (
                  <>
                    De:{' '}
                    <strike style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                      {formatMoney(produto.original_price)}
                    </strike>
                    <br />
                  </>
                )}
                Por:{' '}
                <strong style={{ color: '#0F172A', fontSize: '1.5rem' }}>
                  {formatMoney(produto.price)}
                </strong>
              </p>

              {produto.original_price && (
                <div
                  style={{
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    marginTop: '5px'
                  }}
                >
                  {calcularDesconto(produto.original_price, produto.price)}% OFF
                </div>
              )}

              <a
                href={produto.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-offer"
              >
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
