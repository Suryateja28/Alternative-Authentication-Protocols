<?php

namespace App\Http\Controllers;

use App\Models\SeventhBoxUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SeventhBoxAuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:seventh_box_users,email',
            'emojis' => 'required|array|size:4',
            'emojis.*' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        SeventhBoxUser::create([
            'email' => $request->email,
            'emojis' => $request->emojis,
        ]);

        return response()->json([
            'message' => 'Emoji Sequence Registered Successfully'
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'emojis' => 'required|array|size:4',
            'emojis.*' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        $user = SeventhBoxUser::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Authentication Failed – Emojis Not Matched.'
            ], 401);
        }

        if ($user->emojis !== $request->emojis) {
            return response()->json([
                'message' => 'Authentication Failed – Emojis Not Matched.'
            ], 401);
        }

        return response()->json([
            'message' => 'Correct password',
        ], 200);
    }
}
