<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subscription;
use App\Models\User;
use App\Models\Event;

class SubscriptionSeeder extends Seeder
{
    public function run()
    {
        $participant = User::where('role', 'participant')->first();
        $event = Event::first();

        Subscription::create([
            'user_id' => $participant->id,
            'event_id' => $event->id,
        ]);

        $event->decrement('available_slots');
    }
}
