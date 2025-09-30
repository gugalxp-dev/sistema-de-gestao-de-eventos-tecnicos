<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubscribeEventRequest extends FormRequest
{
    /**
     * Allow only users with the participant role to subscribe.
     */
    public function authorize(): bool
    {
        return $this->user()->role === 'participant';
    }

    /**
     * Validation rules for event subscription.
     */
    public function rules(): array
    {
        return [
            'event_id' => [
                'required',
                'integer',
                'exists:events,id',
            ],
        ];
    }

    /**
     * Custom error messages.
     */
    public function messages(): array
    {
        return [
            'event_id.required' => 'O ID do evento é obrigatório.',
            'event_id.integer' => 'O ID do evento deve ser um número inteiro.',
            'event_id.exists' => 'O evento especificado não existe.',
        ];
    }
}
