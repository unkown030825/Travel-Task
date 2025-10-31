import { Experience } from '../types';
import { useNavigate } from 'react-router-dom';

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-64">
        <img
          src={experience.image_url}
          alt={experience.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{experience.title}</h3>
          <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
            {experience.location}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {experience.description}
        </p>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-500">From </span>
            <span className="text-xl font-bold text-gray-900">₹{experience.price}</span>
          </div>
          <button
            onClick={() => navigate(`/experience/${experience._id}`)}
            className="bg-yellow-400 text-black px-5 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
