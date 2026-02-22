import CourseView from "@/components/CourseView";

// This function is required for static export on GitHub Pages
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ];
}

export default function Page({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-black">
      <CourseView id={params.id} />
    </main>
  );
}