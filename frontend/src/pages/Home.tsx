import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchExperiences } from '../store/experiencesSlice';
import ExperienceCard from '../components/ExperienceCard';
import Loader from '../components/Loader';

export default function Home() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.experiences);
console.log(items);
  useEffect(() => {
    dispatch(fetchExperiences());
  }, [dispatch]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((experience:any) => (
            <ExperienceCard key={experience._id} experience={experience} />
          ))}
        </div>
      </div>
    </div>
  );
}
