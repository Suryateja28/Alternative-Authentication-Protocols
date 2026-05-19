<?php

namespace App\Http\Controllers;

use App\Models\AuthenticationAttempt;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use MongoDB\Client as MongoClient;

class FolderAuthenticationController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160', Rule::unique('users', 'email')],
            'folder_count' => ['required', 'integer', 'min:6', 'max:24'],
            'sequence' => ['required', 'array', 'size:3'],
            'sequence.*' => ['required', 'string'],
        ]);

        $allowedFolders = $this->folderIds((int) $validated['folder_count']);
        abort_unless(count(array_unique($validated['sequence'])) === 3, 422, 'Choose three different folders.');
        abort_unless(empty(array_diff($validated['sequence'], $allowedFolders)), 422, 'Selected folders are not part of the grid.');

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make(str()->password(32)),
            'folder_count' => $validated['folder_count'],
            'folder_sequence' => array_values($validated['sequence']),
            'is_admin' => User::query()->count() === 0,
        ]);

        $this->storeUserInMongo([
            'name' => $user->name,
            'email' => $user->email,
            'folder_count' => $user->folder_count,
            'folder_sequence' => $user->folder_sequence,
            'is_admin' => $user->is_admin,
            'registered_at' => now()->toDateTimeString(),
        ]);

        Auth::login($user);

        return response()->json([
            'message' => 'Registration complete.',
            'user' => $this->userPayload($user),
        ], 201);
    }

    public function challenge(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user) {
            return response()->json([
                'message' => 'No account found for that email.',
            ], 404);
        }

        $folders = collect($this->folderIds($user->folder_count))
            ->shuffle()
            ->values()
            ->map(fn (string $id, int $index) => [
                'id' => $id,
                'label' => 'Folder '.str($id)->after('folder-'),
            ]);

        return response()->json([
            'folder_count' => $user->folder_count,
            'folders' => $folders,
        ]);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'sequence' => ['required', 'array', 'size:3'],
            'sequence.*' => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();
        $success = $user && $user->folder_sequence === array_values($validated['sequence']);

        AuthenticationAttempt::create([
            'user_id' => $user?->id,
            'email' => $validated['email'],
            'successful' => $success,
            'selected_count' => count($validated['sequence']),
            'ip_address' => $request->ip(),
            'user_agent' => (string) $request->userAgent(),
        ]);

        if (! $success) {
            return response()->json([
                'message' => 'The selected folder sequence did not match.',
            ], 422);
        }

        $user->forceFill(['last_login_at' => now()])->save();
        Auth::login($user);

        return response()->json([
            'message' => 'Authentication successful.',
            'user' => $this->userPayload($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Signed out.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user() ? $this->userPayload($request->user()) : null,
        ]);
    }

    public function stats(Request $request): JsonResponse
    {
        abort_unless($request->user(), 401);

        $attempts = AuthenticationAttempt::latest()->take(12)->get();
        $total = AuthenticationAttempt::count();
        $failed = AuthenticationAttempt::where('successful', false)->count();
        $users = User::count();

        return response()->json([
            'summary' => [
                'users' => $users,
                'attempts' => $total,
                'success_rate' => $total === 0 ? 100 : round((($total - $failed) / $total) * 100),
                'failed_attempts' => $failed,
            ],
            'attempts' => $attempts->map(fn (AuthenticationAttempt $attempt) => [
                'email' => $attempt->email,
                'successful' => $attempt->successful,
                'ip_address' => $attempt->ip_address,
                'created_at' => $attempt->created_at->diffForHumans(),
            ]),
        ]);
    }

    private function folderIds(int $count): array
    {
        return collect(range(0, $count - 1))
            ->map(fn (int $number) => 'folder-'.$number)
            ->all();
    }

    private function storeUserInMongo(array $payload): void
    {
        if (! class_exists(MongoClient::class)) {
            return;
        }

        try {
            $client = new MongoClient(env('MONGO_URI', 'mongodb://127.0.0.1:27017'));
            $database = $client->selectDatabase(env('MONGO_DB', 'tradition_credential'));
            $database->selectCollection('users')->insertOne($payload);
        } catch (\Throwable $exception) {
            // If MongoDB is unavailable, continue without breaking registration.
        }
    }

    private function userPayload(User $user): array
    {
        return [
            'name' => $user->name,
            'email' => $user->email,
            'folder_count' => $user->folder_count,
            'is_admin' => $user->is_admin,
            'last_login_at' => $user->last_login_at?->toDayDateTimeString(),
        ];
    }
}
