<?php

namespace App\Http\Controllers;

use App\Models\TenthBoxUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TenthBoxAuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:tenth_box_users,email',
            'morse_code' => 'required|string|min:3|max:15',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        TenthBoxUser::create([
            'email' => $request->email,
            'morse_code' => $request->morse_code,
        ]);

        return response()->json([
            'message' => 'Morse Code Password Registered Successfully'
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'morse_code' => 'required|string|min:3|max:15',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        $user = TenthBoxUser::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Authentication Failed – Morse Code Not Matched.'
            ], 401);
        }

        if ($user->morse_code !== $request->morse_code) {
             return response()->json([
                'message' => 'Authentication Failed – Morse Code Not Matched.'
            ], 401);
        }

        return response()->json([
            'message' => 'Correct password',
        ], 200);
    }
}
