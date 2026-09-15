"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

// OAuth redirect target for the Pinterest API. The local get-pinterest-token.mjs
// script can't receive the code itself, so this page just displays it to be
// pasted back there.
function CallbackContent() {
  const params = useSearchParams();
  const code = params.get("code");
  const error = params.get("error");
  const [copied, setCopied] = useState(false);

  if (error) {
    return <p className="mt-6 text-red-700">Autorisation refusée : {params.get("error_description") || error}</p>;
  }
  if (!code) {
    return <p className="mt-6">Aucun code reçu. Relancez la connexion depuis le script.</p>;
  }

  return (
    <>
      <p className="mt-6">Copiez ce code et collez-le dans le terminal :</p>
      <pre className="mt-4 overflow-x-auto rounded bg-black/5 p-4 text-xs break-all whitespace-pre-wrap">{code}</pre>
      <button
        type="button"
        className="mt-4 rounded bg-black px-4 py-2 text-white"
        onClick={async () => {
          await navigator.clipboard.writeText(code);
          setCopied(true);
        }}
      >
        {copied ? "Copié ✓" : "Copier le code"}
      </button>
    </>
  );
}

export default function PinterestCallbackPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold">Connexion Pinterest</h1>
      <Suspense fallback={<p className="mt-6">Chargement…</p>}>
        <CallbackContent />
      </Suspense>
    </div>
  );
}
