import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, LogOut, User, Plus } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">Sistema de Eventos</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/events">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                Eventos
              </Button>
            </Link>
            
            <Link to="/my-events">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                Meus Eventos
              </Button>
            </Link>

            <Link to="/create-event">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Criar Evento</span>
              </Button>
            </Link>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <User className="h-4 w-4" />
                <span>{user?.name}</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
