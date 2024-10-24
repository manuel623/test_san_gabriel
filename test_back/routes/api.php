<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VideoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', [AuthController::class, 'login']);
Route::get('/getVideoShcedules', [VideoController::class, 'getVideoShcedules']);

Route::middleware('auth:api')->group(function () {
    //Cerrar sesion
    Route::post('/logout', [AuthController::class, 'logout']);
    
    //Usuarios
    Route::prefix('user')->middleware('auth:api')->group(function () {
        Route::get('/listUser', [UserController::class, 'listUser']);
        Route::post('/createUser', [UserController::class, 'createUser']);
        Route::put('/editUser/{id?}', [UserController::class, 'editUser']);
        Route::delete('/deleteUser/{id?}', [UserController::class, 'deleteUser']);
    });

    //Videos
    Route::prefix('video')->middleware('auth:api')->group(function () {
        Route::get('/listVideo', [VideoController::class, 'listVideo']);
        Route::post('/createVideo', [VideoController::class, 'createVideo']);
        Route::post('/updateVideo/{id?}', [VideoController::class, 'updateVideo']);
        Route::delete('/deleteVideo/{id?}', [VideoController::class, 'deleteVideo']);
    });

    //Programacion
    Route::prefix('schedule')->middleware('auth:api')->group(function () {
        Route::get('/listSchedule', [VideoController::class, 'listSchedule']);
        Route::post('/scheduleVideo', [VideoController::class, 'scheduleVideo']);
    });

});