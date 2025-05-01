import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Timer } from 'lucide-react';

const CreatePatternCard: React.FC = () => {
  const { isDarkMode, addCustomTechnique } = useAppContext();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    inhaleTime: 4,
    holdInTime: 4,
    exhaleTime: 4,
    holdOutTime: 4
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pattern = `Inhale ${formData.inhaleTime}s${formData.holdInTime ? ` – Hold ${formData.holdInTime}s` : ''} – Exhale ${formData.exhaleTime}s${formData.holdOutTime ? ` – Hold ${formData.holdOutTime}s` : ''}`;
    
    addCustomTechnique({
      ...formData,
      description: 'Custom breathing pattern',
      pattern,
      useCases: 'Personal practice',
      evidence: 'Custom pattern',
      color: '#64748B'
    });
    
    navigate('/exercise');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`h-full min-h-[280px] w-full rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
          isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-50'
        } border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-5 group`}
      >
        <Plus size={40} className="mb-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        <h3 className="text-xl font-bold mb-2">Create Custom Pattern</h3>
        <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Design your own breathing technique
        </p>
      </button>
    );
  }

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg ${
      isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
    }`}
    style={{ borderTop: '4px solid #64748B' }}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">Create Custom Pattern</h3>
          <Timer size={20} className="text-gray-400" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Pattern Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-3 py-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-50 border-gray-200'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="My Custom Pattern"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Inhale (seconds)</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.inhaleTime}
                onChange={(e) => setFormData(prev => ({ ...prev, inhaleTime: Number(e.target.value) }))}
                className={`w-full px-3 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hold After Inhale</label>
              <input
                type="number"
                min="0"
                max="20"
                value={formData.holdInTime}
                onChange={(e) => setFormData(prev => ({ ...prev, holdInTime: Number(e.target.value) }))}
                className={`w-full px-3 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Exhale (seconds)</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.exhaleTime}
                onChange={(e) => setFormData(prev => ({ ...prev, exhaleTime: Number(e.target.value) }))}
                className={`w-full px-3 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hold After Exhale</label>
              <input
                type="number"
                min="0"
                max="20"
                value={formData.holdOutTime}
                onChange={(e) => setFormData(prev => ({ ...prev, holdOutTime: Number(e.target.value) }))}
                className={`w-full px-3 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Create & Start
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePatternCard;