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

## Our Commitment

We want everyone to be able to use this site — no matter what device, assistive tech, or level of ability you're working with. We're aiming to meet the [WCAG 2.2 AA standards](https://www.w3.org/TR/WCAG22/), and while we may not be perfect yet, we’re working on it.

## What Might Not Be Fully Accessible (Yet)

Here’s where we know things could be better:

- Some older changelog entries might not play nice with screen readers.
- Interactive visualizations may not be fully keyboard-friendly.
- The contrast ratio of some elements may not meet the desired 7:1 ratio

We tag accessibility-related updates in our [changelog](/changelog/tag/a11y), so you can track what’s improving.

## How We Review Accessibility

We check accessibility using a mix of automated tools, manual testing, and feedback from real users. We revisit this statement at least once a year — or whenever we make big changes.

## Need Help or Want to Share Feedback?

If you’ve hit a barrier or need something in a different format, we’d love to hear from you:

- On our [Discord support server]({{ pkg.support }})
- Submit an issue to our [issue tracker on GitHub]({{ pkg.bugs.url | append: "/new" }})
- By email: [accessibility@convrtr.xyz](mailto:accessibility@convrtr.xyz "Send me an email")

## If Things Don’t Get Resolved

We do our best to make this site accessible and respond to feedback quickly.  
If you’re not happy with how we’ve handled an accessibility issue, you can contact the official accessibility support service in your country.

In the UK, that’s:

**Equality Advisory and Support Service (EASS)**  
[https://www.equalityadvisoryservice.com](https://www.equalityadvisoryservice.com)

  </article>
</section>
