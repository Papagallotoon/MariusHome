import type { Metadata } from "next";
import { siteConfig } from "../../../config/site";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { getPageJsonLd } from "@/lib/jsonld";

const pageDescription = `Contactez ${siteConfig.siteName}. Une question, une suggestion ou une demande de partenariat ? Écrivez-nous.`;

export const metadata: Metadata = {
  title: "Contact",
  description: pageDescription,
};

export default function ContactPage() {
  const pageUrl = `${siteConfig.domain}/contact`;

  return (
    <>
      <JsonLd
        data={getPageJsonLd({
          url: pageUrl,
          name: "Nous contacter",
          description: pageDescription,
          breadcrumbItems: [
            { name: "Accueil", url: siteConfig.domain },
            { name: "Contact", url: pageUrl },
          ],
        })}
      />
      <section
        className="py-16 md:py-24 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${siteConfig.colors.primaryDark}, ${siteConfig.colors.primary})` }}
      >
        <div
          className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: siteConfig.colors.vivid, filter: "blur(60px)" }}
        />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-white">Contact</span>
          </nav>
          <span className="kicker kicker-light mb-4">Parlons déco</span>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-serif">Nous contacter</h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl">
            Une question sur la décoration, une suggestion d&apos;article ou une demande de collaboration ? N&apos;hésitez pas à nous écrire.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <span className="kicker mb-3">Contact direct</span>
            <h2 className="text-2xl font-bold text-site-text mb-6 font-serif">Restons en contact</h2>
            <p className="text-site-text leading-relaxed mb-8">
              Je lis personnellement chaque message et je fais de mon mieux pour répondre
              sous 48 heures. Que vous ayez une question sur un article, une idée de sujet
              à traiter ou simplement envie d&apos;échanger sur la déco, je serai ravi de
              vous lire.
            </p>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: siteConfig.colors.primaryLight }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={siteConfig.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 4l-10 8L2 4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-site-text mb-1">Email</h3>
                  <a
                    href="mailto:marius@viedelivres.fr"
                    className="font-medium hover:underline"
                    style={{ color: siteConfig.colors.primary }}
                  >
                    marius@viedelivres.fr
                  </a>
                  <p className="text-sm text-text-muted mt-1">Réponse sous 48h en moyenne</p>
                </div>
              </div>

              {/* Topics */}
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: siteConfig.colors.accentLight }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={siteConfig.colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-site-text mb-1">Sujets de contact</h3>
                  <ul className="text-sm text-text-muted space-y-1">
                    <li>Question sur un article ou un produit</li>
                    <li>Suggestion de sujet ou de comparatif</li>
                    <li>Demande de partenariat ou collaboration</li>
                    <li>Signalement d&apos;erreur ou de lien cassé</li>
                  </ul>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: siteConfig.colors.primaryLight }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={siteConfig.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-site-text mb-1">Localisation</h3>
                  <p className="text-sm text-text-muted">Lyon, France</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div>
            <div
              className="rounded-sm p-8 border"
              style={{ background: siteConfig.colors.primaryLight, borderColor: `${siteConfig.colors.primary}20`, borderTop: `3px solid ${siteConfig.colors.vivid}` }}
            >
              <h3 className="text-xl font-bold text-site-text mb-4 font-serif">Écrivez-moi directement</h3>
              <p className="text-site-text leading-relaxed mb-6">
                Le moyen le plus rapide de me joindre est par email. Décrivez votre demande
                le plus précisément possible pour que je puisse vous aider au mieux.
              </p>
              <a
                href="mailto:marius@viedelivres.fr?subject=Contact depuis Marius Dumas Home"
                className="vivid-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 4l-10 8L2 4" />
                </svg>
                Envoyer un email
              </a>

              <div className="mt-8 pt-6 border-t" style={{ borderColor: `${siteConfig.colors.primary}20` }}>
                <h4 className="font-semibold text-site-text mb-3">Pour un échange constructif :</h4>
                <ul className="text-sm text-text-muted space-y-2">
                  <li className="flex items-start gap-2">
                    <span style={{ color: siteConfig.colors.gold }}>&#10003;</span>
                    Précisez le sujet de votre message dans l&apos;objet
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: siteConfig.colors.gold }}>&#10003;</span>
                    Si votre question concerne un article, incluez le lien
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: siteConfig.colors.gold }}>&#10003;</span>
                    Pour une suggestion de comparatif, décrivez le type de produit
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 pt-12 border-t border-site-border">
          <div className="text-center mb-8">
            <span className="kicker kicker-center mb-3">Avant d&apos;écrire</span>
            <h2 className="text-2xl font-bold text-site-text font-serif">Questions fréquentes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-sm border border-site-border bg-surface">
              <h3 className="font-semibold text-site-text mb-2 font-serif">Acceptez-vous les partenariats ?</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Oui, je suis ouvert aux collaborations avec des marques de décoration et d&apos;ameublement
                qui partagent mes valeurs de qualité. Envoyez-moi votre proposition par email.
              </p>
            </div>
            <div className="p-6 rounded-sm border border-site-border bg-surface">
              <h3 className="font-semibold text-site-text mb-2 font-serif">Puis-je suggérer un sujet d&apos;article ?</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Absolument ! Vos suggestions m&apos;aident à créer du contenu qui répond vraiment à vos besoins.
                N&apos;hésitez pas à me décrire le sujet qui vous intéresse.
              </p>
            </div>
            <div className="p-6 rounded-sm border border-site-border bg-surface">
              <h3 className="font-semibold text-site-text mb-2 font-serif">Proposez-vous des consultations déco ?</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Pour l&apos;instant, je me concentre sur la création de contenu en ligne. Mais n&apos;hésitez pas
                à me poser vos questions par email, je fais de mon mieux pour vous orienter.
              </p>
            </div>
            <div className="p-6 rounded-sm border border-site-border bg-surface">
              <h3 className="font-semibold text-site-text mb-2 font-serif">Comment signaler un lien cassé ?</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Envoyez-moi un email avec le lien de l&apos;article concerné et le produit en question.
                Je corrige les liens cassés en priorité pour garantir la meilleure expérience possible.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center pt-8 border-t border-site-border">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide editorial-link"
            style={{ color: siteConfig.colors.vivid }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </>
  );
}
