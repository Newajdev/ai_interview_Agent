type CountdownViewProps = {
  count: number;
};

export function CountdownView({ count }: CountdownViewProps) {
  return (
    <section className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-cyan-300">YOUR INTERVIEW IS ABOUT TO BEGIN</p>
        <p className="mt-6 text-9xl font-semibold tabular-nums">
          {count || "Go"}
        </p>
      </div>
    </section>
  );
}
