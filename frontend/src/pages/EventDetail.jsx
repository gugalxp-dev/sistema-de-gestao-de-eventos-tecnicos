import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEvents } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, MapPin, Users, ArrowLeft, Edit, Trash2, AlertCircle } from 'lucide-react';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getEvent, subscribeToEvent, unsubscribeFromEvent, deleteEvent } = useEvents();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    setLoading(true);
    const result = await getEvent(id);
    
    if (result.success) {
      setEvent(result.data);
      // Verificar se o usuário está inscrito (assumindo que o backend retorna essa informação)
      setIsSubscribed(result.data.is_subscribed || false);
    } else {
      setMessage(result.error);
    }
    
    setLoading(false);
  };

  const handleSubscribe = async () => {
    setActionLoading(true);
    setMessage('');
    
    const result = await subscribeToEvent(id);
    
    if (result.success) {
      setMessage('Inscrição realizada com sucesso!');
      setIsSubscribed(true);
      loadEvent(); // Recarregar para atualizar contadores
    } else {
      setMessage(result.error);
    }
    
    setActionLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUnsubscribe = async () => {
    setActionLoading(true);
    setMessage('');
    
    const result = await unsubscribeFromEvent(id);
    
    if (result.success) {
      setMessage('Inscrição cancelada com sucesso!');
      setIsSubscribed(false);
      loadEvent(); // Recarregar para atualizar contadores
    } else {
      setMessage(result.error);
    }
    
    setActionLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja deletar este evento?')) {
      return;
    }

    setActionLoading(true);
    const result = await deleteEvent(id);
    
    if (result.success) {
      navigate('/events');
    } else {
      setMessage(result.error);
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Evento não encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              O evento que você está procurando não existe ou foi removido.
            </p>
            <Link to="/events">
              <Button>Voltar aos Eventos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = user?.id === event.user_id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>

            {isOwner && (
              <div className="flex space-x-2">
                <Link to={`/events/${id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={actionLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Deletar
                </Button>
              </div>
            )}
          </div>

          {/* Messages */}
          {message && (
            <Alert className={`mb-6 ${message.includes('sucesso') ? 'border-green-500' : 'border-red-500'}`}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {/* Event Details */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                  <CardDescription className="text-base">
                    {event.description}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="ml-4">
                  {event.status || 'Ativo'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">Data do Evento</p>
                      <p className="text-sm">
                        {event.date ? new Date(event.date).toLocaleDateString('pt-BR') : 'Data não informada'}
                      </p>
                    </div>
                  </div>

                  {event.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-3" />
                      <div>
                        <p className="font-medium">Local</p>
                        <p className="text-sm">{event.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {event.max_participants && (
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-3" />
                      <div>
                        <p className="font-medium">Participantes</p>
                        <p className="text-sm">
                          {event.participants_count || 0} / {event.max_participants} inscritos
                        </p>
                      </div>
                    </div>
                  )}

                  {event.organizer && (
                    <div className="text-gray-600">
                      <p className="font-medium">Organizador</p>
                      <p className="text-sm">{event.organizer.name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {!isOwner && (
                <div className="border-t pt-6">
                  {isSubscribed ? (
                    <Button
                      variant="outline"
                      onClick={handleUnsubscribe}
                      disabled={actionLoading}
                      className="w-full md:w-auto"
                    >
                      {actionLoading ? 'Cancelando...' : 'Cancelar Inscrição'}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubscribe}
                      disabled={actionLoading}
                      className="w-full md:w-auto"
                    >
                      {actionLoading ? 'Inscrevendo...' : 'Inscrever-se'}
                    </Button>
                  )}
                </div>
              )}

              {/* Additional Info */}
              {event.additional_info && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Informações Adicionais
                  </h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {event.additional_info}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
