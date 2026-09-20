/* Local Japanese phrase analysis; no remote service, forced <br>, or changes
   to the underlying text, links, forms, metadata, or navigation. */
(() => {
  if (!window.BudouXJapanese) return;
  const selector = [
    'main p', 'main h1', 'main h2', 'main h3', 'main h4',
    'main dt', 'main dd', 'main td', 'main th', 'main summary',
    'main .faq-question', 'main .works-link', 'main .news-title',
    'footer p', 'footer small',
  ].join(',');
  const processed = new WeakSet();
  const segmenter = typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter('ja', { granularity: 'word' }) : null;

  function phrasesFor(text) {
    const phrases = window.BudouXJapanese.parse(text);
    if (!segmenter) return phrases;
    // A model boundary must not bisect a lexical word (e.g. 「に / よる」).
    const words = [...segmenter.segment(text)].filter(word => word.isWordLike);
    const safe = [];
    let offset = 0;
    for (const phrase of phrases) {
      if (safe.length && words.some(word => word.index < offset && offset < word.index + word.segment.length)) {
        safe[safe.length - 1] += phrase;
      } else {
        safe.push(phrase);
      }
      offset += phrase.length;
    }
    return safe;
  }

  function arrange(root) {
    const elements = [...root.querySelectorAll(selector)];
    if (root.matches?.(selector)) elements.unshift(root);
    for (const element of elements) {
      const style = getComputedStyle(element);
      // Do not split anonymous flex/grid items or modify live form controls.
      if (['flex', 'inline-flex', 'grid', 'inline-grid'].includes(style.display)) continue;
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (processed.has(node) || !/[\u3040-\u30ff\u3400-\u9fff]/u.test(node.data)) continue;
        if (node.parentElement.closest('script, style, textarea, select, option, svg, [contenteditable]')) continue;
        nodes.push(node);
      }
      for (const node of nodes) {
        const phrases = phrasesFor(node.data);
        const fragment = document.createDocumentFragment();
        phrases.forEach((phrase, index) => {
          if (index) fragment.append(document.createElement('wbr'));
          const text = document.createTextNode(phrase);
          processed.add(text);
          fragment.append(text);
        });
        node.replaceWith(fragment);
        element.classList.add('jp-prose');
      }
    }
  }

  arrange(document);
  // News cards are replaced by the existing category/pagination controls.
  // Observe only their containers, not the whole page or form input.
  document.querySelectorAll('#top-news-list, #news-list').forEach(container => {
    const observer = new MutationObserver(() => {
      observer.disconnect();
      arrange(container);
      observer.observe(container, { childList: true, subtree: true });
    });
    observer.observe(container, { childList: true, subtree: true });
  });
})();
