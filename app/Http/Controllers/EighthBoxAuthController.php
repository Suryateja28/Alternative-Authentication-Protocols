<?php

namespace App\Http\Controllers;

use App\Models\EighthBoxUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EighthBoxAuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:eighth_box_users,email',
            'sequence' => 'required|array|min:4|max:8',
            'sequence.*' => 'required|string|in:UP,DOWN,LEFT,RIGHT',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        EighthBoxUser::create([
            'email' => $request->email,
            'sequence' => $request->sequence,
        ]);

        return response()->json([
            'message' => 'Directional Sequence Registered Successfully'
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'sequence' => 'required|array|min:4|max:8',
            'sequence.*' => 'required|string|in:UP,DOWN,LEFT,RIGHT',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        $user = EighthBoxUser::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Authentication Failed – Sequence Not Matched.'
            ], 401);
        }

        if ($user->sequence !== $request->sequence) {
             return response()->json([
                'message' => 'Authentication Failed – Sequence Not Matched.'
            ], 401);
        }

        return response()->json([
            'message' => 'Correct password',
        ], 200);
    }
}
