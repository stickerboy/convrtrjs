---
layout: layout.liquid
title: Accessibility statement
description: How we’re building inclusive experiences for everyone — and how you can reach us if something’s not working.
page-id: accessibility
eleventyExcludeFromCollections: true
eleventyComputed:
  description: '{{ description }}<br />Last updated: <code class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">{{ lastmod | date: "%B %d, %Y" }}</code>'
---
<section class="section changelog accessibility">
    <article class="py-4 px-2 px-sm-4">

    <script type="module" src="{{ '/assets/js/accessibility/accessibility.mjs' | url }}"></script>

  </article>
</section>
