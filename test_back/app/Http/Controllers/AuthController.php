<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Verificación de login
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $user = User::where('email', $credentials['email'])
            ->select('*')
            ->first();

        if (!$user) {
            return response()->json(['error' => "El correo electrónico proporcionado no está registrado."], 403);
        }
        // se verifica la contraseña
        if (!\Illuminate\Support\Facades\Hash::check($credentials['password'], $user->password)) {
            return response()->json(['error' => "La contraseña proporcionada es incorrecta."], 403);
        }
        // al iniciar sesión, se crea un token
        $tokenResult = $user->createToken('TokenLogin');
        $token = $tokenResult->accessToken;
        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
    }

    /**
     * Se cierra sesión
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        //se elimina el token creado
        if ($user) {
            $user->token()->revoke();
            return response()->json(['message' => 'Se cerró la sesión exitosamente']);
        }
        return response()->json(['error' => 'Usuario no autenticado.'], 401);
    }
}
