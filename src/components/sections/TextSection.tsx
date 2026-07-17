interface TextSectionProps {
  children: React.ReactNode;
}

export function TextSection({ children }: TextSectionProps) {
  return (
    <section className="space-y-4">
      {children}
    </section>
  );
}
