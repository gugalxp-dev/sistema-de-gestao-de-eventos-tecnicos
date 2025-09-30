<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\User;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    public function run()
    {
        $organizers = User::where('role', 'organizer')->get();

        for ($i = 1; $i <= 10; $i++) {
            $organizer = $organizers->random();

            Event::create([
                'title' => "Event $i",
                'description' => "Description for Event $i.",
                'start_at' => Carbon::now()->addDays($i),
                'end_at' => Carbon::now()->addDays($i)->addHours(2),
                'total_slots' => rand(20, 100),
                'available_slots' => rand(20, 100),
                'organizer_id' => $organizer->id,
                'is_active' => true,
            ]);
        }
    }
}
