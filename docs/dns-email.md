# DNS Email — DKIM & DMARC pour marius-home.com

Document de référence, **rien n'a été modifié en DNS**. Toutes les actions listées ici sont
à réaliser manuellement par Marius dans Cloudflare DNS / la console d'administration Google
Workspace. Relevés effectués le 2026-08-09 depuis l'environnement de dev (Windows,
`Resolve-DnsName`, résolveur 1.1.1.1).

## 0. Constat DNS actuel — à lire avant tout le reste

```
> Resolve-DnsName -Name marius-home.com -Type TXT
v=spf1 include:_spf.mx.cloudflare.net ~all
```

**⚠️ Point critique qui change la donne par rapport à l'hypothèse de départ** : cet
enregistrement SPF autorise uniquement l'infrastructure mail de **Cloudflare**
(`_spf.mx.cloudflare.net` se résout en `ip4:104.30.0.0/19 ip6:2405:8100:c000::/38 ~all`,
vérifié). Il **n'inclut pas `_spf.google.com`**.

Concrètement : si Google Workspace envoie déjà des emails sortants au nom de
`marius-home.com` (ce que suggèrent les 3 enregistrements `google-site-verification`
trouvés), **ces envois échouent probablement déjà l'alignement SPF aujourd'hui** — en
`~all` (softfail) ils ne sont pas rejetés, mais ils sont pénalisés côté anti-spam et,
une fois DMARC activé même en `p=none`, les rapports agrégés (`rua`) le montreront
noir sur blanc dès la première semaine.

→ **Avant toute chose : confirmer si Google Workspace est bien l'outil d'envoi sortant.**
Si oui, l'ajout de `include:_spf.google.com` (étape 3 ci-dessous) n'est pas une option
de confort, c'est un prérequis pour que DKIM/DMARC aient un sens.

MX confirmés (identiques à l'audit) :
```
route1.mx.cloudflare.net (pref 31)
route2.mx.cloudflare.net (pref 20)
route3.mx.cloudflare.net (pref 83)
```
DKIM (`google._domainkey.marius-home.com`) : **absent** (NXDOMAIN), confirmé.
DMARC (`_dmarc.marius-home.com`) : **absent** (NXDOMAIN), confirmé.

Rappel du rôle de chaque brique, pour ne pas les confondre :
- **Cloudflare Email Routing** (les 3 MX) : reçoit et **transfère** le courrier entrant. Il
  n'envoie pas de mail *au nom du domaine* pour vos besoins (newsletters, contact, etc.).
- **Google Workspace** (3 `google-site-verification`) : c'est très probablement lui qui
  **envoie** le courrier sortant. C'est donc lui qui doit être signé en DKIM, et lui qui
  doit être couvert par le SPF.

## 1. Procédure DKIM — Google Workspace

1. Console d'administration Google (admin.google.com) → **Applications** → **Google
   Workspace** → **Gmail** → **Authentifier les e-mails**.
2. Sélectionner le domaine `marius-home.com`, générer une clé **2048 bits**, sélecteur
   par défaut `google` (donne l'enregistrement `google._domainkey`).
3. Google affiche une valeur TXT du type `v=DKIM1; k=rsa; p=MIGfMA0G...` (ne pas la
   recopier à l'avance ici : elle est unique et générée à la demande, l'inventer serait
   inutile et faux).
4. Créer dans **Cloudflare DNS** :
   - Nom : `google._domainkey`
   - Type : `TXT`
   - Valeur : coller exactement la chaîne fournie par Google (généralement scindée par
     Google en plusieurs segments entre guillemets si elle dépasse 255 caractères —
     suivre l'aide Google Workspace pour le format exact accepté par Cloudflare).
5. **Étape très souvent oubliée** : revenir dans la console Google Admin et cliquer sur
   **« Démarrer l'authentification »**. Sans ce clic, la clé publique est publiée en DNS
   mais Gmail ne signe aucun message — DKIM reste inactif malgré un enregistrement DNS
   présent et valide.
6. Attendre la propagation (Google indique généralement l'état "Authentification des
   e-mails activée" dans la console une fois le DNS lu correctement).

## 2. Vérification du SPF

Deux rôles à couvrir, un seul enregistrement `v=spf1` au total :

- **Envoi sortant (Google Workspace)** → nécessite `include:_spf.google.com`.
  **Absent aujourd'hui**, à ajouter si Workspace envoie bien du courrier (cf. §0).
- **Cloudflare Email Routing** → à vérifier avant de toucher au SPF : l'enregistrement
  actuel contient déjà `include:_spf.mx.cloudflare.net`, mais Cloudflare Email Routing
  transfère normalement le courrier entrant sans nécessiter d'inclusion SPF côté domaine
  d'origine (le forwarding altère l'enveloppe SMTP côté Cloudflare). Avant de le retirer,
  vérifier dans le tableau de bord Cloudflare (Email → Email Routing → DNS records) si
  Cloudflare recommande explicitement ce mécanisme pour votre configuration — ne pas le
  supprimer sans confirmation, un SPF qui casse le routing entrant est pire que rien.
- **Autre outil d'envoi ?** Si un service tiers envoie déjà au nom du domaine
  (newsletter, formulaire de contact server-side, notifications), l'identifier et
  ajouter son `include:` — sinon ses messages échoueront à l'alignement DMARC dès que
  `p=quarantine`/`p=reject` seront actifs. Rien de tel n'a été trouvé dans le dépôt
  (le formulaire de contact du site n'a pas de backend d'envoi identifié côté code —
  à confirmer côté Marius s'il existe un service externe branché dessus).

**Un seul enregistrement `v=spf1`** : deux enregistrements SPF distincts invalident tout
le SPF du domaine (RFC 7208). Si Google Workspace doit être ajouté, il faut **modifier
l'enregistrement existant** pour obtenir :
```
v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com ~all
```
et non créer un second TXT `v=spf1`.

**Limite des 10 résolutions DNS** : au-delà, le SPF renvoie `permerror` et est traité
comme absent. État vérifié :
- `_spf.mx.cloudflare.net` se résout en mécanismes `ip4`/`ip6` directs (0 sous-lookup).
- `_spf.google.com` se résout également en mécanismes `ip4`/`ip6` directs (0 sous-lookup).
- Total avec les deux inclus : **2 lookups** sur 10 — large marge, pas de risque de
  `permerror` avec cette combinaison précise.

## 3. Enregistrement DMARC — à créer

Démarrer strictement en mode observation :

```
Nom    : _dmarc
Type   : TXT
Valeur : v=DMARC1; p=none; rua=mailto:ADRESSE@marius-home.com; fo=1
```

`ADRESSE@marius-home.com` est à remplacer par une boîte réellement surveillée (ne pas
utiliser `Marius@viedelivres.fr` trouvé dans le footer du site sans vérifier qu'elle
appartient au même Workspace — les rapports DMARC sont volumineux et doivent atterrir
quelque part de consulté).

### Chemin de durcissement progressif

| Étape | Politique | Durée observation | Condition pour passer à la suivante |
|---|---|---|---|
| 1 | `p=none` | 2 à 4 semaines | Rapports `rua` ne montrent plus d'échec SPF/DKIM sur les sources légitimes (Google Workspace notamment, cf. §0) |
| 2 | `p=quarantine; pct=25` | 1 semaine | Aucun signalement de mail légitime en spam |
| 3 | `p=quarantine` (pct implicite 100) | 2 semaines | Toujours aucun faux positif |
| 4 | `p=reject` | — | Régime final |

### Pourquoi ne jamais sauter directement à `p=reject`

Un expéditeur légitime oublié dans le SPF (Workspace non couvert, un outil tiers non
identifié — exactement le risque déjà identifié au §0) verrait **ses messages
disparaître silencieusement** chez les destinataires qui respectent DMARC, sans bounce
visible pour l'expéditeur ni le destinataire. `p=none` permet de voir ces trous *avant*
qu'ils ne cassent la délivrabilité, via les rapports agrégés — c'est un filet de
sécurité, pas une étape optionnelle à sauter pour aller plus vite.

## 4. Vérifications après propagation

PowerShell (environnement Windows) :
```powershell
Resolve-DnsName -Name marius-home.com -Type TXT
Resolve-DnsName -Name google._domainkey.marius-home.com -Type TXT
Resolve-DnsName -Name _dmarc.marius-home.com -Type TXT
```
Équivalent `dig` (si disponible via WSL/Git Bash) :
```bash
dig +short TXT marius-home.com
dig +short TXT google._domainkey.marius-home.com
dig +short TXT _dmarc.marius-home.com
```

Outils externes :
- **MXToolbox** (SPF record check) : compte le nombre de lookups SPF, confirme l'absence
  de second enregistrement `v=spf1`.
- **Mail-Tester.com** : envoyer un message réel depuis Workspace vers l'adresse fournie,
  score détaillé SPF/DKIM/DMARC.
- **Google Postmaster Tools** (postmaster.google.com) : suivi de réputation du domaine
  dans le temps une fois DKIM/DMARC actifs — utile pour repérer une dégradation avant
  qu'elle n'affecte la délivrabilité globale.

## 5. Test de bout en bout

1. Envoyer un email depuis l'adresse Workspace du domaine vers une adresse Gmail
   personnelle.
2. Dans Gmail, ouvrir le message → menu ⋮ → **Afficher l'original**.
3. Vérifier les trois lignes :
   ```
   SPF: PASS
   DKIM: PASS (signature ok)
   DMARC: PASS
   ```
4. Si une seule des trois est `FAIL` ou `NONE`, ne pas avancer dans le durcissement
   DMARC (§3) tant que la cause n'est pas résolue.

## Ce qui reste à faire côté Marius (résumé)

1. Confirmer que Google Workspace est bien l'unique outil d'envoi sortant (§0).
2. Si oui : modifier le SPF existant pour ajouter `include:_spf.google.com` (§2) —
   **ne pas créer un second enregistrement**.
3. Générer et publier la clé DKIM Google Workspace, puis cliquer sur « Démarrer
   l'authentification » (§1, étape 5 — la plus souvent oubliée).
4. Créer l'enregistrement `_dmarc` en `p=none` (§3) avec une adresse `rua` réellement
   surveillée.
5. Suivre le calendrier de durcissement (§3) sur plusieurs semaines, ne pas accélérer.
6. Vérifier via Mail-Tester et le test Gmail (§4-5) après chaque changement.
