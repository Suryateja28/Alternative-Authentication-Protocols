<?php

namespace App\Http\Controllers;

use App\Models\FourthBoxUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FourthBoxAuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:fourth_box_users,email',
            'rhythm' => 'required|array|min:3',
            'rhythm.*' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        FourthBoxUser::create([
            'email' => $request->email,
            'rhythm' => $request->rhythm,
        ]);

        return response()->json([
            'message' => 'Rhythm Registered Successfully'
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'rhythm' => 'required|array|min:3',
            'rhythm.*' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        $user = FourthBoxUser::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Authentication Failed – Rhythm Not Matched.'
            ], 401);
        }

        $registeredRhythm = $user->rhythm;
        $attemptRhythm = $request->rhythm;

        if (count($registeredRhythm) !== count($attemptRhythm)) {
            return response()->json([
                'message' => 'Authentication Failed – Rhythm Length Mismatch.'
            ], 401);
        }

        $TOLERANCE = 300; // ±300ms tolerance per tap interval
        $isMatch = true;

        for ($i = 0; $i < count($registeredRhythm); $i++) {
            $diff = abs($registeredRhythm[$i] - $attemptRhythm[$i]);
            if ($diff > $TOLERANCE) {
                $isMatch = false;
                break;
            }
        }

        if (!$isMatch) {
            return response()->json([
                'message' => 'Authentication Failed – Rhythm Not Matched.'
            ], 401);
        }

        return response()->json([
            'message' => 'Correct password',
        ], 200);
    }
}
