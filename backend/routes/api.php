<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Sanctum protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Authenticated user
    Route::get('/user', fn(Request $request) => $request->user());

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Events - Organizer
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{event}', [EventController::class, 'update']);
    Route::delete('/events/{event}', [EventController::class, 'destroy']);

    // Events - Participant
    Route::get('/events', [EventController::class, 'index']);           
    Route::get('/events/{event}', [EventController::class, 'show']);   
    Route::post('/events/{event}/subscribe', [EventController::class, 'subscribe']);
    Route::delete('/events/{event}/unsubscribe', [EventController::class, 'unsubscribe']);

    // My events - Participant
    Route::get('/my-events', [EventController::class, 'myEvents']);
});
