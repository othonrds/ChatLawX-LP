type Row = { feature: string; values: boolean[] };
type Props = { title: string; columns: string[]; rows: Row[] };

export default function ComparisonTable({ title, columns, rows }: Props) {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <div style={{ overflowX: 'auto', border: '1px solid #1f2c49', borderRadius: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead style={{ background: 'var(--bg-elev)' }}>
              <tr>
                {columns.map((c, i) => (
                  <th key={i} style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #1f2c49' }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={{ padding: 12, borderBottom: '1px solid #1f2c49' }}>{r.feature}</td>
                  {r.values.map((v, j) => (
                    <td key={j} style={{ padding: 12, borderBottom: '1px solid #1f2c49' }}>{v ? '✓' : '✗'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}


