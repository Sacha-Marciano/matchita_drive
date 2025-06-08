
type StatsCardProps = {
    label: string;
    value: number | string;
  };
  
  export default function StatsCard({ label, value }: StatsCardProps) {
    return (
      <div className="bg-bg-alt p-4 rounded-2xl text-center text-paul-text-alt">
        <p className="text-lg font-semibold">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
    );
  }
  