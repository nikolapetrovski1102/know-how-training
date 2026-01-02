interface ProgramSummary {
  id: number;
  slug: string;
  title: string;
  shortDescription?: string;
  imageUrl?: string;
}

interface Props {
  programs: ProgramSummary[];
  title?: string;
}

export const ProgramsGrid: React.FC<Props> = ({ programs, title }) => (
  <div className="text-center">
    {title && <h2 className="text-4xl font-black text-gray-900 mb-20">{title}</h2>}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {programs.map((program) => (
        <div key={program.id} className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
          <div className="h-64 bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:scale-105 transition-transform duration-500" />
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{program.title}</h3>
            <p className="text-gray-600 mb-6">{program.shortDescription}</p>
            <a href={`/programs/${program.slug}`} className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700">
              Learn More →
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
);
