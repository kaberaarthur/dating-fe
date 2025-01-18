import React, { useEffect, useState } from 'react';
import config from "../../data/config.json";

// Define TypeScript types for the user profile data
interface UserProfile {
    id: number;
    user_id: number;
    name: string;
    date_of_birth: string;
    gender: string;
    bio: string;
    reason: string;
    interests: string;
    created_at: string;
    updated_at: string;
    county: string | null;
    town: string | null;
    active: number;
}

const Users: React.FC = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
    const [genderFilter, setGenderFilter] = useState<string>('');
    const [userTypeFilter, setUserTypeFilter] = useState<string>('');
    const [idFilter, setIdFilter] = useState<string>('');

    const manualAuthToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJrYWJlcmFAZXhhbXBsZS5jb20iLCJ1c2VyX3R5cGUiOiJhZG1pbiIsImlhdCI6MTczNzE4NDM1MywiZXhwIjoxNzM3MjI3NTUzfQ.ESu11e-DvLC0tmDJYQMpXtE8bA4PrEyaSZ_St5-teJA"

    // Fetch users from the API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${config.baseUrl}/api/user-profiles`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${manualAuthToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data: UserProfile[] = await response.json();
                setUsers(data);
                setFilteredUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    // Filter users based on dropdown selections
    useEffect(() => {
        let filtered = users;

        if (genderFilter) {
            filtered = filtered.filter(user => user.gender === genderFilter);
        }

        if (userTypeFilter) {
            filtered = filtered.filter(user => user.reason === userTypeFilter);
        }

        if (idFilter) {
            filtered = filtered.filter(user => user.id.toString().includes(idFilter));
        }

        setFilteredUsers(filtered);
    }, [genderFilter, userTypeFilter, idFilter, users]);

    // Change active status of a user
    const toggleActiveStatus = async (userId: number, currentStatus: number) => {
        try {
            const response = await fetch(`${config.baseUrl}/api/user-profiles/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${manualAuthToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ active: currentStatus === 1 ? 0 : 1 })
            });

            if (!response.ok) {
                throw new Error('Failed to update user status');
            }

            const updatedUser = await response.json();
            setUsers(prevUsers => prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user));
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">User Profiles</h1>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <select
                    className="p-2 border rounded-md"
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                >
                    <option value="">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>

                <select
                    className="p-2 border rounded-md"
                    value={userTypeFilter}
                    onChange={(e) => setUserTypeFilter(e.target.value)}
                >
                    <option value="">All User Types</option>
                    <option value="Long term Relationship">Long Term Relationship</option>
                    <option value="Short term Relationship">Short Term Relationship</option>
                </select>

                <input
                    type="text"
                    className="p-2 border rounded-md"
                    placeholder="Filter by ID"
                    value={idFilter}
                    onChange={(e) => setIdFilter(e.target.value)}
                />
            </div>

            {/* Table */}
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="text-left p-4">ID</th>
                        <th className="text-left p-4">Name</th>
                        <th className="text-left p-4">Gender</th>
                        <th className="text-left p-4">Date of Birth</th>
                        <th className="text-left p-4">Bio</th>
                        <th className="text-left p-4">Interests</th>
                        <th className="text-left p-4">County</th>
                        <th className="text-left p-4">Town</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <tr key={user.id} className="border-t">
                                <td className="p-4">{user.id}</td>
                                <td className="p-4">{user.name}</td>
                                <td className="p-4 capitalize">{user.gender}</td>
                                <td className="p-4">{new Date(user.date_of_birth).toLocaleDateString()}</td>
                                <td className="p-4">{user.bio}</td>
                                <td className="p-4">
                                    {(() => {
                                        try {
                                            const parsedInterests = JSON.parse(user.interests);
                                            return Array.isArray(parsedInterests) ? parsedInterests.join(', ') : user.interests;
                                        } catch {
                                            return user.interests;
                                        }
                                    })()}
                                </td>
                                <td className="p-4">{user.county || 'N/A'}</td>
                                <td className="p-4">{user.town || 'N/A'}</td>
                                
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={10} className="text-center p-4">
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
