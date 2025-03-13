<?php

namespace App\Http\Controllers;

use App\Models\FactoryShow; // Assuming your model is named Factory
use Carbon\Factory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB; // Import the DB facade

class FactoryController extends Controller
{
    public function index()
    {
        $factory = FactoryShow::orderBy('id', 'desc')->get();
        return response()->json($factory);
    }
    public function top()
    {
        $factory = FactoryShow::orderBy('id', 'desc')->limit(2)->get();
        return response()->json($factory);
    }

    public function show($id)
    {
        $factory = FactoryShow::find($id);

        if (!$factory) {
            return response()->json(['message' => 'Factory not found'], 404);
        }

        return response()->json($factory);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'queue' => 'required|integer|max:255',
            'description' => 'required|string|max:255',
            'video' => 'required|file|mimes:jpg,jpeg,png,mp4,avi,mov,wmv,flv,webm', // Adjust max size as needed
            'links' => 'required|string|max:255',
        ]);

        if ($request->hasFile('video')) {
            $file = $request->file('video');

            $filePath = uploadVideoOrImage($file, 'factory');

            $factory = FactoryShow::create([
                'title' => $request->input('title'),
                'queue' => $request->input('queue'),
                'description' => $request->input('description'),
                'links' => $request->input('links'),
                'video' => $filePath
            ]);

            return response()->json([
                'message' => 'factory created successfully!',
                'factory' => $factory
            ], 200);
        }

        return response()->json(['error' => 'File upload failed'], 400);
    }

    public function update(Request $request, $id)
    {
        $factory = FactoryShow::find($id);

        if (!$factory) {
            return response()->json(['message' => 'factory not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'queue' => 'sometimes|required|integer|max:255',
            'description' => 'sometimes|required|string|max:255',
            'links' => 'sometimes|required|string|max:255',
            'video' => 'sometimes|file|mimes:jpg,jpeg,png,mp4,avi,mov,wmv,flv,webm', // Adjust max size as needed
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $factory->title = $request->title ?? $factory->title;
        $factory->queue = $request->queue ?? $factory->queue;
        $factory->description = $request->description ?? $factory->description;
        $factory->links = $request->links ?? $factory->links;

        if ($request->hasFile('video')) {
            $file = $request->file('video');
            $filePath = uploadVideoOrImage($file, 'factory');

            if ($request->file('video')) {
                \Storage::disk('public')->delete(str_replace(url('storage') . '/', '', $factory->video));
            }

            $factory->video = $filePath;
        }

        $factory->save();

        return response()->json([
            'message' => 'factory updated successfully!',
            'factory' => $factory
        ], 200);
    }

    public function destroy($id)
    {
        try {
            $factory = FactoryShow::find($id);

            if (!$factory) {
                return response()->json(['message' => 'factory not found'], 404);
            }

            if ($factory->video) {
                \Storage::disk('public')->delete(str_replace(url('storage') . '/', '', $factory->video));
            }

            $factory->delete();
            $factorys = FactoryShow::all();

            return response()->json($factorys, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error deleting factory'], 400);
        }
    }

    public function swapFactoryQueue(Request $request)
    {
        DB::beginTransaction(); // Start a database transaction

        try {
            // Validate the request
            $request->validate([
                'firstBlogId' => 'required|exists:factory_shows,id',
                'secondBlogId' => 'required|exists:factory_shows,id'
            ]);

            // Get the two blogs
            $firstBlog = FactoryShow::findOrFail($request->firstBlogId);
            $secondBlog = FactoryShow::findOrFail($request->secondBlogId);

            // Temporarily disable foreign key checks (if needed)
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');

            // Generate a temporary ID that is guaranteed not to conflict
            $tempId = FactoryShow::max('id') + 1; // Use the highest ID + 1 as a temporary ID

            // Swap the IDs
            $firstBlogId = $firstBlog->id;
            $secondBlogId = $secondBlog->id;

            // Update the first blog to the temporary ID
            $firstBlog->id = $tempId;
            $firstBlog->save();

            // Update the second blog to the first blog's ID
            $secondBlog->id = $firstBlogId;
            $secondBlog->save();

            // Update the first blog to the second blog's ID
            $firstBlog->id = $secondBlogId;
            $firstBlog->save();

            // Re-enable foreign key checks
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');

            DB::commit(); // Commit the transaction

            return response()->json([
                'message' => 'Blog IDs swapped successfully',
                'blogs' => [
                    'first' => $firstBlog->fresh(),
                    'second' => $secondBlog->fresh()
                ]
            ]);
        } catch (\Exception $error) {
            DB::rollBack(); // Roll back the transaction on error
            \Log::error('Error swapping blog IDs: ' . $error->getMessage());
            return response()->json([
                'error' => 'Server error',
                'message' => $error->getMessage()
            ], 500);
        }
    }
}
