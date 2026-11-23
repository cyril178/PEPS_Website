// Après le build : surligne chaque « [À COMPLÉTER …] » dans le HTML final.
// Si src/data/site.json a "draft": false, le build échoue tant qu'il en reste —
// on ne met pas en ligne des informations de recrutement incomplètes.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TODO = /\[À COMPLÉTER[^\]]*\]/g;

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? htmlFiles(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : []
  );
}

export default function todoCheck() {
  return {
    name: 'peps-todo-check',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const site = JSON.parse(readFileSync(new URL('../data/site.json', import.meta.url), 'utf8'));
        const root = fileURLToPath(dir);
        const report = [];
        for (const file of htmlFiles(root)) {
          const html = readFileSync(file, 'utf8');
          let n = 0;
          // Uniquement dans le texte visible (entre balises), pas dans les attributs.
          const out = html.replace(/>([^<]+)</g, (m, text) =>
            '>' + text.replace(TODO, (t) => (n++, `<mark class="todo">${t}</mark>`)) + '<'
          );
          const inAttrs = (html.match(TODO) || []).length - n;
          if (n || inAttrs) report.push(`${file.slice(root.length)} : ${n + inAttrs}`);
          if (n) writeFileSync(file, out);
        }
        if (!report.length) return logger.info('Aucun élément « À COMPLÉTER ».');
        const msg = `Éléments « À COMPLÉTER » restants :\n  ${report.join('\n  ')}`;
        if (!site.draft) throw new Error(msg + '\n→ Complétez-les ou remettez "draft": true dans site.json.');
        logger.warn(msg);
      },
    },
  };
}
