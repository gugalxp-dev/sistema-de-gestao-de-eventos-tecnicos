import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventContext';
import { Calendar, Users, Plus, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { events: rawEvents, myEvents: rawMyEvents, loading } = useEvents();

  const events = Array.isArray(rawEvents) ? rawEvents : [];
  const myEvents = Array.isArray(rawMyEvents) ? rawMyEvents : [];

  const upcomingEvents = events.slice(0, 3);
  const recentMyEvents = myEvents.slice(0, 3);

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Bem-vindo, {user?.name}!</h1>
            <p className="mt-2 text-gray-600">Gerencie seus eventos e descubra novos acontecimentos</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{events.length}</div>
                <p className="text-xs text-muted-foreground">Eventos disponíveis</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Meus Eventos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myEvents.length}</div>
                <p className="text-xs text-muted-foreground">Eventos inscritos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ações Rápidas</CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Link to="/create-event">
                  <Button className="w-full">Criar Evento</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Próximos Eventos</span>
                </CardTitle>
                <CardDescription>Eventos disponíveis para inscrição</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(event.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    ))}
                    <Link to="/events">
                      <Button variant="outline" className="w-full mt-4">Ver Todos os Eventos</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum evento disponível</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Meus Eventos</span>
                </CardTitle>
                <CardDescription>Eventos em que você está inscrito</CardDescription>
              </CardHeader>
              <CardContent>
                {recentMyEvents.length > 0 ? (
                  <div className="space-y-4">
                    {recentMyEvents.map((event) => (
                      <div key={event.id} className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(event.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    ))}
                    <Link to="/my-events">
                      <Button variant="outline" className="w-full mt-4">Ver Meus Eventos</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Você ainda não está inscrito em nenhum evento</p>
                    <Link to="/events">
                      <Button variant="outline" className="mt-4">Explorar Eventos</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
