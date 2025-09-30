<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterUserRequest;
use App\Http\Requests\LoginUserRequest;
use Illuminate\Http\Request;
use App\Services\AuthService;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Register a new user.
     */
    public function register(RegisterUserRequest $request)
    {
        $data = $request->validated();

        $user = $this->authService->createUser($data);

        return response()->json(new UserResource($user), 201);
    }

    /**
     * Login a user.
     */
    public function login(LoginUserRequest $request)
    {
        $data = $request->validated();

        $user = $this->authService->login($data);

        return response()->json(new UserResource($user), 200);
    }

    /**
     * Logout the authenticated user.
     */
    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return response()->json([
            'message' => 'Logout successful.'
        ]);
    }
}
