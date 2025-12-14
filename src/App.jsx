import React, { useEffect, useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import logoImg from "./images/logo2.jpg";

import arBritania from "./images/ar-britania.jpg";
import foneJBL from "./images/fone.jpg";
import tvSamsung from "./images/tv.jpg";
import airFry from "./images/air-fry.jpg";

// 🔥 PRODUTOS FIXOS
const PRODUTOS = [
  {
    id: "ar",
    title: "Ar Condicionado Split Britânia 12000 BTUs Frio",
    image: arBritania,
    maxDiscount: 20
  },
  {
    id: "fone",
    title: "Fone de Ouvido Bluetooth JBL Tune 510BT",
    image: foneJBL,
    maxDiscount: 40
  },
  {
    id: "tv",
    title: 'Smart TV Samsung 50" Crystal UHD 4K',
    image: tvSamsung,
    maxDiscount: 30
  },
  {
    id: "airfry",
    title: "Fritadeira Elétrica Air Fryer Mondial 4L",
    image: airFry,
    maxDiscount: 51
  }
];

// 🔧 FUNÇÕES COOKIE
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

function App() {
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔗 LINK AFILIADO ÚNICO
  const LINK_AFILIADO = "https://mercadolivre.com/sec/32eptA4";

  useEffect(() => {
    setLoading(true);

    // 📦 Produtos já vistos
    const vistosCookie = getCookie("produtos_vistos");
    let vistos = vistosCookie ? JSON.parse(vistosCookie) : [];

    // 🔄 Filtra produtos ainda não vistos
    let disponiveis = PRODUTOS.filter(
      (p) => !vistos.includes(p.id)
    );

    // 🔁 Se todos já foram vistos, reseta
    if (disponiveis.length === 0) {
      vistos = [];
      disponiveis = [...PRODUTOS];
    }

    // 🎲 Sorteia
    const sorteado =
      disponiveis[Math.floor(Math.random() * disponiveis.length)];

    // 💾 Atualiza cookie
    const novosVistos = [...vistos, sorteado.id];
    setCookie(
      "produtos_vistos",
      JSON.stringify(novosVistos),
      7 // dias
    );

    setProduto(sorteado);
    setLoading(false);
  }, []);

  return (
    <div className="container">
      <header>
        <div className="logo-area">
          <img src={logoImg} alt="Logo" />
        </div>
        <h1>Ofertas Premium BR</h1>
        <p className="subtitle">
          Descontos reais aplicados direto no Mercado Livre
        </p>
      </header>

      <main>
        
        <p className="headline">
          💥 Pare de rasgar dinheiro! <br />
          Receba  <span className="highlight">Erros de Preço e Cupons Secretos</span> no seu celular.
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
          <span className="offer-tag">
            🔥 DESCONTO ATIVO AGORA
          </span>

          {loading || !produto ? (
            <p>Carregando melhor oferta...</p>
          ) : (
            <>
              <img
                src={produto.image}
                alt={produto.title}
                style={{
                  width: "180px",
                  height: "180px",
                  objectFit: "contain",
                  margin: "10px auto",
                  display: "block"
                }}
              />

              <h3 style={{ fontSize: "1rem", marginBottom: "10px" }}>
                {produto.title}
              </h3>

              <div
                className="discount-badge"
                style={{ fontSize: "1.2rem", padding: "10px 16px" }}
              >
                ATÉ {produto.maxDiscount}% OFF
              </div>

              <p style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                ⏳ Oferta pode acabar a qualquer momento <br />
                💥 Desconto aplicado direto no Mercado Livre
              </p>

              <a
                href={LINK_AFILIADO}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-offer"
              >
                Ver ofertas com desconto agora
              </a>
            </>
          )}
        </div>
      </main>

      <footer>
        <p>© 2025 Ofertas Premium BR.</p>
      </footer>
    </div>
  );
}

export default App;
