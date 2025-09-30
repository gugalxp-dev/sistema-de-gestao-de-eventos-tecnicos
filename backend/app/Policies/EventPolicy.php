<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    public function viewAny(User $user): bool
    {
        // Qualquer usuário pode ver a lista de eventos
        return true;
    }

    public function view(User $user, Event $event): bool
    {
        // Participantes podem ver todos eventos, organizadores só os seus
        return $user->isParticipant() || ($user->isOrganizer() && $event->organizer_id === $user->id);
    }

    public function create(User $user): bool
    {
        return $user->isOrganizer();
    }

    public function update(User $user, Event $event): bool
    {
        return $user->isOrganizer() && $event->organizer_id === $user->id && $event->is_active;
    }

    public function delete(User $user, Event $event): bool
    {
        return $user->isOrganizer() && $event->organizer_id === $user->id && $event->is_active;
    }

    public function subscribe(User $user, Event $event): bool
    {
        return $user->isParticipant() &&
               $event->is_active &&
               $event->available_slots > 0 &&
               !$event->participants()->where('user_id', $user->id)->exists();
    }

    public function unsubscribe(User $user, Event $event): bool
    {
        return $user->isParticipant() &&
               $event->is_active &&
               $event->participants()->where('user_id', $user->id)->exists();
    }

    public function viewMyEvents(User $user): bool
    {
        return $user->isParticipant();
    }

    public function restore(User $user, Event $event): bool
    {
        return $this->delete($user, $event);
    }

    public function forceDelete(User $user, Event $event): bool
    {
        return $this->delete($user, $event);
    }
}
