<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Subscription extends Model
{

    use LogsActivity;

    // Mass assignable attributes
    protected $fillable = [
        'event_id',
        'user_id',
    ];
    
    /**
     * Register logs
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('event')
            ->setDescriptionForEvent(fn(string $eventName) => "Event has been {$eventName}");
    }

    /**
     * Subscription belongs to a user (participant)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Subscription belongs to an event
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
