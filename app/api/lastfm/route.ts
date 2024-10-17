import { NextRequest, NextResponse } from 'next/server';

const LAST_FM_API_KEY = process.env.LAST_FM_API_KEY;
const LAST_FM_USERNAME = process.env.LAST_FM_USERNAME;

export const GET = async (req: NextRequest) => {
    // Get the 'period' query parameter
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period');

    if (!period || typeof period !== 'string') {
        return NextResponse.json({ error: 'Invalid period' }, { status: 400 });
    }

    try {
        // Fetch top albums
        const topAlbumsResponse = await fetch(
            `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${LAST_FM_USERNAME}&api_key=${LAST_FM_API_KEY}&format=json&period=${period}`
        );
        const topAlbumsData = await topAlbumsResponse.json();
        const topAlbums = topAlbumsData.topalbums.album.slice(0, 10);

        // Fetch recent tracks
        const recentTracksResponse = await fetch(
            `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LAST_FM_USERNAME}&api_key=${LAST_FM_API_KEY}&format=json&limit=10`
        );
        const recentTracksData = await recentTracksResponse.json();
        const recentTracks = recentTracksData.recenttracks.track;

        const data = { topAlbums, recentTracks, url: req.url };

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error fetching Last.fm data:', error);
        return NextResponse.json({ error: 'Failed to fetch Last.fm data' }, { status: 500 });
    }
};