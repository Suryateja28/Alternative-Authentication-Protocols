<?php

namespace App\Http\Controllers;

use App\Models\FirstBoxUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FirstBoxAuthController extends Controller
{
    private function calculateDistance($p1, $p2)
    {
        return sqrt(pow($p1['x'] - $p2['x'], 2) + pow($p1['y'] - $p2['y'], 2));
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:first_box_users,email',
            'pattern' => 'required|array|size:4',
            'pattern.*.x' => 'required|numeric',
            'pattern.*.y' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        FirstBoxUser::create([
            'email' => $request->email,
            'pattern' => $request->pattern,
        ]);

        return response()->json([
            'message' => 'Pattern Registered Successfully'
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'pattern' => 'required|array|size:4',
            'pattern.*.x' => 'required|numeric',
            'pattern.*.y' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        $user = FirstBoxUser::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Authentication Failed – Spots Not Matched.'
            ], 401);
        }

        $TOLERANCE = 15;
        $isMatch = true;

        for ($i = 0; $i < 4; $i++) {
            $distance = $this->calculateDistance($user->pattern[$i], $request->pattern[$i]);
            if ($distance > $TOLERANCE) {
                $isMatch = false;
                break;
            }
        }

        if (!$isMatch) {
            return response()->json([
                'message' => 'Authentication Failed – Spots Not Matched.'
            ], 401);
        }

        return response()->json([
            'message' => 'Correct password',
        ], 200);
    }
}
