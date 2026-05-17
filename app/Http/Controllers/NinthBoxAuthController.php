<?php

namespace App\Http\Controllers;

use App\Models\NinthBoxUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NinthBoxAuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:ninth_box_users,email',
            'grid_state' => 'required|array|size:9',
            'grid_state.*' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        NinthBoxUser::create([
            'email' => $request->email,
            'grid_state' => $request->grid_state,
        ]);

        return response()->json([
            'message' => 'Pixel Grid Registered Successfully'
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'grid_state' => 'required|array|size:9',
            'grid_state.*' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        $user = NinthBoxUser::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Authentication Failed – Grid Pattern Not Matched.'
            ], 401);
        }

        // Standardize json encoding comparison or direct strict array comparison usually works for booleans
        if ($user->grid_state !== $request->grid_state) {
            return response()->json([
                'message' => 'Authentication Failed – Grid Pattern Not Matched.'
            ], 401);
        }

        return response()->json([
            'message' => 'Correct password',
        ], 200);
    }
}
