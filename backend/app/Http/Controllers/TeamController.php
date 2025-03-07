<?php

namespace App\Http\Controllers;

use App\Models\Team; // Adjust the namespace according to your model's location
use Illuminate\Http\Request;

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
            $team = Team::all(); // Fetch all team entries
            return response()->json($team, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching data'], 400);
        }
    }

    public function swapTeamQueue(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'firstBlogId' => 'required|exists:blogs,id',
                'secondBlogId' => 'required|exists:blogs,id'
            ]);

            // Get the two blogs
            $firstBlog = Blog::findOrFail($request->firstBlogId);
            $secondBlog = Blog::findOrFail($request->secondBlogId);
            // Simple swap of values
            $temp1 = $firstBlog->id;
            $firstBlog->id = 99999999;
            $firstBlog->save();
            $temp2 = $secondBlog->id;
            $secondBlog->id = $temp1;
            $secondBlog->save();
            $firstBlog->id = $temp2;
            $firstBlog->save();


            return response()->json([
                'message' => 'Blog IDs swapped successfully',
                'blogs' => [
                    'first' => $firstBlog->fresh(),
                    'second' => $secondBlog->fresh()
                ]
            ]);
        } catch (\Exception $error) {
            \Log::error('Error swapping blog IDs: ' . $error->getMessage());
            return response()->json([
                'error' => 'Server error',
                'message' => $error->getMessage()
            ], 500);
        }
    }
}
