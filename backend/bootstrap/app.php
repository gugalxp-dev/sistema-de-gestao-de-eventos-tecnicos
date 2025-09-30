<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        $exceptions->render(function (ModelNotFoundException $e, $request) {
            if ($request->wantsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'The requested resource was not found.',
                    'code' => Response::HTTP_NOT_FOUND,
                ], Response::HTTP_NOT_FOUND);
            }
        });

        $exceptions->render(function (NotFoundHttpException $e, $request) {
            if ($request->wantsJson() && $e->getPrevious() instanceof ModelNotFoundException) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'The requested resource was not found.',
                    'code' => Response::HTTP_NOT_FOUND,
                ], Response::HTTP_NOT_FOUND);
            }

            if ($request->wantsJson() && !$e->getPrevious()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'The requested route was not found.',
                    'code' => Response::HTTP_NOT_FOUND,
                ], Response::HTTP_NOT_FOUND);
            }
        });

        $exceptions->render(function (AuthorizationException $e, $request) {
            if ($request->wantsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You do not have permission to perform this action.',
                    'code' => Response::HTTP_FORBIDDEN,
                ], Response::HTTP_FORBIDDEN);
            }
        });

        $exceptions->render(function (AccessDeniedHttpException $e, $request) {
            if ($request->wantsJson() && $e->getPrevious() instanceof AuthorizationException) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You do not have permission to perform this action.',
                    'code' => Response::HTTP_FORBIDDEN,
                ], Response::HTTP_FORBIDDEN);
            }
        });

    })
    ->create();
