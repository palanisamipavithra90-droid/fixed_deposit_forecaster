import { FdCalculator } from '@/components/fd-calculator';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <FdCalculator />
    </main>
  );
}
