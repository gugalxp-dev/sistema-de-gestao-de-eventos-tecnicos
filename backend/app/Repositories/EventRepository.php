<?php

namespace App\Repositories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Collection;
use App\Models\User;

class EventRepository
{
    /**
     * Get all upcoming events.
     */
    public function getAllUpcoming(): Collection
    {
        return Event::where('start_at', '>=', now())
                    ->orderBy('start_at', 'asc')
                    ->get();
    }

    /**
     * Get events organized by a specific user.
     */
    public function getByOrganizer(int $organizerId): Collection
    {
        return Event::where('organizer_id', $organizerId)
                    ->orderBy('start_at', 'asc')
                    ->get();
    }

    /**
     * Create a new event.
     */
    public function create(array $data): Event
    {
        return Event::create($data);
    }

    /**
     * Update an existing event.
     */
    public function update(Event $event, array $data): Event
    {
        $event->update($data);
        return $event;
    }

    /**
     * Delete (deactivate) an event.
     */
    public function delete(Event $event): Event
    {
        $event->is_active = false;
        $event->save();
        return $event;
    }

    /**
     * Find an event by ID.
     */
    public function findById(int $id): ?Event
    {
        return Event::find($id);
    }

    /**
     * Get all future and active events.
     */
    public function getAllFutureEvents(): Collection
    {
        return Event::where('is_active', true)
                    ->where('start_at', '>', now())
                    ->orderBy('start_at', 'asc')
                    ->get();
    }

    /**
     * Subscribe a user to an event.
     */
    public function subscribe(User $user, Event $event): string
    {
        if ($event->participants()->where('user_id', $user->id)->exists()) {
            return 'already_subscribed';
        }

        $event->participants()->attach($user->id);
        $event->decrement('available_slots');
        $event->refresh();

        return 'success';
    }

    /**
     * Unsubscribe a user from an event.
     */
    public function unsubscribe(User $user, Event $event): void
    {
        $event->participants()->detach($user->id);
        $event->increment('available_slots');
    }

    /**
     * Get events the user is subscribed to.
     */
    public function getEventsByUser(User $user)
    {
        return $user->events()
                    ->where('event_user.is_active', 1)
                    ->get();
    }

    /**
     * Filter events by title, organizer name, and date.
     */
    public function filter(array $filters)
    {
        $query = Event::query()->where('is_active', true)->with('organizer');
    
        if (!empty($filters['title'])) {
            $query->where('title', 'ilike', "%{$filters['title']}%");
        }
    
        if (!empty($filters['organizer_id'])) {
            $query->where('organizer_id', $filters['organizer_id']);
        }
    
        if (!empty($filters['date'])) {
            $query->whereDate('start_at', $filters['date']);
        }
    
        return $query->orderBy('start_at', 'asc')->get();
    }
}
