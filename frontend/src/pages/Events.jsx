import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EventCard from '../components/EventCard';
import { useEvents } from '../contexts/EventContext';
import { Calendar, Search, Plus, AlertCircle } from 'lucide-react';

const Events = () => {
  const { events, loading, error, subscribeToEvent } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [subscribing, setSubscribing] = useState(null);
  const [message, setMessage] = useState('');

  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubscribe = async (eventId) => {
    setSubscribing(eventId);
    setMessage('');
    
    const result = await subscribeToEvent(eventId);
    
    if (result.success) {
      setMessage('Inscrição realizada com sucesso!');
    } else {
      setMessage(result.error);
    }
    
    setSubscribing(null);
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Eventos</h1>
              <p className="mt-2 text-gray-600">
                Descubra e participe de eventos incríveis
              </p>
            </div>
            <Link to="/create-event">
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Criar Evento</span>
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar eventos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Messages */}
          {message && (
            <Alert className={`mb-6 ${message.includes('sucesso') ? 'border-green-500' : 'border-red-500'}`}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onSubscribe={handleSubscribe}
                  loading={subscribing === event.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum evento encontrado' : 'Nenhum evento disponível'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Tente buscar com outros termos'
                  : 'Seja o primeiro a criar um evento!'
                }
              </p>
              {!searchTerm && (
                <Link to="/create-event">
                  <Button>
                    Criar Primeiro Evento
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
