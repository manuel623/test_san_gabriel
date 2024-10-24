<?php

namespace App\Services;

use App\Models\ScheduleModel;
use App\Models\VideoModel; // Modelo para videos
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class VideoService
{
    /** 
     * Obtiene todos los videos 
     * */
    public function listVideo()
    {
        return DB::table("videos as v")
            ->leftJoin("schedules as s", "v.id", "s.video_id")
            ->select("v.*", "s.execution_time")
            ->orderBy("v.created_at", "asc")
            ->get();
    }

    /** 
     * Crea videos 
     * */
    public function createVideo($data)
    {
        $validator = $this->validatorVideo($data);
        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 400);
        }
        try {
            DB::beginTransaction();
            // manejo del archivo de video
            $videoPath = $data->hasFile('video') ? $data->file('video')->store('videos', 'public') : null;
            // manejo del archivo del banner
            $bannerPath = $data->hasFile('banner') ? $data->file('banner')->store('banners', 'public') : null;

            $video = VideoModel::create([
                'title' => $data->input('title'),
                'type' => $data->input('type'),
                'video_path' => $videoPath,
                'banner_image' => $bannerPath,
                'banner_text' => $data->input('banner_text'),
                'duration' => ($data->input('type') == "BT" ? 30 : $data->input('duration')),
            ]);

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Video registrado con éxito', 'video' => $video], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /** 
     * Actualiza videos 
     * */
    public function updateVideo($data, $id)
    {
        $validator = $this->validatorVideo($data);
        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 400);
        }
        try {
            DB::beginTransaction();
            $video = VideoModel::find($id);
            if (!$video) {
                return response()->json(['success' => false, 'message' => 'Video no encontrado'], 404);
            }
            // manejo del video
            if ($data->hasFile('video')) {
                if ($video->video_path) {
                    Storage::disk('public')->delete($video->video_path);
                }
                $video->video_path = $data->file('video')->store('videos', 'public');
            }
            // manejo del banner
            if ($data->hasFile('banner')) {
                if ($video->banner_image) { // cambia banner_path a banner_image
                    Storage::disk('public')->delete($video->banner_image);
                }
                $video->banner_image = $data->file('banner')->store('banners', 'public');
            }
            

            $video->title = $data->input('title');
            $video->type = $data->input('type');
            $video->banner_text = $data->input('banner_text');
            $video->duration = $data->input('duration');
            $video->save();

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Video actualizado con éxito', 'video' => $video], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Elimina video
     */
    public function deleteVideo($id)
    {
        $video = VideoModel::find($id);
        if ($video) {
            $video->delete();
            if ($video->video_path) {
                Storage::disk('public')->delete($video->video_path);
            }
            if ($video->banner_image) {
                Storage::disk('public')->delete($video->banner_image);
            }

            return response()->json(['success' => true, 'message' => 'Video eliminado con éxito.']);
        } else {
            return response()->json(['success' => false, 'message' => 'Video no encontrado.'], 404);
        }
    }

    /**
     * Se programa un video
     */
    public function scheduleVideo($data)
    {
        try {
            //Se valida que no hayan mas de una programación a la misma hora
            $existSchedules = ScheduleModel::with('video')->where('execution_time', $data->input('execution_time'))->first();
            if (!is_null($existSchedules)) {
                return response()->json(['success' => false, 'message' => 'No se puede programar el video porque ya está ocupado el horario, con el video: ' . $existSchedules->video->title], 500);
            }
            DB::beginTransaction();

            ScheduleModel::where('video_id', $data->input('video_id'))->delete();

            $video = ScheduleModel::create([
                'video_id' => $data->input('video_id'),
                'execution_time' => $data->input('execution_time')
            ]);

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Video programado con éxito', 'video' => $video], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Se listan los contenidos programados
     */
    public function listSchedule()
    {
        return DB::table("schedules")->get();
    }

    /**
     * Se validan los videos ya banners para poder ser guardados
     */
    public function validatorVideo($data)
    {
        //peso maximo 20MB
        $rules = [
            'title' => 'required|string|max:255',
            'video' => 'nullable|file|mimes:mp4,avi,mov|max:20480',
            'banner' => 'nullable|file|mimes:jpg,jpeg,png|max:20480',
        ];

        return Validator::make($data->all(), $rules);
    }

    /**
     * Se obtienen los videos programados
     */
    public function getVideoShcedules()
    {
        return DB::table("videos as v")
            ->leftJoin("schedules as s", "v.id", "s.video_id")
            ->select("v.*", "s.execution_time")
            ->orderBy("v.created_at", "asc")
            ->get();
    }
}
