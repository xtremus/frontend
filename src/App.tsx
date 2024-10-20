import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';
import { SlUser } from 'react-icons/sl';
import { GrUserAdmin } from 'react-icons/gr';

import { useNavigate } from 'react-router-dom';

export function App() {
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-neutral-900 flex flex-col items-center justify-center relative w-full">
      <h2 className="relative flex-col md:flex-row z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white flex items-center gap-2 md:gap-8">
        <span>Work From Home App</span>
      </h2>
      <div className="flex flex-row gap-4 justify-center z-50">
        <div className="self-center rounded-xl h-5/6 border-2 border-slate-300 m-5 p-4">
          <SlUser className="mx-auto text-cyan-50 text-9xl mb-2" />
          <button
            onClick={() => navigate('/employee')}
            className="shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border  border-white text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
          >
            Employee Panel
          </button>
        </div>
        <div className="rounded-xl h-5/6 border-2 border-slate-300 m-5 p-4">
          <GrUserAdmin className="mx-auto text-cyan-50 text-9xl mb-2" />
          <button
            onClick={() => navigate('/admin')}
            className="shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border  border-white text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
          >
            Admin Panel
          </button>
        </div>
      </div>
      <ShootingStars />
      <StarsBackground />
    </div>
  );
}

export default App;
