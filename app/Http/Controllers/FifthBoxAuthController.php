<?php

namespace App\Http\Controllers;

use App\Models\FifthBoxUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FifthBoxAuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:fifth_box_users,email',
            'sequence' => 'required|array|size:4',
            'sequence.*' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        FifthBoxUser::create([
            'email' => $request->email,
            'sequence' => $request->sequence,
        ]);

        return response()->json([
            'message' => 'Color Sequence Registered Successfully'
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'sequence' => 'required|array|size:4',
            'sequence.*' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        $user = FifthBoxUser::where('email', $request->email)->first();

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
