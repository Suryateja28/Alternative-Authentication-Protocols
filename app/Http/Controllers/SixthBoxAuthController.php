<?php

namespace App\Http\Controllers;

use App\Models\SixthBoxUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SixthBoxAuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:sixth_box_users,email',
            'combination' => 'required|array|size:3',
            'combination.*' => 'required|numeric|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        SixthBoxUser::create([
            'email' => $request->email,
            'combination' => $request->combination,
        ]);

        return response()->json([
            'message' => 'Combination Registered Successfully'
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'combination' => 'required|array|size:3',
            'combination.*' => 'required|numeric|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        $user = SixthBoxUser::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Authentication Failed – Combination Not Matched.'
            ], 401);
        }

        if ($user->combination !== array_map('intval', $request->combination)) {
             return response()->json([
                'message' => 'Authentication Failed – Combination Not Matched.'
            ], 401);
        }

        return response()->json([
            'message' => 'Correct password',
        ], 200);
    }
}
