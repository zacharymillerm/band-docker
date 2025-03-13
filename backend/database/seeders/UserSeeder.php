<?php

namespace Database\Seeders;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $email = 'admin@example.com';
        $email2 = 'kevin@example.com';
        $email3 = 'nik@example.com';
        // Delete the user if they exist
        User::where('email', $email)->delete();

        User::create([
            'name' => 'admin',
            'lastname' => 'dev',
            'email' => $email,
            'password' => Hash::make('password123'),
            'adding' => 1,
            'editing' => 1,
            'deleting' => 1,
            'role' => 'super_admin',
        ]);

        User::create([
            'name' => 'Kevin',
            'lastname' => 'dev',
            'email' => $email2,
            'password' => Hash::make('password123'),
            'adding' => 1,
            'editing' => 1,
            'deleting' => 1,
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Nik',
            'lastname' => 'dev',
            'email' => $email3,
            'password' => Hash::make('password123'),
            'adding' => 1,
            'editing' => 1,
            'deleting' => 1,
            'role' => 'admin',
        ]);
    }
}
