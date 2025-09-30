<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Event;

class UpdateEventRequest extends FormRequest
{
    /**
     * Allow only the event organizer to update the event.
     */
    public function authorize(): bool
    {
        $event = $this->route('event');
        return $event && $this->user()->id === $event->organizer_id;
    }
    
    /**
     * Validation rules for updating an event.
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'start_at' => ['sometimes', 'date', 'after:now'],
            'end_at' => ['sometimes', 'date', 'after:start_at'],
            'total_slots' => ['sometimes', 'integer', 'min:1'],
            'available_slots' => ['sometimes', 'integer', 'min:1']
        ];
    }

    /**
     * Custom error messages.
     */
    public function messages(): array
    {
        return [
            'title.string' => 'O título deve ser uma string.',
            'title.max' => 'O título não pode ter mais de 255 caracteres.',

            'description.string' => 'A descrição deve ser uma string.',

            'start_at.required' => 'A data de início é obrigatória.',
            'start_at.date' => 'A data de início deve ser uma data válida.',
            'start_at.after' => 'A data de início deve ser no futuro.',

            'end_at.required' => 'A data de término é obrigatória.',
            'end_at.date' => 'A data de término deve ser uma data válida.',
            'end_at.after' => 'A data de término deve ser posterior à data de início.',

            'total_slots.required' => 'O número total de vagas é obrigatório.',
            'total_slots.integer' => 'O número total de vagas deve ser um número inteiro.',
            'total_slots.min' => 'O evento deve ter pelo menos 1 vaga.',

            'available_slots.required' => 'O número de vagas disponíveis é obrigatório.',
            'available_slots.integer' => 'O número de vagas disponíveis deve ser um número inteiro.',
            'available_slots.min' => 'O evento deve ter pelo menos 1 vaga disponível.',
        ];
    }
}
