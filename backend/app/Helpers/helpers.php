<?php

use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;
use FFMpeg\Format\Video\X264;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

if (!function_exists('convertVideoFormat')) {
    function convertVideoFormat($inputPath, $outputPath, $maxWidth = 1280, $maxHeight = 720, $bitrate = '2M')
    {
        try {
            Log::info('Converting video from ' . $inputPath . ' to ' . $outputPath);

            // Get video dimensions
            $ffprobe = FFMpeg\FFProbe::create();
            $dimensions = $ffprobe->streams(storage_path('app/public/' . $inputPath))
                ->videos()
                ->first()
                ->getDimensions();

            $originalWidth = $dimensions->getWidth();
            $originalHeight = $dimensions->getHeight();

            // Calculate new dimensions while maintaining aspect ratio
            $aspectRatio = $originalWidth / $originalHeight;

            if ($originalWidth > $originalHeight) { // Landscape video
                $newWidth = $maxWidth;
                $newHeight = intval($maxWidth / $aspectRatio);
            } else { // Portrait video
                $newHeight = $maxHeight;
                $newWidth = intval($maxHeight * $aspectRatio);
            }

            // Convert video using FFmpeg while keeping aspect ratio
            FFMpeg::fromDisk('public')
                ->open($inputPath)
                ->export()
                ->toDisk('public')
                ->inFormat(new X264)
                ->resize($newWidth, $newHeight) // Resize while keeping aspect ratio
                ->save($outputPath);

            Log::info('Converted video from ' . $inputPath . ' to ' . $outputPath);

            // Return public URL of the converted file
            return url('storage/' . $outputPath);
        } catch (\Exception $e) {
            Log::error('Error converting video: ' . $e->getMessage());
            return 'Error: ' . $e->getMessage();
        }
    }
}

if (!function_exists('uploadVideoOrImage')) {
    function uploadVideoOrImage($file, $section = 'factory')
    {
        $storedUrl = '';
        $extension = strtolower($file->getClientOriginalExtension());

        if (in_array($extension, ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'])) {
            // Video format
            $videoName = time() . '.mp4';
            Log::info('videoName: ' . $videoName);

            // Store the original uploaded video in the 'public' disk
            $videoPath = $file->storeAs('uploads/' . $section, $videoName, 'public');

            // Define the output path for the converted video
            $convertedPath = 'uploads/' . $section . '/converted_' . $videoName;

            Log::info('videoPath: ' . $videoPath);
            Log::info('convertedPath: ' . $convertedPath);

            // Convert the video format
            $storedUrl = convertVideoFormat($videoPath, $convertedPath);
            
            Storage::disk('public')->delete($videoPath);

            Log::info('storedUrl: ' . $storedUrl);
        } else {
            // Image format
            $path = $file->store('uploads/' . $section, 'public');
            $storedUrl = url('storage/' . $path);
        }

        return $storedUrl;
    }
}