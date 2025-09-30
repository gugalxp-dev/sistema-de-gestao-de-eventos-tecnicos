import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEvents } from '../contexts/EventContext';
import { Calendar, MapPin, Users, FileText, ArrowLeft, AlertCircle } from 'lucide-react';

const CreateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createEvent, updateEvent, getEvent } = useEvents();
  
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    max_participants: '',
    additional_info: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      loadEvent();
    }
  }, [id, isEditing]);

  const loadEvent = async () => {
    setLoading(true);
    const result = await getEvent(id);
    
    if (result.success) {
      const event = result.data;
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date ? event.date.split('T')[0] : '',
        location: event.location || '',
        max_participants: event.max_participants || '',
        additional_info: event.additional_info || '',
      });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validações básicas
    if (!formData.title.trim()) {
      setError('O título é obrigatório');
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('A descrição é obrigatória');
      setLoading(false);
      return;
    }

    const eventData = {
      ...formData,
      max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
    };

    const result = isEditing 
      ? await updateEvent(id, eventData)
      : await createEvent(eventData);
    
    if (result.success) {
      navigate(isEditing ? `/events/${id}` : '/events');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  if (isEditing && loading && !formData.title) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? 'Editar Evento' : 'Criar Novo Evento'}
              </h1>
              <p className="mt-2 text-gray-600">
                {isEditing 
                  ? 'Atualize as informações do seu evento'
                  : 'Preencha os dados para criar um novo evento'
                }
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Informações do Evento</span>
              </CardTitle>
              <CardDescription>
                Forneça os detalhes do evento para que os participantes possam se inscrever
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Título do Evento *</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    required
                    placeholder="Ex: Workshop de React"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    placeholder="Descreva o que será abordado no evento..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Data do Evento</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        className="pl-10"
                        value={formData.date}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_participants">Máximo de Participantes</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="max_participants"
                        name="max_participants"
                        type="number"
                        min="1"
                        className="pl-10"
                        placeholder="Ex: 50"
                        value={formData.max_participants}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Local</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      className="pl-10"
                      placeholder="Ex: Auditório Principal, Rua das Flores, 123"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional_info">Informações Adicionais</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Textarea
                      id="additional_info"
                      name="additional_info"
                      className="pl-10"
                      placeholder="Requisitos, materiais necessários, agenda detalhada..."
                      value={formData.additional_info}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading 
                      ? (isEditing ? 'Atualizando...' : 'Criando...') 
                      : (isEditing ? 'Atualizar Evento' : 'Criar Evento')
                    }
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
