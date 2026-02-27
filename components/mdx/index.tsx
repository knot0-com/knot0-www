import { Callout } from './callout'
import { DagainAnimation } from '../writing/DagainAnimation'

export const mdxComponents = {
  Callout,
  DagainAnimation,
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xl font-semibold text-white mt-8 mb-3">
      {children}
    </h3>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="text-white-dim leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-inside space-y-2 mb-4 text-white-dim">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal list-inside space-y-2 mb-4 text-white-dim">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <a
      href={href}
      className="text-amber hover:text-amber/80 underline underline-offset-2 decoration-amber/50 hover:decoration-amber transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  code: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => {
    // If inside a <pre> (rehype-pretty-code), don't apply inline code styles
    const isInPre = 'data-language' in props || 'data-theme' in props || 'style' in props
    if (isInPre) {
      return <code {...props}>{children}</code>
    }
    return (
      <code className="bg-black-light text-cyan rounded px-1.5 py-0.5 font-mono text-sm">{children}</code>
    )
  },
  pre: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <pre className="bg-black-light border border-black-border rounded-lg p-4 overflow-x-auto my-6 font-mono text-sm [&>code]:grid [&>code]:text-[13px]" {...props}>
      {children}
    </pre>
  ),
  figure: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <figure className="my-6" {...props}>{children}</figure>
  ),
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-x-auto my-6 border border-black-border rounded-lg">
      <table className="w-full border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }: { children: React.ReactNode }) => (
    <thead className="bg-black-light">{children}</thead>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="border-b border-black-border px-4 py-3 text-left font-medium text-white text-sm">
      {children}
    </th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="border-b border-black-border px-4 py-3 text-white-dim text-sm">{children}</td>
  ),
  tr: ({ children }: { children: React.ReactNode }) => (
    <tr className="hover:bg-black-light/50 transition-colors">{children}</tr>
  ),
}
