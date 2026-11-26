# MDX Callouts and Components

Use the components registered in `src/components/docs/mdx.tsx`. VitePress `:::` containers are unsupported in the current Fumadocs pipeline.

## Callouts

```mdx
<Callout type="warning" title="Prerequisites">

Before continuing, confirm that Docker is installed and your server is reachable over SSH.

</Callout>
```

Leave blank lines around Markdown children. Close every JSX tag and put commands, configuration, and literal braces in code fences.

| Type | Use for |
|---|---|
| `info` | Background context and notes |
| `warning` | Prerequisites and cautions |
| `error` | Security risks, data loss, and critical warnings |
| `success` | Successful checks and helpful recommendations |
| `idea` | Optional approaches and ideas |

The runtime also maps `tip` to `success`, `warn` to `warning`, and `danger` to `error`. Prefer the canonical types above for new examples. See `src/components/docs/callout.tsx` for the supported props.

````mdx
<Callout type="error" title="Check before deleting data">

Confirm that you have a usable backup before running a destructive command.

```bash
# Put the verified command here.
```

</Callout>
````

For disabled service pages, use `disabled: true` in frontmatter and an appropriate title such as `SERVICE TEMPORARILY DISABLED`. See [disabling-services](../disabling-services/SKILL.md) for the catalog rules.

## Tabs

```mdx
<Tabs items={['Dashboard', 'Terminal']}>
<Tab value="Dashboard">

Follow the dashboard steps here.

</Tab>
<Tab value="Terminal">

Follow the terminal steps here.

</Tab>
</Tabs>
```

## Other Components

`Steps`/`Step`, `Cards`/`Card`, `Accordions`/`Accordion`, `ScreenshotTabs`, and the `Cool*` components are registered for MDX. Check their implementations and nearby pages before using component-specific props. A component not registered in `mdx.tsx` needs an explicit MDX import.

Use [IMAGES.md](./IMAGES.md) for `ZoomImage` and its supported `ZoomableImage` alias.
