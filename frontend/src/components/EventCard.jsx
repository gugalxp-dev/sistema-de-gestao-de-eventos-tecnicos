import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';

const EventCard = ({ 
  event, 
  onSubscribe, 
  onUnsubscribe, 
  isSubscribed = false, 
  loading = false,
  showActions = true 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
          <Badge variant={isSubscribed ? "default" : "outline"} className="ml-2 shrink-0">
            {isSubscribed ? 'Inscrito' : event.status || 'Ativo'}
          </Badge>
        </div>
        <CardDescription className="line-clamp-3">
          {event.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
          
          {event.max_participants && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2 text-primary" />
              <span>
                {event.participants_count || 0} / {event.max_participants} participantes
              </span>
            </div>
          )}
          
          {showActions && (
            <div className="flex space-x-2 pt-4">
              <Link to={`/events/${event.id}`} className="flex-1">
                <Button variant="outline" className="w-full hover:bg-gray-50">
                  Ver Detalhes
                </Button>
              </Link>
              
              {isSubscribed ? (
                <Button
                  variant="destructive"
                  onClick={() => onUnsubscribe?.(event.id)}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Cancelando...' : 'Cancelar'}
                </Button>
              ) : (
                <Button
                  onClick={() => onSubscribe?.(event.id)}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Inscrevendo...' : 'Inscrever-se'}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
