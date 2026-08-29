"use client";
import { useState, useRef, useEffect } from "react";
import { siteConfig } from "../../config/site";

interface Message {
  from: "user" | "bot";
  text: string;
}

function removeAccents(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function matchKeywords(input: string, keywords: string[]): boolean {
  const normalized = removeAccents(input.toLowerCase());
  return keywords.some((kw) => normalized.includes(removeAccents(kw.toLowerCase())));
}

const faqTopics: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["bonjour", "salut", "hello", "hey", "coucou", "bonsoir"],
    answer:
      "Bonjour ! Bienvenue sur Marius Dumas Home. Je suis votre assistant deco. Comment puis-je vous aider aujourd'hui ?",
  },
  {
    keywords: ["conseil", "aide deco", "decoration", "decorer", "amenager", "amenagement", "idee"],
    answer:
      "Pour un interieur harmonieux, je recommande de commencer par choisir une palette de 3 couleurs maximum. Explorez nos categories pour trouver des pieces qui s'accordent : textiles, luminaires, art mural... Chaque article propose des associations testees par notre equipe !",
  },
  {
    keywords: ["bougie", "parfum", "senteur", "odeur", "ambiance olfactive"],
    answer:
      "Les bougies sont essentielles pour creer une ambiance chaleureuse ! Nous avons selectionne les meilleures bougies parfumees sur Amazon : cire de soja, meches en coton, parfums naturels. Consultez notre categorie Bougies & Parfums pour nos comparatifs detailles.",
  },
  {
    keywords: ["coussin", "textile", "plaid", "couverture", "tissu", "housse"],
    answer:
      "Les textiles transforment instantanement un espace ! Coussins en lin, plaids en laine merinos, housses en velours... Notre experte Camille selectionne les plus belles matieres. Decouvrez nos picks dans la categorie Coussins & Textiles.",
  },
  {
    keywords: ["luminaire", "lampe", "eclairage", "lumiere", "lustre", "suspension"],
    answer:
      "L'eclairage fait toute la difference ! Notre specialiste Antoine recommande de combiner 3 sources : general, d'ambiance et d'accentuation. Retrouvez nos selections de luminaires design a prix accessibles dans notre categorie dediee.",
  },
  {
    keywords: ["prix", "amazon", "affiliation", "lien", "partenaire", "commission", "gratuit"],
    answer:
      "Tous nos liens menent vers Amazon.fr. En tant que partenaire Amazon, nous touchons une petite commission sur les achats qualifies, sans aucun surcout pour vous ! Cela nous permet de continuer a proposer des guides gratuits et independants.",
  },
  {
    keywords: ["contact", "email", "mail", "joindre", "ecrire", "question"],
    answer:
      "Vous pouvez nous contacter par email a Marius@viedelivres.fr. Notre equipe repond generalement sous 48h. Pour les questions frequentes sur la deco, n'hesitez pas a me poser vos questions ici !",
  },
  {
    keywords: ["tendance", "2026", "mode", "nouveau", "nouveaute", "actuel"],
    answer:
      "Les tendances deco 2026 : le retour des courbes organiques, les teintes terre (terracotta, sauge, sable), le japandi revisite, et les matieres brutes (pierre, bois, lin). Consultez nos derniers articles pour des inspirations a jour !",
  },
  {
    keywords: ["plante", "vase", "vegetal", "fleur", "nature", "vert"],
    answer:
      "Les plantes et vases apportent vie et fraicheur a tout interieur ! Nous recommandons des vases en ceramique artisanale et des plantes faciles d'entretien (monstera, pothos, sansevieria). Explorez notre categorie Vases, Plantes & Deco Naturelle.",
  },
];

const defaultAnswer =
  "Je ne suis pas certain de comprendre votre question. Vous pouvez me demander des conseils deco, des infos sur nos categories (bougies, coussins, luminaires, plantes...), les tendances 2026, ou comment nous contacter. Je ferai de mon mieux pour vous aider !";

const quickSuggestions = [
  "Conseils deco",
  "Tendances 2026",
  "Bougies parfumees",
  "Nous contacter",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function getBotAnswer(userText: string): string {
    for (const topic of faqTopics) {
      if (matchKeywords(userText, topic.keywords)) {
        return topic.answer;
      }
    }
    return defaultAnswer;
  }

  function sendMessage(text: string) {
    if (!text.trim()) return;
    setHasInteracted(true);
    const userMsg: Message = { from: "user", text: text.trim() };
    const botMsg: Message = { from: "bot", text: getBotAnswer(text.trim()) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  }

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${siteConfig.colors.gold}, ${siteConfig.colors.goldDark})`,
          }}
          aria-label="Ouvrir le chat"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[380px] max-h-[70vh] sm:max-h-[520px] flex flex-col rounded-2xl shadow-2xl overflow-hidden animate-slide-up border border-site-border">
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: siteConfig.colors.primaryDark }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: siteConfig.colors.gold }}
              >
                M
              </div>
              <div>
                <p className="text-white text-sm font-semibold font-serif">Marius Dumas</p>
                <p className="text-white/60 text-xs">Assistant deco</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Fermer le chat"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white" style={{ maxHeight: 340 }}>
            {/* Welcome message */}
            <div className="flex gap-2">
              <div
                className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                style={{ background: siteConfig.colors.gold }}
              >
                M
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-site-text max-w-[85%]">
                Bonjour ! Je suis l&apos;assistant de Marius Dumas Home. Posez-moi vos questions sur la deco, nos selections ou nos categories !
              </div>
            </div>

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.from === "user" ? "justify-end" : ""}`}>
                {msg.from === "bot" && (
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: siteConfig.colors.gold }}
                  >
                    M
                  </div>
                )}
                <div
                  className={`rounded-2xl px-3 py-2 text-sm max-w-[85%] ${
                    msg.from === "user"
                      ? "rounded-tr-sm text-white"
                      : "rounded-tl-sm bg-gray-100 text-site-text"
                  }`}
                  style={
                    msg.from === "user"
                      ? { background: siteConfig.colors.primary }
                      : undefined
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {!hasInteracted && (
            <div className="flex flex-wrap gap-2 px-4 py-2 bg-white border-t border-gray-100">
              {quickSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-sm sm:text-xs px-3 py-2 sm:py-1.5 rounded-full border transition-colors hover:text-white"
                  style={{
                    borderColor: siteConfig.colors.gold,
                    color: siteConfig.colors.goldDark,
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = siteConfig.colors.gold;
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = "transparent";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white border-t border-gray-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage(input);
              }}
              placeholder="Posez votre question..."
              className="flex-1 text-sm px-3 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-gold"
              style={{ color: siteConfig.colors.text }}
            />
            <button
              onClick={() => sendMessage(input)}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
              style={{ background: siteConfig.colors.gold }}
              aria-label="Envoyer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
