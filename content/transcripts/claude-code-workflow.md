---
youtube_url: https://www.youtube.com/watch?v=dQw4w9WgXcQ
title: "Comment j'utilise Claude Code pour coder 10x plus vite"
tags: ["claude-code", "ia", "productivité", "solopreneur"]
---

Bon aujourd'hui je vais vous montrer exactement comment j'utilise Claude Code dans mon workflow quotidien parce que franchement ça a changé ma manière de travailler de manière radicale.

Donc Claude Code c'est l'outil en ligne de commande d'Anthropic. C'est pas juste un chat avec un LLM, c'est un agent qui peut lire vos fichiers, exécuter des commandes, modifier du code, tout ça directement dans votre terminal.

La première chose que j'ai faite c'est de créer un fichier CLAUDE.md à la racine de mon projet. Ce fichier c'est en gros les instructions permanentes que Claude va lire à chaque session. Donc au lieu de réexpliquer le contexte à chaque fois — le stack technique, les conventions de code, ce que je veux éviter — je l'écris une fois et c'est tout. C'est un gain de temps énorme.

Deuxième truc qui m'a bluffé : les MCP servers. MCP c'est Model Context Protocol, c'est un standard open source qui permet à Claude d'avoir des outils supplémentaires. Par exemple j'ai configuré un MCP Sanity qui lui permet de créer des articles directement dans mon CMS. Je lui donne un transcript de vidéo YouTube et il génère un article de blog formaté et le publie en draft dans Sanity. Automatiquement. Sans que je touche à rien.

Concrètement mon workflow maintenant c'est ça : je récupère la transcription automatique de YouTube, je la copie dans un fichier markdown, je dis à Claude Code "publie ce transcript", et il se charge du reste. Il lit le fichier, génère l'article selon mes règles de style, et crée le document dans Sanity via le MCP. Ça me prend deux minutes là où ça m'en prenait quarante-cinq avant.

Le truc important c'est le fichier de prompt. J'ai un fichier BLOG_PROMPT.md qui contient toutes mes règles éditoriales. Longueur, ton, structure, format de sortie en JSON. Claude le lit et produit quelque chose de cohérent avec ma ligne éditoriale à chaque fois.

Est-ce que c'est parfait ? Non. Il faut quand même relire, parfois reformuler une phrase ou deux. Mais le travail de structure, de reformulation des idées, de mise en forme — tout ça il le fait.

Ce que j'ai appris c'est qu'il faut pas essayer de tout automatiser d'un coup. Commencez par un workflow simple, testez-le, voyez ce qui coince, améliorez le prompt. C'est itératif.

Pour les solopreneurs qui créent du contenu : si vous avez une chaîne YouTube et un blog, ce workflow peut vous faire gagner plusieurs heures par semaine. C'est vraiment là que l'IA devient concrètement utile, pas pour remplacer votre créativité, mais pour éliminer la partie mécanique du travail.

La vidéo complète est sur la chaîne si vous voulez voir le setup en direct.
