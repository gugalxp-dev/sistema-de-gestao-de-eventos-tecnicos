<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEventRequest extends FormRequest
{
    /**
     * Allow only users with the organizer role to create events.
     */
    public function authorize(): bool
    {
        return $this->user()->role === 'organizer';
    }

    /**
     * Validation rules for creating an event.
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'start_at' => ['required', 'date', 'after:now'],
            'end_at' => ['required', 'date', 'after:start_at'],
            'total_slots' => ['required', 'integer', 'min:1'],
            'available_slots' => ['required', 'integer', 'min:1'],
        ];
    }

    /**
     * Custom error messages.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'O título do evento é obrigatório.',
            'title.string' => 'O título deve ser uma string.',
            'title.max' => 'O título não pode ter mais de 255 caracteres.',

            'description.required' => 'A descrição do evento é obrigatória.',
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
