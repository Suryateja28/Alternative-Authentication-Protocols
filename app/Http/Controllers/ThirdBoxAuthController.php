<?php

namespace App\Http\Controllers;

use App\Models\ThirdBoxUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ThirdBoxAuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:third_box_users,email',
            'brightness' => 'required|integer|min:0|max:100',
            'volume' => 'required|integer|min:0|max:100',
            'caps_lock' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        ThirdBoxUser::create([
            'email' => $request->email,
            'brightness' => $request->brightness,
            'volume' => $request->volume,
            'caps_lock' => $request->caps_lock,
        ]);

        return response()->json([
            'message' => 'Device Configuration Registered Successfully'
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'brightness' => 'required|integer|min:0|max:100',
            'volume' => 'required|integer|min:0|max:100',
            'caps_lock' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        $user = ThirdBoxUser::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Email not found.'
            ], 404);
        }

        $TOLERANCE = 5;
        $brightnessMatch = abs($user->brightness - $request->brightness) <= $TOLERANCE;
        $volumeMatch = abs($user->volume - $request->volume) <= $TOLERANCE;
        $capsMatch = $user->caps_lock === $request->caps_lock;

        if (!$brightnessMatch || !$volumeMatch || !$capsMatch) {
            return response()->json([
                'message' => 'Access Denied: Current device state does not match your saved profile.'
            ], 401);
        }

        return response()->json([
            'message' => 'Authentication Successful'
        ], 200);
    }
}
