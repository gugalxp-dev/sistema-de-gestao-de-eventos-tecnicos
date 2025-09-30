<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Organizers
        User::create([
            'name' => 'Organizer One',
            'email' => 'organizer1@example.com',
            'password' => Hash::make('password123'),
            'role' => 'organizer',
        ]);
    }
}
