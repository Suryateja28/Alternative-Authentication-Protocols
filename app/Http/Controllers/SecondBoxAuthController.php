<?php

namespace App\Http\Controllers;

use App\Models\SecondBoxUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class SecondBoxAuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:second_box_users,email',
            'password' => 'required|string',
            'delay' => 'required|integer|min:1|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        SecondBoxUser::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'delay' => $request->delay,
        ]);

        return response()->json([
            'message' => 'Account Created Successfully'
        ], 201);
    }

    public function checkEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        $user = SecondBoxUser::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Email not found.'
            ], 404);
        }

        return response()->json([
            'delay' => $user->delay
        ], 200);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
            'timings' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        $user = SecondBoxUser::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Authentication Failed'
            ], 401);
        }

        $expectedDelay = $user->delay;
        $timings = $request->timings;
        $TOLERANCE = 0.2; // 0.2 seconds tolerance for minor timing discrepancies

        // Timing array contains the time passed between keystrokes in seconds.
        // User must wait AT LEAST the expected delay. Exceeding it is fine.
        foreach ($timings as $timing) {
            if ($timing < ($expectedDelay - $TOLERANCE)) {
                return response()->json([
                    'message' => 'Authentication Failed'
                ], 401);
            }
        }

        return response()->json([
            'message' => 'Authentication Successful'
        ], 200);
    }
}
