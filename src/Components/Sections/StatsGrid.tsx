import type { Stat } from '../../types/page';

interface Props {
  stats: Stat[];
  title?: string;
}

export const StatsGrid: React.FC<Props> = ({ stats, title }) => {
  return (
    <div>
      {stats.map((stat) => (
        <div key={stat.label}>
          <div>{stat.value}</div>
          <div>{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
