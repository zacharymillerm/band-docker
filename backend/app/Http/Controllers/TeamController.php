<?php

namespace App\Http\Controllers;

use App\Models\Team; // Adjust the namespace according to your model's location
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeamController extends Controller
{
    public function createOrUpdateTeam(Request $request)
    {
        try {
            $data = $request->all();

            // Handle avatar upload
            if ($request->hasFile('avatar')) {
                $data['avatar'] = url('storage/' . $request->file('avatar')->store('uploads/teams', 'public'));
            }

            // Handle teamPic upload
            if ($request->hasFile('teamPic')) {
                $data['teamPic'] = url('storage/' . $request->file('teamPic')->store('uploads/teams', 'public'));
            }

            // Check if the request has an ID (update scenario)
            if ($request->has('id')) {
                $team = Team::find($request->id);
                if ($team) {
                    $team->update($data);
                    return response()->json(['message' => 'Team data successfully updated!', 'team' => $team], 200);
                }
            }

            // Create new team entry if no ID is provided or team not found
            $newTeam = Team::create($data);
            return response()->json(['message' => 'Team data successfully saved!', 'team' => $newTeam], 201);
        } catch (\Exception $e) {
            \Log::error('Error saving or updating team data: ' . $e->getMessage());
            return response()->json(['error' => 'Error saving or updating team data'], 400);
        }
    }

    public function getTeam()
    {
        try {
            $lastTeam = Team::latest()->first(); // Fetch all team entries
            return response()->json($team, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching data'], 400);
        }
    }

    public function swapTeamQueue(Request $request)
    {
        DB::beginTransaction(); // Start a database transaction
    
        try {
            // Validate the request
            $request->validate([
                'firstBlogId' => 'required|exists:teams,id',
                'secondBlogId' => 'required|exists:teams,id'
            ]);
    
            // Get the two blogs
            $firstBlog = Team::findOrFail($request->firstBlogId);
            $secondBlog = Team::findOrFail($request->secondBlogId);
    
            // Temporarily disable foreign key checks (if needed)
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
    
            // Generate a temporary ID that is guaranteed not to conflict
            $tempId = Team::max('id') + 1; // Use the highest ID + 1 as a temporary ID
    
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
