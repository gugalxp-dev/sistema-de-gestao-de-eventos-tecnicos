<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterUserRequest extends FormRequest
{
    /**
     * Allow any user to register.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for registration.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'role' => ['nullable', Rule::in(['participant', 'organizer'])],
        ];
    }

    /**
     * Custom error messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'O campo nome é obrigatório.',
                'name.string' => 'O nome deve ser uma string.',
                'name.max' => 'O nome não pode ter mais de 255 caracteres.',

                'email.required' => 'O campo e-mail é obrigatório.',
                'email.email' => 'O e-mail fornecido não é válido.',
                'email.unique' => 'Este e-mail já está cadastrado.',
                'email.max' => 'O e-mail não pode ter mais de 255 caracteres.',

                'password.required' => 'O campo senha é obrigatório.',
                'password.min' => 'A senha deve ter pelo menos 6 caracteres.',
                'password.confirmed' => 'A confirmação da senha não corresponde.',

                'role.in' => 'O papel deve ser "participant" ou "organizer".',
        ];
    }
}
