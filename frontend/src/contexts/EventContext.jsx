import React, { createContext, useContext, useState, useEffect } from 'react';
import { eventService } from '../lib/api';
import { useAuth } from './AuthContext';

const EventContext = createContext();

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents deve ser usado dentro de um EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
      fetchMyEvents();
    }
  }, [isAuthenticated]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.getEvents();
      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      setEvents([]);
      setError('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMyEvents = async () => {
    try {
      const response = await eventService.getMyEvents();
      setMyEvents(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erro ao carregar meus eventos:', error);
      setMyEvents([]);
    }
  };

  const createEvent = async (eventData) => {
    try {
      const response = await eventService.createEvent(eventData);
      setEvents(prev => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao criar evento' 
      };
    }
  };

  const updateEvent = async (id, eventData) => {
    try {
      const response = await eventService.updateEvent(id, eventData);
      setEvents(prev => prev.map(event => 
        event.id === id ? response.data : event
      ));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao atualizar evento' 
      };
    }
  };

  const deleteEvent = async (id) => {
    try {
      await eventService.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao deletar evento' 
      };
    }
  };

  const subscribeToEvent = async (id) => {
    try {
      await eventService.subscribeToEvent(id);
      await fetchMyEvents();
      return { success: true };
    } catch (error) {
      console.error('Erro ao se inscrever no evento:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao se inscrever no evento' 
      };
    }
  };

  const unsubscribeFromEvent = async (id) => {
    try {
      await eventService.unsubscribeFromEvent(id);
      await fetchMyEvents();
      return { success: true };
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao cancelar inscrição' 
      };
    }
  };

  const getEvent = async (id) => {
    try {
      const response = await eventService.getEvent(id);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao carregar evento:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao carregar evento' 
      };
    }
  };

  const value = {
    events,
    myEvents,
    loading,
    error,
    fetchEvents,
    fetchMyEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    subscribeToEvent,
    unsubscribeFromEvent,
    getEvent,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};
