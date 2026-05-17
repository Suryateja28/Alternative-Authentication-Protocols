<?php

namespace App\Http\Controllers;

use App\Models\BoxAuthSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BoxAuthSubmissionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $allowedBoxes = collect(range(0, 9))
            ->map(fn (int $number) => 'box-'.$number)
            ->all();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160'],
            'selected_boxes' => ['required', 'array', 'min:1', 'max:10'],
            'selected_boxes.*' => ['required', 'string', Rule::in($allowedBoxes)],
        ]);

        $submission = BoxAuthSubmission::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'selected_boxes' => array_values(array_unique($validated['selected_boxes'])),
        ]);

        return response()->json([
            'message' => 'Details saved successfully.',
            'submission' => [
                'id' => $submission->id,
                'name' => $submission->name,
                'email' => $submission->email,
                'selected_boxes' => $submission->selected_boxes,
            ],
        ], 201);
    }
}
