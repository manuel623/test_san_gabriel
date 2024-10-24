<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduleModel extends Model
{
    use HasFactory;

    protected $table = 'schedules';

    protected $fillable = [
        'execution_time',
        'video_id'
    ];

    public function video()
    {
        return $this->belongsTo(VideoModel::class, 'video_id');
    }
}
