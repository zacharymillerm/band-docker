<?php

namespace App\Http\Controllers;

use App\Models\Review; // Assuming your model is named Review
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    public function createReview(Request $request)
    {
        $data = $request->all();

        // Handle file upload (videos or images)
        $data['file'] = $request->hasFile('files')
            ? uploadVideoOrImage($request->file('files'), 'review')
            : '';

        // Handle avatar upload properly
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('uploads/review', 'public');
            $data['avatar'] = url('storage/' . $avatarPath);
        } else {
            $data['avatar'] = '';
        }

        try {
            $newReview = Review::create($data);
            return response()->json(['message' => 'Successfully saved!', 'review' => $newReview], 200);
        } catch (\Exception $e) {
            \Log::error('Error saving data: ' . $e->getMessage());
            return response()->json(['error' => 'Error saving data'], 400);
        }
    }


    public function updateReview(Request $request, $id)
    {
        try {
            $existingReview = Review::findOrFail($id);

            $data = $request->all();

            // Handle avatar update properly
            if ($request->hasFile('avatar')) {
                // Delete old avatar if exists
                if ($existingReview->avatar) {
                    \Storage::disk('public')->delete(str_replace(url('storage') . '/', '', $existingReview->avatar));
                }

                // Store new avatar
                $avatarPath = $request->file('avatar')->store('uploads/review', 'public');
                $data['avatar'] = url('storage/' . $avatarPath);
            } else {
                $data['avatar'] = $existingReview->avatar;
            }

            // Handle file update
            if ($request->hasFile('files')) {
                \Storage::disk('public')->delete(str_replace(url('storage') . '/', '', $existingReview->file));
                $data['file'] = uploadVideoOrImage($request->file('files'), 'review');
            } else {
                $data['file'] = $existingReview->file;
            }

            $existingReview->update($data);

            return response()->json([
                'message' => 'Review successfully updated!',
                'updatedReview' => $existingReview,
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error updating review: ' . $e->getMessage());
            return response()->json(['error' => 'Error updating review data'], 400);
        }
    }

    public function getReviews()
    {
        try {
            $reviews = Review::orderBy('queue', 'desc')->get();
            return response()->json($reviews, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching data'], 400);
        }
    }

    public function getReviewsByType(Request $request)
    {
        $reviewType = $request->query('reviewType');
        try {
            $reviews = Review::whereJsonContains('displayType', $reviewType)
                ->orderBy('queue', 'desc')
                ->get();

            return response()->json($reviews, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching data'], 400);
        }
    }

    public function getReviewById($reviewId)
    {
        try {
            $review = Review::findOrFail($reviewId);
            return response()->json($review, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Review not found'], 404);
        }
    }

    public function deleteReview($reviewId)
    {
        try {
            $review = Review::findOrFail($reviewId);
            if ($review->file) {
                \Storage::disk('public')->delete(str_replace(url('storage') . '/', '', $review->file));
            }
            $review->delete();

            $reviews = Review::all();
            return response()->json($reviews, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error deleting review'], 400);
        }
    }

    public function swapReviewQueue(Request $request)
    {
        DB::beginTransaction(); // Start a database transaction

        try {
            // Validate the request
            $request->validate([
                'firstBlogId' => 'required|exists:reviews,id',
                'secondBlogId' => 'required|exists:reviews,id'
            ]);

            // Get the two blogs
            $firstBlog = Review::findOrFail($request->firstBlogId);
            $secondBlog = Review::findOrFail($request->secondBlogId);

            // Temporarily disable foreign key checks (if needed)
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');

            // Generate a temporary ID that is guaranteed not to conflict
            $tempId = Review::max('id') + 1; // Use the highest ID + 1 as a temporary ID

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
