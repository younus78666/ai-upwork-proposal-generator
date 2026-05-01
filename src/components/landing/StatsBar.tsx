export const StatsBar = () => {
  return (
    <div className="px-4 py-16 md:px-10">
      <div className="mx-auto max-w-[1100px] rounded-2xl bg-foreground px-8 py-16 md:px-16 text-center">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
          {[
            { num: '18', unit: 'M+', label: 'Freelancers on Upwork' },
            { num: '20–50', unit: '', label: 'Proposals per job post' },
            { num: '60', unit: 's', label: 'Average generation time' },
            { num: '$0.05', unit: '', label: 'Avg cost per proposal' },
          ].map((s, i) => (
            <div key={i}>
              <div className="mb-2 text-[3rem] font-bold leading-none tracking-[-0.04em] text-white md:text-[3.5rem]">
                {s.num}
                {s.unit && (
                  <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(21 89% 52%)' }}>
                    {s.unit}
                  </span>
                )}
              </div>
              <div className="text-sm text-white/50">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
