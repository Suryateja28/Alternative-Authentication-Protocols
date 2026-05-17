<?php

use App\Http\Controllers\FolderAuthenticationController;
use App\Http\Controllers\BoxAuthSubmissionController;
use App\Http\Controllers\CertificateAuthenticationController;
use App\Http\Controllers\FirstBoxAuthController;
use App\Http\Controllers\SecondBoxAuthController;
use App\Http\Controllers\ThirdBoxAuthController;
use Illuminate\Support\Facades\Route;

Route::get('/api/me', [FolderAuthenticationController::class, 'me']);
Route::post('/api/register', [FolderAuthenticationController::class, 'register']);
Route::post('/api/challenge', [FolderAuthenticationController::class, 'challenge']);
Route::post('/api/login', [FolderAuthenticationController::class, 'login']);
Route::post('/api/logout', [FolderAuthenticationController::class, 'logout']);
Route::get('/api/stats', [FolderAuthenticationController::class, 'stats']);
Route::post('/api/box-auth-submissions', [BoxAuthSubmissionController::class, 'store']);
Route::post('/api/certificate-challenge', [CertificateAuthenticationController::class, 'challenge']);
Route::post('/api/certificate-verify', [CertificateAuthenticationController::class, 'verify']);

Route::post('/api/firstbox/register', [FirstBoxAuthController::class, 'register']);
Route::post('/api/firstbox/login', [FirstBoxAuthController::class, 'login']);

Route::post('/api/secondbox/register', [SecondBoxAuthController::class, 'register']);
Route::post('/api/secondbox/check-email', [SecondBoxAuthController::class, 'checkEmail']);
Route::post('/api/secondbox/login', [SecondBoxAuthController::class, 'login']);

Route::post('/api/thirdbox/register', [ThirdBoxAuthController::class, 'register']);
Route::post('/api/thirdbox/login', [ThirdBoxAuthController::class, 'login']);

Route::get('/{any?}', function () {
    return view('welcome');
})->where('any', '^(?!api).*$');
