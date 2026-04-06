import type { ReactNode } from 'react';

export function CardSection({
  icon,
  kicker,
  title,
  copy,
  id,
  action,
  children,
}: {
  icon: ReactNode;
  kicker: string;
  title: string;
  copy: string;
  id?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="card-panel section-card">
      <div className="section-heading">
        <div className="section-heading-main">
          {icon}
          <div>
            <p className="section-kicker">{kicker}</p>
            <h2>{title}</h2>
          </div>
        </div>
        <div className="section-heading-side">
          <p className="section-copy">{copy}</p>
          {action ? <div className="section-action">{action}</div> : null}
        </div>
      </div>
      {children}
    </section>
  );
}
