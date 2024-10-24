<?php

namespace App\Http\Controllers;

use App\Services\VideoService;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    protected $videoService;

    /**
    * Instancia el servicio VideoService
    */
    public function __construct(VideoService $videoService)
    {
        $this->videoService = $videoService;
    }

    /** 
    * Funcion para listar los videos 
    */
    public function listVideo()
    {
        $data = $this->videoService->listVideo();
        return response()->json($data);
    }

    /** 
    * Funcion para crear los videos 
    */
    public function createVideo(Request $request)
    {
        $data = $this->videoService->createVideo($request);
        return response()->json($data, 201);
    }

    /** 
    * Funcion para actualizar los videos 
    */
    public function updateVideo(Request $request, $id)
    {
        $data = $this->videoService->updateVideo($request, $id);
        return response()->json($data);
    }

    /** 
    * Funcion para eliminar los videos 
    */
    public function deleteVideo($id){
        $data = $this->videoService->deleteVideo($id);
        return response()->json($data);
    }

    /** 
    * Funcion para programar videos 
    */
    public function scheduleVideo(Request $request)
    {
        $data = $this->videoService->scheduleVideo($request);
        return response()->json($data, 201);
    }

    /** 
    * Funcion para listar los videos programados
    */
    public function listSchedule()
    {
        $data = $this->videoService->listSchedule();
        return response()->json($data);
    }

    /** 
    * Funcion para obtener los videos programados
    */
    public function getVideoShcedules()
    {
        $data = $this->videoService->getVideoShcedules();
        return response()->json($data);
    }
}
