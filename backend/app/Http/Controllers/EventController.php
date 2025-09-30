<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Services\EventService;
use Illuminate\Http\Request;
use App\Jobs\Emails\SendEventCancellationEmailsJob;

class EventController extends Controller
{
    protected $service;

    public function __construct(EventService $service)
    {
        $this->service = $service;

        $this->authorizeResource(Event::class, 'event');
    }

    /**
     * List all future events.
     */
    public function index(Request $request)
    {   
        $filters = $request->only(['title', 'organizer_id', 'date']);
        $events = $this->service->filter($filters);

        return EventResource::collection($events);
    }

    /**
     * Create a new event.
     */
    public function store(StoreEventRequest $request)
    {
        $data = $request->validated();

        $event = $this->service->create($data);

        return new EventResource($event->refresh());
    }

    /**
     * Show event details.
     */
    public function show(Event $event)
    {
        return new EventResource($event->refresh());
    }

    /**
     * Update an event.
     */
    public function update(UpdateEventRequest $request, Event $event)
    {   
        if (!$event) {
            return response()->json([
                'message' => 'This event does not exist.'
            ], 400);
        }

        $data = $request->validated();
    
        $event = $this->service->update($event, $data);
    
        return new EventResource($event->refresh());
    }

    /**
     * Delete/cancel an event.
     */
    public function destroy(Event $event)
    {
        if (!$event->is_active) {
            return response()->json([
                'message' => 'This event is already canceled.'
            ], 400);
        }
    
        $this->service->delete($event);
        
        SendEventCancellationEmailsJob::dispatch($event);
        
        return response()->json([
            'message' => 'Event canceled successfully.'
        ]);
    }

    /**
     * Subscribe to an event.
     */
    public function subscribe(Event $event)
    {
        $this->authorize('subscribe', $event);

        $user = auth()->user();
        $status = $this->service->subscribe($user, $event);
    
        return match ($status) {
            'success' => response()->json(['message' => 'Successfully subscribed to the event!']),
            'already_subscribed' => response()->json(['message' => 'You are already subscribed to this event.'], 400),
            'inactive_event' => response()->json(['message' => 'This event is canceled.'], 400),
            'no_slots' => response()->json(['message' => 'No available slots for this event.'], 400),
        };
    }

    /**
     * Unsubscribe from an event.
     */
    public function unsubscribe(Event $event)
    {
        $this->authorize('unsubscribe', $event);

        try {
            $user = auth()->user();

            if (! $event->participants()->where('user_id', $user->id)->exists()) {
                throw new \Exception('You are not subscribed to this event.');
            }

            $this->service->unsubscribe($user, $event);

            return response()->json([
                'message' => 'Successfully unsubscribed from the event.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Get events the user is subscribed to.
     */
    public function myEvents()
    {
        // $this->authorize('viewMyEvents', Event::class);

        $events = $this->service->getUserEvents(auth()->user());

        return EventResource::collection($events);
    }
}
