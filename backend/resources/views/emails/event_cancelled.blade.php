@component('mail::message')
# Hello {{ $user->name }},

We regret to inform you that the event you were registered for has been cancelled.

**Event:** {{ $event->title }}  
**Date:** {{ $event->start_at->format('d/m/Y H:i') }} - {{ $event->end_at->format('d/m/Y H:i') }}  

Thank you for your understanding.

Best regards,  
{{ config('app.name') }}
@endcomponent
