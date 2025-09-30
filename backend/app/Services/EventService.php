<?php

namespace App\Services;

use App\Models\Event;
use App\Repositories\EventRepository;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class EventService
{
    protected EventRepository $eventRepository;

    public function __construct(EventRepository $eventRepository)
    {
        $this->eventRepository = $eventRepository;
    }

    /**
     * Get all events created by the current user
     */
    public function getAllByUser(): Collection
    {
        try {
            $userId = Auth::id();
            return $this->eventRepository->getByUser($userId);
        } catch (\Exception $e) {
            throw new \Exception('Failed to fetch user events: ' . $e->getMessage());
        }
    }

    /**
     * Get event by ID
     */
    public function getById(int $id): ?Event
    {
        try {
            return $this->eventRepository->findById($id);
        } catch (\Exception $e) {
            throw new \Exception('Failed to fetch event: ' . $e->getMessage());
        }
    }

    /**
     * Get all future events
     */
    public function getAllFutureEvents(): Collection
    {
        try {
            return $this->eventRepository->getAllFutureEvents();
        } catch (\Exception $e) {
            throw new \Exception('Failed to fetch future events: ' . $e->getMessage());
        }
    }

    /**
     * Create a new event for the current user
     */
    public function create(array $data): Event
    {
        try {
            $data['organizer_id'] = Auth::id();
            return $this->eventRepository->create($data);
        } catch (\Exception $e) {
            throw new \Exception('Failed to create event: ' . $e->getMessage());
        }
    }

    /**
     * Update an existing event
     */
    public function update(Event $event, array $data): Event
    {
        try {
            return $this->eventRepository->update($event, $data);
        } catch (\Exception $e) {
            throw new \Exception('Failed to update event: ' . $e->getMessage());
        }
    }

    /**
     * Delete/cancel an event
     */
    public function delete(Event $event): Event
    {
        try {
            if (!$event->is_active) {
                throw new \Exception('Event already inactive');
            }
            return $this->eventRepository->delete($event);
        } catch (\Exception $e) {
            throw new \Exception('Failed to delete event: ' . $e->getMessage());
        }
    }

    /**
     * Check if event has available slots
     */
    public function hasAvailableSlots(Event $event): bool
    {
        try {
            return ($event->subscriptions()->count() < $event->total_slots);
        } catch (\Exception $e) {
            throw new \Exception('Failed to check slots: ' . $e->getMessage());
        }
    }

    /**
     * Subscribe a user to an event
     */
    public function subscribe(User $user, Event $event): string
    {
        try {
            if (!$event->is_active) {
                return 'inactive_event';
            }

            if ($event->available_slots <= 0) {
                return 'no_slots';
            }

            return $this->eventRepository->subscribe($user, $event);
        } catch (\Exception $e) {
            throw new \Exception('Failed to subscribe: ' . $e->getMessage());
        }
    }

    /**
     * Unsubscribe a user from an event
     */
    public function unsubscribe(User $user, Event $event): void
    {
        try {
            $this->eventRepository->unsubscribe($user, $event);
        } catch (\Exception $e) {
            throw new \Exception('Failed to unsubscribe: ' . $e->getMessage());
        }
    }

    /**
     * Get events the user is subscribed to
     */
    public function getUserEvents(User $user)
    {
        try {
            return $this->eventRepository->getEventsByUser($user);
        } catch (\Exception $e) {
            throw new \Exception('Failed to fetch user subscriptions: ' . $e->getMessage());
        }
    }

    /**
     * Filter
     */
    public function filter(array $filters)
    {
        return $this->eventRepository->filter($filters);
    }
}
