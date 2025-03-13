<?php

namespace App\Http\Controllers;

use App\Models\Site; // Adjust the namespace according to your model's location
use App\Models\Blog; // Adjust the namespace according to your model's location
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SiteController extends Controller
{
    public function index()
    {
        try {
            $sites = Site::orderBy('queue', 'desc')->with('blogs')->get();

            $data = $sites->map(function ($site) {
                $siteData = $site->toArray();

                unset($siteData['blogs']);

                $siteData['blog_types'] = $site->blogs->pluck('blog_type')->flatten()->unique()->values();

                return $siteData;
            });

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching data'], 400);
        }
    }

    public function getSixSites()
    {
        try {
            $data = Site::orderBy('queue', 'desc')->with('blogs')->take(6)->get();
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching data'], 400);
        }
    }

    public function store(Request $request)
    {
        $data = $request->all();

        if (isset($data['siteTags'])) {
            $data['siteTags'] = json_decode($data['siteTags'], true); // Decode as associative array
        }

        $data['video'] = $request->file('video') ? uploadVideoOrImage($request->file('video'), 'site') : '';
        try {
            $site = Site::create($data);
            return response()->json(['message' => 'Successfully saved!'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error saving data'], 400);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $site = Site::findOrFail($id);
            $data = $request->all();
            if (isset($data['siteTags'])) {
                $data['siteTags'] = json_decode($data['siteTags'], true); // Decode as associative array
            }
            $data['video'] = $request->file('video')
                ? uploadVideoOrImage($request->file('video'), 'site') // Adjust path as needed
                : $site->video;

            if ($request->file('video')) {
                \Storage::disk('public')->delete(str_replace(url('storage') . '/', '', $site->video));
            }
            $site->update($data);

            return response()->json([
                'message' => 'site successfully updated!',
                'updatedsite' => $site,
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error updating site: ' . $e->getMessage());
            return response()->json(['error' => 'Error updating site data'], 400);
        }
    }

    public function destroy($id)
    {
        try {
            $siteToDelete = Site::findOrFail($id);

            if ($siteToDelete->video) {
                \Storage::disk('public')->delete(str_replace(url('storage') . '/', '', $siteToDelete->video));
            }
            Blog::where('site_id', $id)->update(['site_id' => null]);
            $siteToDelete->delete();
            $remainingSites = Site::all();

            return response()->json($remainingSites);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error deleting site: ' . $e->getMessage()], 400);
        }
    }



    public function show($id)
    {
        try {
            $site = Site::with('blogs')->findOrFail($id);
            return response()->json($site);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Publication not found'], 404);
        }
    }

    public function swapSitesQueue(Request $request)
    {
        DB::beginTransaction(); // Start a database transaction

        try {
            // Validate the request
            $request->validate([
                'firstBlogId' => 'required|exists:sites,id',
                'secondBlogId' => 'required|exists:sites,id'
            ]);

            // Get the two blogs
            $firstBlog = Site::findOrFail($request->firstBlogId);
            $secondBlog = Site::findOrFail($request->secondBlogId);

            // Temporarily disable foreign key checks (if needed)
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');

            // Generate a temporary ID that is guaranteed not to conflict
            $tempId = Site::max('id') + 1; // Use the highest ID + 1 as a temporary ID

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
