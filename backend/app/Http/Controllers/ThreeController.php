<?php

namespace App\Http\Controllers;

use App\Models\Three;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\DB;

class ThreeController extends Controller
{
    public function index()
    {
        $threes = Three::all();
        return response()->json($threes);
    }

    public function show($id)
    {
        $three = Three::find($id);

        if (!$three) {
            return response()->json(['message' => 'Three not found'], 404);
        }

        return response()->json($three);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['video'] = $request->file('video') ? uploadVideoOrImage($request->file('video'), 'three') : '';
        try {
            $newThree = Three::create($data);
            return response()->json([
                'message' => 'Three created successfully!',
                'Three' => $newThree
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error saving data: ' . $e->getMessage());
            return response()->json(['error' => 'Error saving data'], 400);
        }
    }

    // public function store(Request $request)
    // {
    //     $data = $request->all();

    //     if ($request->file('video')) {
    //         try {
    //             $uploadedFileUrl = Cloudinary::uploadVideo($request->file('video')->getRealPath(), [
    //                 'folder' => 'uploads/three'
    //             ])->getSecurePath();
    //             $data['video'] = $uploadedFileUrl;
    //         } catch (\Exception $uploadException) {
    //             return response()->json(['error' => 'Cloudinary upload failed'], 500);
    //         }
    //     } else {
    //         $data['video'] = '';
    //     }

    //     try {
    //         $newThree = Three::create($data);
    //         return response()->json([
    //             'message' => 'Three created successfully!',
    //             'Three' => $newThree
    //         ], 200);
    //     } catch (\Exception $e) {
    //         return response()->json(['error' => 'Error saving data'], 400);
    //     }
    // }

    public function update(Request $request, $id)
    {
        try {
            $three = Three::findOrFail($id);
            $data = $request->all();
            $data['video'] = $request->file('video')
                ? uploadVideoOrImage($request->file('video'), 'three') // Adjust path as needed
                : $three->video;

            if ($request->file('video')) {
                \Storage::disk('public')->delete(str_replace(url('storage') . '/', '', $three->video));
            }
            $three->update($data);

            return response()->json([
                'message' => 'three successfully updated!',
                'updatedthree' => $three,
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error updating three: ' . $e->getMessage());
            return response()->json(['error' => 'Error updating three data'], 400);
        }
    }
    public function destroy($id)
    {
        try {
            $three = Three::findOrFail($id);
            if ($three->video) {
                \Storage::disk('public')->delete(str_replace(url('storage') . '/', '', $three->video));
            }
            Blog::where('three_id', $id)->update(['three_id' => null]);
            $three->delete();

            $threes = Three::all();
            return response()->json($threes, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error deleting three'], 400);
        }
    }

    public function swapThreeQueue(Request $request)
    {
        DB::beginTransaction(); // Start a database transaction

        try {
            // Validate the request
            $request->validate([
                'firstBlogId' => 'required|exists:threes,id',
                'secondBlogId' => 'required|exists:threes,id'
            ]);

            // Get the two blogs
            $firstBlog = Three::findOrFail($request->firstBlogId);
            $secondBlog = Three::findOrFail($request->secondBlogId);

            // Temporarily disable foreign key checks (if needed)
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');

            // Generate a temporary ID that is guaranteed not to conflict
            $tempId = Three::max('id') + 1; // Use the highest ID + 1 as a temporary ID

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
