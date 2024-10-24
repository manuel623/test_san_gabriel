<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UsuarioService
{   
    /**
     * Obtiene todos los usuarios
     */
    public function listUser(){
        return DB::table("users")->get();
    }

    /**
     * Crea un usuario
     */
    public function createUser($data){
        $validator = $this->validatorUser($data);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 400);
        }
        try {
            DB::beginTransaction();
            $usuario = User::create([
                'name' => $data->input('name'),
                'email' => $data->input('email'),
                'password' => bcrypt($data->input('password')) //guarda la contraseña encriptada
            ]);
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Usuario registrado con éxito',
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Edita un usuario
     */
    public function editUser($data, $id)
    {
        $validator = $this->validatorUser($data, $id);
        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 400);
        }
        try {
            DB::beginTransaction();
            $usuario = User::find($id);
            if (!$usuario) {
                return response()->json(['success' => false, 'message' => 'Usuario no encontrado'], 404);
            }

            $usuario->update([
                'name' => $data->input('name'),
                'email' => $data->input('email'),
                'password' => bcrypt($data->input('password')),  // encripta la nueva contraseña
            ]);
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Usuario actualizado con éxito',
            ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }    

    /**
     * Elimina un usuario
     */
    public function deleteUser($id){
        $user = User::find($id);

        if ($user) {
            $user->delete();
            return response()->json(['success' => true, 'message' => 'Usuario eliminado con éxito.']);
        } else {
            return response()->json(['success' => false, 'message' => 'Usuario no encontrado.'], 404);
        }
    }

    /**
     * Validaciones a la hora de crear un nuevo usuario
     */
    public function validatorUser($data, $userId = null)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'password' => $userId ? 'nullable|min:7|max:20' : 'required|min:7|max:20'
        ];

        $validator = Validator::make($data->all(), $rules);

        return $validator;
    }

}