import Link from 'next/link';
import HomeworkUploadForm from './HomeworkUploadForm';

export const metadata = {
  title: 'Upload homework · Seerah',
};

export default function UploadHomeworkPage() {
  return (
    <main className='space-y-6'>
      <div>
        <Link href='/dashboard' className='text-sm text-amber-800 hover:text-amber-950'>
          ← Dashboard
        </Link>
        <h1 className='mt-2 font-serif text-3xl font-bold text-stone-900'>Upload homework</h1>
        <p className='mt-1 text-sm text-stone-600'>
          Attach notes, scans, or written reflections for this cohort. Files stay private on the server and are served
          only to signed-in learners.
        </p>
      </div>
      <HomeworkUploadForm />
    </main>
  );
}
