Success! Studio deployed to https://spark-studio.sanity.studio/

Add appId: 'i6zyaku59iow63ay6wd6x6sq'
to the `deployment` section in sanity.cli.js or sanity.cli.ts
to avoid prompting for application id on next deploy.

Example:
export default defineCliConfig({
  //…
  deployment: {
    appId: 'i6zyaku59iow63ay6wd6x6sq',
  },
  //…
})


Ajout blog post

it add 'app/blog/[slug]/page.tsx' app/blog/page.tsx lib/mock-data.ts lib/sanity/client.ts BLOG_PROMPT.md lib/sanity/
  git commit -m "Connect blog pages to Sanity, remove mock posts, add humanizer rules"
  git push